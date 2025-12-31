<?php

namespace App\Services;

use App\Models\RaceGoal;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Collection;
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
            ->values();
    }


    public function getWeeklyHistory(Collection $runs)
    {
        return $runs->groupBy(function ($run) {
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
                        'date_human' => $run['raw_date']->locale('pt')->isoFormat('dddd, D MMM'),
                        'distance_km' => $run['distance_km'],
                        'pace' => $run['pace_formatted'],
                        'time_formatted' => $run['time_formatted']
                    ];
                })->sortByDesc('raw_date')->values()
            ];
        })->sortKeysDesc()->values();
    }


    public function formatStravaData(RaceGoal $goal, $forceRefresh)
    {
        $rawActivities = $this->getRecentActivities(
            $goal->start_date->timestamp,
            $forceRefresh
        );

        $runs = $this->filterActivitiesByRun($rawActivities);
        $weeklyHistory = $this->getWeeklyHistory($runs);

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


        return [
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
            ],
            'weeklyHistory' => $weeklyHistory
        ];
    }
}
