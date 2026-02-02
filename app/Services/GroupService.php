<?php

namespace App\Services;

use App\Http\Requests\Group\CreateGroupRequest;
use App\Models\Group;
use App\Models\GroupInvitation;
use App\Models\User;
use Illuminate\Support\Collection;

class GroupService
{
    public function userGroups(User $user): Collection
    {
        return $user->groups()
            ->wherePivot('status', 'active')
            ->withCount([
                'users' => function ($query) {
                    $query->where('group_user.status', 'active');
                },
                'challenges' => function ($query) {
                    $query->where('end_date', '>=', now());
                }
            ])
            ->get();
    }


    public function suggestedGroups(User $user): Collection
    {
        return Group::whereNotIn('id', $user->groups->pluck('id'))
            ->withCount([
                'users' => function ($query) {
                    $query->where('group_user.status', 'active');
                },
                'challenges' => function ($query) {
                    $query->where('end_date', '>=', now());
                }
            ])
            ->inRandomOrder()
            ->take(6)
            ->get();
    }


    public function userPendingGroups(User $user): Collection
    {
        return $user->groups()
            ->wherePivot('status', 'pending')
            ->withCount([
                'users' => function ($query) {
                    $query->where('group_user.status', 'active');
                },
                'challenges' => function ($query) {
                    $query->where('end_date', '>=', now());
                }
            ])
            ->get();
    }


    public function groupActiveChallenges(Group $group): Collection
    {
        return $group->challenges()
            ->where('end_date', '>=', now())
            ->get()
            ->map(function ($challenge) {
                $challenge->leaderboard = (new ChallengeService)->getLeaderboard($challenge);
                return $challenge;
            });
    }


    public function groupPastChallenges(Group $group): Collection
    {
        return $group->challenges()
            ->where('end_date', '<', now())
            ->orderBy('end_date', 'desc')
            ->take(20)
            ->get()
            ->map(function ($challenge) {
                $challenge->leaderboard = (new ChallengeService)->getLeaderboard($challenge);
                return $challenge;
            });
    }


    public function getHallOfFame(Collection $pastChallenges): Collection
    {
        $wins = [];

        foreach ($pastChallenges as $challenge) {
            $winner = $challenge->leaderboard->first();

            if ($winner) {
                $userId = $winner->user->id;
                if (!isset($wins[$userId])) {
                    $wins[$userId] = [
                        'user' => $winner->user,
                        'wins' => 0,
                        'latest_win' => $challenge->name
                    ];
                }
                $wins[$userId]['wins']++;
            }
        }

        return collect($wins)
            ->sortByDesc('wins')
            ->values()
            ->take(5);
    }


    public function userCanCreateChallenge(User $user, Group $group)
    {
        return $group->users()
            ->where('users.id', $user->id)
            ->wherePivot('role', 'admin')
            ->exists();
    }



    public function create(CreateGroupRequest $request, int $userId): Group
    {
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('groups', 'public');
        }

        $data = $request->validated();

        $group = Group::create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'privacy' => $data['privacy'],
            'image_path' => $imagePath,
            'owner_id' => $userId,
        ]);

        $group->users()->attach($userId, ['role' => 'admin']);

        return $group;
    }


    public function joinGroup(Group $group, User $user): array
    {
        if ($group->users()->where('user_id', $user->id)->exists()) {
            return ['type' => 'error', 'message' => __('groups_messages_already_member')];
        }

        $status = $group->privacy === 'public' ? 'active' : 'pending';

        $group->users()->attach($user->id, [
            'role' => 'member',
            'status' => $status
        ]);

        $message = $status === 'active'
            ? __('groups_messages_join_success')
            : __('groups_messages_join_pending');

        return ['type' => 'success', 'message' => $message];
    }


    public function leaveGroup(Group $group, User $user, ?int $newAdminId = null): array
    {
        $membersCount = $group->users()->count();

        if ($membersCount <= 1) {
            $group->delete();
            return ['type' => 'success', 'message' => __('groups_messages_group_deleted')];
        }

        $isCurrentAdmin = $group->users()
            ->where('user_id', $user->id)
            ->wherePivot('role', 'admin')
            ->exists();

        if ($isCurrentAdmin) {
            $otherAdminsCount = $group->users()
                ->wherePivot('role', 'admin')
                ->where('users.id', '!=', $user->id)
                ->count();

            if ($otherAdminsCount === 0) {
                if (!$newAdminId) {
                    return ['type' => 'error', 'code' => 'needs_successor', 'message' => __('groups_validation_admin_successor_required')];
                }

                $isValidMember = $group->users()
                    ->where('user_id', $newAdminId)
                    ->where('users.id', '!=', $user->id)
                    ->exists();

                if (!$isValidMember) {
                    return ['type' => 'error', 'message' => __('groups_validation_invalid_member')];
                }

                $group->users()->updateExistingPivot($newAdminId, ['role' => 'admin']);
            }
        }

        $group->users()->detach($user->id);

        return ['type' => 'success', 'message' => __('groups_messages_leave_success')];
    }


    public function approveRequest(Group $group, int $userId): void
    {
        $group->users()->updateExistingPivot($userId, ['status' => 'active']);
    }


    public function removeMember(Group $group, int $userId): array
    {
        if ($group->owner_id === $userId) {
            return ['type' => 'error', 'message' => __('groups_validation_cannot_kick_owner')];
        }

        $group->users()->detach($userId);

        return ['type' => 'success', 'message' => __('groups_messages_remove_success')];
    }


    public function searchGroups(User $user, string $query, string $filter = 'newest'): Collection
    {
        $q = Group::query()
            ->withCount([
                'users' => function ($query) {
                    $query->where('group_user.status', 'active');
                },
                'challenges' => function ($query) {
                    $query->where('end_date', '>=', now());
                }
            ])
            ->where('privacy', 'public')
            ->whereNotIn('id', $user->groups->pluck('id'));

        if (!empty($query)) {
            $q->where('name', 'like', "%{$query}%");
        }

        switch ($filter) {
            case 'most_members':
                $q->orderByDesc('users_count');
                break;
            case 'active':
                $q->orderByDesc('challenges_count');
                break;
            default:
                $q->orderByDesc('created_at');
        }

        return $q->take(12)->get();
    }


    public function inviteUser(Group $group, User $inviter, int $userId): array
    {
        $receiver = null;

        $receiver = User::find($userId);

        if (!$receiver) {
            return ['type' => 'error', 'message' => __('groups_invite_user_not_found')];
        }

        // 2. Verificar se já é membro
        if ($group->users()->where('user_id', $receiver->id)->exists()) {
            return ['type' => 'error', 'message' => __('groups_invite_already_member')];
        }

        // 3. Verificar se já foi convidado
        $exists = GroupInvitation::where('group_id', $group->id)
            ->where('receiver_id', $receiver->id)
            ->where('status', 'pending')
            ->exists();

        if ($exists) {
            return ['type' => 'error', 'message' => __('groups_invite_already_sent')];
        }

        // 4. Criar convite
        GroupInvitation::create([
            'group_id' => $group->id,
            'inviter_id' => $inviter->id,
            'receiver_id' => $receiver->id,
        ]);

        return ['type' => 'success', 'message' => __('groups_invite_sent_success')];
    }


    public function getUserInvitations(User $user): Collection
    {
        return GroupInvitation::where('receiver_id', $user->id)
            ->where('status', 'pending')
            ->with(['group', 'inviter'])
            ->get();
    }


    public function getUserAdminGroups(User $user): Collection
    {
        return $user->groups()
            ->wherePivot('role', 'admin')
            ->wherePivot('status', 'active')
            ->select('groups.id', 'groups.name')
            ->get();
    }


    public function respondInvitation(int $invitationId, User $user, bool $accept): array
    {
        $invitation = GroupInvitation::findOrFail($invitationId);

        if ($invitation->receiver_id !== $user->id) {
            return ['type' => 'success', 'message' => __('groups_invite_not_permissions')];
        }

        if ($accept) {
            if (!$invitation->group->users()->where('user_id', $user->id)->exists()) {
                $invitation->group->users()->attach($user->id, [
                    'role' => 'member',
                    'status' => 'active'
                ]);
            }

            $invitation->update(['status' => 'accepted']);
            $msg = __('groups_invite_accepted');
        } else {
            $invitation->update(['status' => 'rejected']);
            $msg = __('groups_invite_rejected');
        }

        return ['type' => 'success', 'message' => $msg];
    }
}