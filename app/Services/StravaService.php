<?php

namespace App\Services;

use App\Models\RaceGoal;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class StravaService
{
    protected $account;

    public function __construct($account)
    {
        $this->account = $account;
    }


    protected function ensureValidToken()
    {
        if (Carbon::now()->timestamp >= $this->account->expires_at) {
            try {
                $response = Http::asForm()->post('https://www.strava.com/oauth/token', [
                    'client_id' => config('services.strava.client_id'),
                    'client_secret' => config('services.strava.client_secret'),
                    'grant_type' => 'refresh_token',
                    'refresh_token' => $this->account->refresh_token,
                ]);

                if ($response->failed()) {
                    throw new Exception('Falha ao renovar token');
                }

                $data = $response->json();

                $this->account->update([
                    'access_token' => $data['access_token'],
                    'refresh_token' => $data['refresh_token'],
                    'expires_at' => $data['expires_at'],
                ]);
            } catch (Exception $e) {
                $this->account->delete();
                throw new Exception('A conexão com o Strava expirou. Por favor reconecte.');
            }
        }

        return $this->account->access_token;
    }


    public function getRecentActivities($startDate, $forceRefresh = false)
    {
        $userId = $this->account->user_id;
        $cacheKey = "strava_activities_{$userId}";

        if ($forceRefresh) {
            Cache::forget($cacheKey);
        }

        return Cache::remember($cacheKey, 3600, function () use ($startDate) {

            $token = $this->ensureValidToken();
            $allActivities = [];
            $page = 1;
            $perPage = 200;

            do {
                $response = Http::withToken($token)
                    ->get('https://www.strava.com/api/v3/athlete/activities', [
                        'per_page' => $perPage,
                        'page' => $page,
                        'after' => $startDate
                    ]);

                if ($response->failed()) {
                    throw new Exception('Erro Strava: ' . $response->body());
                }

                $activities = $response->json();
                $allActivities = array_merge($allActivities, $activities);
                $page++;

            } while (count($activities) === $perPage);

            return $allActivities;
        });
    }


    public function filterActivitiesByRun(array $rawActivities): Collection
    {
        return collect($rawActivities)
            ->filter(function ($activity) {
                return $activity['type'] === 'Run';
            })
            ->map(function ($activity) {
                $distanceKm = $activity['distance'] / 1000;
                $movingTimeSeconds = $activity['moving_time'];

                $speedMetersPerSecond = $activity['average_grade_adjusted_speed'] ?? $activity['average_speed'] ?? 0;

                $paceSeconds = $speedMetersPerSecond > 0 ? (1000 / $speedMetersPerSecond) : 0;

                $watts = $activity['average_watts'] ?? 0;

                return [
                    'id' => $activity['id'],
                    'name' => $activity['name'],
                    'start_date_local' => $activity['start_date_local'],
                    'distance_km' => round($distanceKm, 2),
                    'moving_time_seconds' => $movingTimeSeconds,
                    'time_formatted' => gmdate("H:i:s", $movingTimeSeconds),
                    'pace_formatted' => gmdate("i:s", $paceSeconds),
                    'raw_date_utc' => Carbon::parse($activity['start_date'], 'UTC'),
                    'pace_seconds' => $paceSeconds,
                    'watts' => $watts
                ];
            })
            ->values();
    }


    public function getWeeklyHistory(Collection $runs)
    {
        return $runs
            ->groupBy(function ($run) {
                return $run['raw_date_utc']
                    ->copy()
                    ->startOfWeek(Carbon::MONDAY)
                    ->format('Y-m-d');
            })
            ->map(function ($weekRuns, $weekStartDate) {

                $startUtc = Carbon::parse($weekStartDate, 'UTC');
                $endUtc = $startUtc->copy()->endOfWeek(Carbon::MONDAY);

                return [
                    'week_label' => $startUtc->format('d M') . ' - ' . $endUtc->format('d M'),
                    'total_distance' => round($weekRuns->sum('distance_km'), 1),
                    'total_time' => floor($weekRuns->sum('moving_time_seconds') / 3600)
                        . 'h ' . gmdate("i", $weekRuns->sum('moving_time_seconds')) . 'm',
                    'activity_count' => $weekRuns->count(),
                    'activities' => $weekRuns
                        ->sortByDesc(fn($run) => $run['raw_date_utc'])
                        ->map(function ($run) {
                            return [
                                'id' => $run['id'],
                                'name' => $run['name'],
                                'date_human' => $run['raw_date_utc']
                                    ->copy()
                                    ->locale('pt')
                                    ->isoFormat('dddd, D MMM'),
                                'distance_km' => $run['distance_km'],
                                'pace' => $run['pace_formatted'],
                                'time_formatted' => $run['time_formatted'],
                            ];
                        })
                        ->values(),
                ];
            })
            ->sortKeysDesc()
            ->values();
    }



    public function formatStravaData(RaceGoal $goal, $forceRefresh)
    {
        $rawActivities = $this->getRecentActivities(
            $goal->start_date->timestamp,
            $forceRefresh
        );

        $runs = $this->filterActivitiesByRun($rawActivities);

        $weeklyHistory = $this->getWeeklyHistory($runs);

        $currentWeekStart = Carbon::now('UTC')->startOfWeek(Carbon::MONDAY);

        $currentWeekDistance = $runs
            ->where('raw_date_utc', '>=', $currentWeekStart)
            ->sum('distance_km');

        $userTimezone = Auth::user()->timezone ?? 'UTC';

        $last4Runs = $runs->slice(-4, 4)->reverse();

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

        $prediction = $this->predictRaceTime($runs, $goal->race_distance ?? 42.195);

        return [
            'stravaData' => [
                'currentWeekDistance' => round($currentWeekDistance, 1),
                'totalDistance' => round($runs->sum('distance_km'), 1),
                'recentAvgPace' => gmdate("i:s", $avgPaceSeconds),
                'racePrediction' => $prediction,
                'chartData' => $chartData,
                'activities' => $runs->slice(-5, 5)->reverse()->map(function ($run, $userTimezone) {
                    return [
                        'id' => $run['id'],
                        'name' => $run['name'],
                        'date_utc' => $run['raw_date_utc']->toIso8601String(),
                        'distance' => $run['distance_km'],
                        'pace' => $run['pace_formatted'],
                        'time' => $run['time_formatted'],
                        'watts' => $run['watts']
                    ];
                })->values()
            ],
            'weeklyHistory' => $weeklyHistory
        ];
    }


    public function predictRaceTime($recentRuns, $targetDistanceKm)
    {
        $minDistance = 3;

        if ($targetDistanceKm <= 1) {
            $minDistance = 0.05;
        } elseif ($targetDistanceKm <= 5) {
            $minDistance = 1;
        }

        $relevantRuns = $recentRuns->filter(function ($run) use ($minDistance) {
            return $run['distance_km'] >= $minDistance;
        });

        if ($relevantRuns->isEmpty()) {
            return null;
        }

        $bestRun = $relevantRuns->sortBy(function ($run) {
            return $run['pace_seconds'];
        })->first();

        $d1 = $bestRun['distance_km'];
        $t1_seconds = $bestRun['moving_time_seconds'];

        $predictedSeconds = $t1_seconds * pow(($targetDistanceKm / $d1), 1.06);

        return [
            'time_formatted' => gmdate("H:i:s", $predictedSeconds),
            'base_run_name' => $bestRun['name'],
            'predicted_pace' => gmdate("i:s", $predictedSeconds / $targetDistanceKm)
        ];
    }
}
