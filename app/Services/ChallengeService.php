<?php

namespace App\Services;

use App\Http\Requests\Challenge\CreateChallengeRequest;
use App\Models\Activity;
use App\Models\Challenge;
use App\Models\Group;
use App\Models\User;
use Exception;

class ChallengeService
{
    public function getLeaderboard(Challenge $challenge)
    {
        $memberIds = $challenge->group->users()->pluck('users.id');

        $column = match ($challenge->type) {
            'total_distance' => 'distance',
            'total_time' => 'moving_time',
            'max_elevation' => 'total_elevation_gain',
            default => 'distance'
        };

        $aggregator = str_contains($challenge->type, 'max') ? 'MAX' : 'SUM';

        return Activity::query()
            ->whereIn('user_id', $memberIds)
            ->where('type', 'Run')
            ->whereBetween('start_date_local', [$challenge->start_date, $challenge->end_date])
            ->selectRaw("user_id, {$aggregator}({$column}) as score")
            ->groupBy('user_id')
            ->orderByDesc('score')
            ->with('user:id,name,avatar')
            ->take(50)
            ->get();
    }


    public function create(CreateChallengeRequest $request, Group $group, User $user)
    {
        $isAdmin = $group->users()
            ->where('users.id', $user->id)
            ->wherePivot('role', 'admin')
            ->exists();

        if (!$isAdmin) {
            throw new Exception(__('challenges_validation_auth_error'));
        }

        return $group->challenges()->create($request->validated());
    }
}