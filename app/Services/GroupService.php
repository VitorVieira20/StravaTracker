<?php

namespace App\Services;

use App\Http\Requests\Group\CreateGroupRequest;
use App\Models\Group;
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
}