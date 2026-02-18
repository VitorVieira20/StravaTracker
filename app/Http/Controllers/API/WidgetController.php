<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\WidgetService;
use Carbon\Carbon;

class WidgetController extends Controller
{
    public function stats($token)
    {
        $parts = explode('-', $token, 2);

        if (count($parts) !== 2) {
            return response()->json(['error' => 'Invalid Token Format'], 200);
        }

        $userId = $parts[0];
        $tokenString = $parts[1];

        $user = User::find($userId);

        if (!$user || $user->widget_token !== $tokenString) {
            return response()->json([
                "weekly_km" => 0,
                "weekly_goal" => 1,
                "goal_percentage" => 0,
                "streak" => 0,
                "error" => "Invalid Token"
            ], 200);
        }

        $widgetService = new WidgetService($user);
        $stats = $widgetService->stats();
        $recentActivities = $widgetService->formatRecentActivities();

        return [
            "weekly_km" => $stats['weekly_km'],
            "weekly_goal" => (int) $stats['weeklyGoal'],
            "goal_percentage" => $stats['goal_percentage'],
            "streak" => $stats['streak'],
            "recent_runs" => $recentActivities
        ];
    }


    public function fullStats($token)
    {
        $parts = explode('-', $token, 2);

        if (count($parts) !== 2) {
            return response()->json(['error' => 'Invalid Token Format'], 200);
        }

        $userId = $parts[0];
        $tokenString = $parts[1];

        $user = User::find($userId);

        if (!$user || $user->widget_token !== $tokenString) {
            return response()->json([
                "goal" => null,
                "stats" => null,
                "history" => [],
                "error" => "Invalid Token"
            ], 200);
        }

        Carbon::setLocale($user->locale ?? 'pt');

        $widgetService = new WidgetService($user);
        $stravaData = $widgetService->formatStravaData();
        $raceGoalData = $widgetService->formatRaceGoalData();
        $history = $widgetService->formatActivitiesHistory();

        return response()->json([
            "goal" => [
                "name" => $raceGoalData['name'],
                "date" => $raceGoalData['date'],
                "days_remaining" => (int) $raceGoalData['days_remaining'],
                "weekly_km" => $raceGoalData['weekly_km'],
                "weekly_target" => $raceGoalData['weekly_target'],
                "weekly_progress" => $raceGoalData['weekly_progress']
            ],
            "stats" => [
                "total_km" => $stravaData['totalDistance'],
                "avg_pace" => $stravaData['recentAvgPace']
            ],
            "history" => $history
        ]);
    }
}