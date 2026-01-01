<?php

namespace App\Services;

use App\Models\RaceGoal;

class RaceGoalService
{
    public function formatRaceGoalData(RaceGoal $goal)
    {
        return [
            'name' => $goal->name,
            'date' => $goal->race_date->format('d-m-Y'),
            'location' => $goal->location,
            'distance' => (float) $goal->race_distance,
            'daysLeft' => now()->diffInDays($goal->race_date, false),
            'weeklyGoal' => $goal->weekly_goal_km,
        ];
    }
}