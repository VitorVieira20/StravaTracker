<?php

namespace App\Http\Controllers;

use App\Services\StravaService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if (!$user->stravaAccount) {
            return to_route('strava.index');
        }

        $goal = $user->currentGoal;

        if (!$goal) {
            return to_route('goals.create');
        }

        $stravaService = new StravaService($user->stravaAccount);

        $rawActivities = $stravaService->getRecentActivities(200, $goal->start_date->timestamp);

        $runs = collect($rawActivities)
            ->filter(function ($activity) {
                return $activity['type'] === 'Run';
            })
            ->map(function ($activity) {
                $distanceKm = $activity['distance'] / 1000;
                $movingTimeSeconds = $activity['moving_time'];

                $paceSeconds = $distanceKm > 0 ? $movingTimeSeconds / $distanceKm : 0;

                return [
                    'id' => $activity['id'],
                    'name' => $activity['name'],
                    'start_date_local' => $activity['start_date_local'],
                    'distance_km' => round($distanceKm, 2),
                    'moving_time_seconds' => $movingTimeSeconds,
                    'time_formatted' => gmdate("H:i:s", $movingTimeSeconds),
                    'pace_formatted' => gmdate("i:s", $paceSeconds),
                    'raw_date' => Carbon::parse($activity['start_date_local'])
                ];
            })
            ->values(); // Reindexar array

        $weeklyHistory = $runs->groupBy(function ($run) {
            return $run['raw_date']->startOfWeek()->format('Y-m-d');
        })->map(function ($weekRuns, $weekStartDate) {
            $start = Carbon::parse($weekStartDate);
            $end = $start->copy()->endOfWeek();

            return [
                'week_label' => $start->format('d M') . ' - ' . $end->format('d M'),
                'total_distance' => round($weekRuns->sum('distance_km'), 1),
                'total_time' => floor($weekRuns->sum('moving_time_seconds') / 3600) . 'h ' . gmdate("i", $weekRuns->sum('moving_time_seconds')) . 'm',
                'activity_count' => $weekRuns->count(),
                'activities' => $weekRuns->map(function ($run) {
                    return [
                        'id' => $run['id'],
                        'name' => $run['name'],
                        'date_human' => $run['raw_date']->locale('pt')->isoFormat('dddd, D MMM'), // Ex: "Domingo, 28 Dez"
                        'distance_km' => $run['distance_km'],
                        'pace' => $run['pace_formatted'],
                        'time_formatted' => $run['time_formatted']
                    ];
                })->sortByDesc('raw_date')->values()
            ];
        })->sortKeysDesc()->values();

        $currentWeekStart = Carbon::now()->startOfWeek();
        $currentWeekDistance = $runs->where('raw_date', '>=', $currentWeekStart)->sum('distance_km');

        $last4Runs = $runs->sortByDesc('raw_date')->take(4);
        $avgPaceSeconds = 0;
        if ($last4Runs->sum('distance_km') > 0) {
            $avgPaceSeconds = $last4Runs->sum('moving_time_seconds') / $last4Runs->sum('distance_km');
        }

        $chartData = $weeklyHistory->take(4)->reverse()->map(function ($week) {
            return [
                'name' => substr($week['week_label'], 0, 6),
                'km' => $week['total_distance']
            ];
        })->values();

        return Inertia::render('Dashboard', [
            'raceGoal' => [
                'name' => $goal->name,
                'date' => $goal->race_date->format('d-m-Y'),
                'location' => $goal->location,
                'daysLeft' => now()->diffInDays($goal->race_date, false),
                'weeklyGoal' => $goal->weekly_goal_km,
            ],
            'weeklyHistory' => $weeklyHistory,

            'stravaData' => [
                'currentWeekDistance' => round($currentWeekDistance, 1),
                'totalDistance' => round($runs->sum('distance_km'), 1),
                'recentAvgPace' => gmdate("i:s", $avgPaceSeconds),
                'chartData' => $chartData,
                'activities' => $runs->sortByDesc('raw_date')->take(5)->map(function ($run) {
                    return [
                        'id' => $run['id'],
                        'name' => $run['name'],
                        'date' => $run['raw_date']->diffForHumans(),
                        'distance' => $run['distance_km'],
                        'pace' => $run['pace_formatted'],
                        'time' => $run['time_formatted']
                    ];
                })->values()
            ]
        ]);
    }
}
