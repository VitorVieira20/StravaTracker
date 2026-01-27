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
            ->withCount([
                'users',
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
                'users',
                'challenges' => function ($query) {
                    $query->where('end_date', '>=', now());
                }
            ])
            ->inRandomOrder()
            ->take(6)
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
            'image_path' => $imagePath,
            'owner_id' => $userId,
        ]);

        $group->users()->attach($userId, ['role' => 'admin']);

        return $group;
    }
}