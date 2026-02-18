<?php

namespace App\Services;

use App\Models\Activity;
use App\Models\RaceGoal;
use App\Models\User;
use Carbon\Carbon;

class WidgetService
{
    protected RaceGoal $raceGoal;

    public function __construct(protected User $user)
    {
        $this->raceGoal = $user->currentGoal;
    }


    public function stats()
    {
        $runs = Activity::where('user_id', $this->user->id)
            ->where('type', 'Run')
            ->where('start_date_local', '>=', $this->user->currentGoal->start_date)
            ->orderBy('start_date_local', 'asc')
            ->get();

        $currentWeekStart = Carbon::now('UTC')->startOfWeek(Carbon::MONDAY);
        $currentWeekDistance = $runs
            ->where('start_date_local', '>=', $currentWeekStart)
            ->sum('distance_km');

        $weeklyGoal = $this->user->currentGoal->weekly_goal_km;

        $goalPercentage = $weeklyGoal > 0
            ? ($currentWeekDistance / $weeklyGoal) * 100
            : 0;

        return [
            'weekly_km' => round($currentWeekDistance, 1),
            'weeklyGoal' => $weeklyGoal,
            'goal_percentage' => round($goalPercentage, 2),
            'streak' => 2
        ];
    }


    public function formatStravaData()
    {
        $runs = Activity::where('user_id', $this->user->id)
            ->where('type', 'Run')
            ->where('start_date_local', '>=', $this->raceGoal->start_date)
            ->orderBy('start_date_local', 'asc')
            ->get();

        $currentWeekStart = Carbon::now('UTC')->startOfWeek(Carbon::MONDAY);
        $currentWeekDistance = $runs
            ->where('start_date_local', '>=', $currentWeekStart)
            ->sum('distance_km');

        $last4Runs = $runs->slice(-4);
        $avgPaceSeconds = 0;
        if ($last4Runs->sum('distance_km') > 0) {
            $totalTime = $last4Runs->sum('moving_time');
            $totalDistance = $last4Runs->sum('distance_km');
            if ($totalDistance > 0) {
                $avgPaceSeconds = $totalTime / $totalDistance;
            }
        }

        return [
            'currentWeekDistance' => round($currentWeekDistance, 1),
            'totalDistance' => round($runs->sum('distance_km'), 1),
            'recentAvgPace' => gmdate("i:s", $avgPaceSeconds),
        ];
    }


    public function formatRaceGoalData()
    {
        $raceName = "Add Objective";
        $raceDateStr = "--";
        $daysRemaining = 0;
        $weeklyTarget = 40;

        if ($this->raceGoal) {
            $raceName = $this->raceGoal->name;
            $raceDate = Carbon::parse($this->raceGoal->race_date);
            $raceDateStr = $raceDate->translatedFormat('d M Y');

            $daysRemaining = max(0, Carbon::now()->diffInDays($raceDate, false));
            $weeklyTarget = $this->raceGoal->weekly_goal_km;
        }

        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();

        $weeklyKm = $this->user->activities()
            ->whereBetween('start_date_local', [$startOfWeek, $endOfWeek])
            ->sum('distance') / 1000;

        $weeklyProgress = $weeklyTarget > 0 ? ($weeklyKm / $weeklyTarget) * 100 : 0;

        return [
            "name" => $raceName,
            "date" => $raceDateStr,
            "days_remaining" => (int) $daysRemaining,
            "weekly_km" => round($weeklyKm, 1),
            "weekly_target" => (int) $weeklyTarget,
            "weekly_progress" => round($weeklyProgress, 1)
        ];
    }


    public function formatActivitiesHistory()
    {
        return $this->user->activities()
            ->where('start_date_local', '>=', $this->raceGoal->start_date)
            ->orderBy('start_date_local', 'desc')
            ->get()
            ->map(function ($act) {
                $paceSec = $act->distance > 0 ? $act->moving_time / ($act->distance / 1000) : 0;

                return [
                    'id' => $act->id,
                    'name' => $act->name,
                    'date_day' => Carbon::parse($act->start_date_local)->format('d'),
                    'date_month' => Carbon::parse($act->start_date_local)->translatedFormat('M'),
                    'weekday' => Carbon::parse($act->start_date_local)->translatedFormat('D, d M'),
                    'distance' => number_format($act->distance / 1000, 2),
                    'pace' => gmdate("i:s", $paceSec),
                    'time' => gmdate("H:i:s", $act->moving_time),
                    'calories' => (int) $act->calories,
                ];
            });
    }


    public function formatRecentActivities()
    {
        return $this->user->activities()
            ->orderBy('start_date_local', 'desc')
            ->take(3)
            ->get()
            ->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'name' => $activity->name,
                    'date' => Carbon::parse($activity->start_date)->format('d M'),
                    'distance' => round($activity->distance / 1000, 2) . ' km',
                    'time' => gmdate("H:i:s", $activity->moving_time),
                ];
            });
    }
}