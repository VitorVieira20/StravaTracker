<?php

namespace App\Services;

use App\Models\Activity;
use App\Models\RaceGoal;
use App\Models\StravaAccount;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class StravaService
{
    public function __construct()
    {
    }

    public function ensureValidToken(StravaAccount $account)
    {
        if (Carbon::now()->timestamp >= $account->expires_at) {
            try {
                $response = Http::asForm()->post('https://www.strava.com/oauth/token', [
                    'client_id' => config('services.strava.client_id'),
                    'client_secret' => config('services.strava.client_secret'),
                    'grant_type' => 'refresh_token',
                    'refresh_token' => $account->refresh_token,
                ]);

                if ($response->failed()) {
                    throw new Exception('Failed to renew token');
                }

                $data = $response->json();

                $account->update([
                    'access_token' => $data['access_token'],
                    'refresh_token' => $data['refresh_token'],
                    'expires_at' => $data['expires_at'],
                ]);
            } catch (Exception $e) {
                $account->delete();
                throw new Exception('Strava connection expired. Please reconnect.');
            }
        }

        return $account->access_token;
    }

    public function syncActivities()
    {
        $account = $this->getAccount();
        $token = $this->ensureValidToken($account);
        $page = 1;
        $perPage = 200;

        $lastActivityDate = Activity::where('user_id', $account->user_id)
            ->latest('start_date_local')
            ->value('start_date_local');

        $after = $lastActivityDate ? Carbon::parse($lastActivityDate)->timestamp : null;
        $after = null;

        do {
            $response = Http::withToken($token)
                ->get('https://www.strava.com/api/v3/athlete/activities', [
                    'per_page' => $perPage,
                    'page' => $page,
                    'after' => $after,
                ]);

            if ($response->failed()) {
                throw new Exception('Strava Error: ' . $response->body());
            }

            $activities = $response->json();

            foreach ($activities as $activityData) {
                if ($activityData['type'] === 'Run') {
                    Activity::updateOrCreate(
                        [
                            'strava_id' => $activityData['id'],
                            'user_id' => $account->user_id,
                        ],
                        [
                            'name' => $activityData['name'],
                            'type' => $activityData['type'],
                            'start_date_local' => Carbon::parse($activityData['start_date_local']),
                            'timezone' => $activityData['timezone'],
                            'distance' => $activityData['distance'],
                            'moving_time' => $activityData['moving_time'],
                            'elapsed_time' => $activityData['elapsed_time'],
                            'total_elevation_gain' => $activityData['total_elevation_gain'],
                            'average_speed' => $activityData['average_speed'],
                            'max_speed' => $activityData['max_speed'],
                            'average_grade_adjusted_speed' => $activityData['average_grade_adjusted_speed'] ?? null,
                            'average_watts' => $activityData['average_watts'] ?? null,
                            'average_heartrate' => $activityData['average_heartrate'] ?? null,
                            'map_polyline' => $activityData['map']['summary_polyline'] ?? null,
                        ]
                    );
                }
            }

            $page++;

        } while (count($activities) === $perPage);
    }

    public function getWeeklyHistory(Collection $runs)
    {
        return $runs
            ->groupBy(function ($run) {
                return $run->start_date_local->copy()->startOfWeek(Carbon::MONDAY)->format('Y-m-d');
            })
            ->map(function ($weekRuns, $weekStartDate) {
                $startUtc = Carbon::parse($weekStartDate, 'UTC');
                $endUtc = $startUtc->copy()->endOfWeek(Carbon::MONDAY);

                return [
                    'week_label' => $startUtc->format('d M') . ' - ' . $endUtc->format('d M'),
                    'total_distance' => round($weekRuns->sum('distance_km'), 1),
                    'total_time' => floor($weekRuns->sum('moving_time') / 3600) . 'h ' . gmdate("i", $weekRuns->sum('moving_time')) . 'm',
                    'activity_count' => $weekRuns->count(),
                    'activities' => $weekRuns
                        ->sortByDesc('start_date_local')
                        ->values(),
                ];
            })
            ->sortKeysDesc()
            ->values();
    }

    public function formatStravaData(RaceGoal $goal, $shouldSync)
    {
        $account = $this->getAccount();
        if ($shouldSync) {
            $this->syncActivities();
        }

        $runs = Activity::where('user_id', $account->user_id)
            ->where('type', 'Run')
            ->where('start_date_local', '>=', $goal->start_date)
            ->orderBy('start_date_local', 'asc')
            ->get();

        $weeklyHistory = $this->getWeeklyHistory($runs);

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

        $chartData = $weeklyHistory->take(4)->reverse()->map(function ($week) {
            return [
                'name' => substr($week['week_label'], 0, 6),
                'km' => $week['total_distance']
            ];
        })->values();

        $prediction = $this->predictRaceTime($runs, $goal->race_distance ?? 42.195);

        return [
            'stravaData' => [
                'currentWeekDistance' => round($currentWeekDistance, 1),
                'totalDistance' => round($runs->sum('distance_km'), 1),
                'recentAvgPace' => gmdate("i:s", $avgPaceSeconds),
                'racePrediction' => $prediction,
                'chartData' => $chartData,
                'activities' => $runs->slice(-5)->reverse()->map(function ($run) {
                    return [
                        'id' => $run->id,
                        'name' => $run->name,
                        'date_utc' => $run->start_date_local->toIso8601String(),
                        'distance' => $run->distance_km,
                        'pace' => $run->pace_formatted,
                        'time' => $run->time_formatted,
                        'watts' => $run->average_watts
                    ];
                })->values()
            ],
            'weeklyHistory' => $weeklyHistory
        ];
    }

    public function predictRaceTime(Collection $recentRuns, $targetDistanceKm)
    {
        $minDistance = 3;
        if ($targetDistanceKm <= 1) {
            $minDistance = 0.05;
        } elseif ($targetDistanceKm <= 5) {
            $minDistance = 1;
        }

        $relevantRuns = $recentRuns->filter(function ($run) use ($minDistance) {
            return $run->distance_km >= $minDistance;
        });

        if ($relevantRuns->isEmpty()) {
            return null;
        }

        $bestRun = $relevantRuns->sortBy(function ($run) {
            $speed = $run->average_grade_adjusted_speed ?? $run->average_speed;
            return $speed > 0 ? (1 / $speed) : INF;
        })->first();

        $d1 = $bestRun->distance_km;
        $t1_seconds = $bestRun->moving_time;

        if ($d1 <= 0)
            return null;

        $predictedSeconds = $t1_seconds * pow(($targetDistanceKm / $d1), 1.06);

        return [
            'time_formatted' => gmdate("H:i:s", $predictedSeconds),
            'base_run_name' => $bestRun->name,
            'predicted_pace' => gmdate("i:s", $predictedSeconds / $targetDistanceKm)
        ];
    }

    private function getAccount()
    {
        $user = Auth::user();
        if (!$user || !$user->stravaAccount) {
            throw new Exception('User is not authenticated with Strava.');
        }

        return $user->stravaAccount;
    }

    public function getActivities()
    {
        $account = $this->getAccount();
        return Activity::where('user_id', $account->user_id)
            ->orderBy('start_date_local', 'desc')
            ->paginate(20);
    }

    public function getActivity(string $activityId)
    {
        $account = $this->getAccount();
        return Activity::where('user_id', $account->user_id)
            ->where('id', $activityId)
            ->firstOrFail();
    }
}
