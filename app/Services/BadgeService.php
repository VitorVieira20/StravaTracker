<?php

namespace App\Services;

use App\Models\User;
use App\Models\Activity;
use App\Models\Badge;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class BadgeService
{
    public function checkBadges(User $user, Activity $activity, $fromSeeder = false)
    {
        $date = $fromSeeder ? $activity->start_date_local : null;

        $this->checkDistanceBadges($user, $activity, $date);
        $this->checkTotalDistanceBadges($user, $activity, $date);
        $this->checkElevationBadges($user, $activity, $date);
        $this->checkMovingTimeBadges($user, $activity, $date);
        $this->checkCaloriesBadges($user, $activity, $date);
        $this->checkOtherBadges($user, $activity, $date);
    }


    private function checkDistanceBadges(User $user, Activity $activity, $date)
    {
        $distKm = $activity->distance / 1000;
        if ($distKm >= 1)
            $this->award($user, 'dist_1k', $date);
        if ($distKm >= 5)
            $this->award($user, 'dist_5k', $date);
        if ($distKm >= 10)
            $this->award($user, 'dist_10k', $date);
        if ($distKm >= 15)
            $this->award($user, 'dist_15k', $date);
        if ($distKm >= 21)
            $this->award($user, 'dist_21k', $date);
        if ($distKm >= 30)
            $this->award($user, 'dist_30k', $date);
        if ($distKm >= 42)
            $this->award($user, 'dist_42k', $date);
        if ($distKm >= 50)
            $this->award($user, 'dist_50k', $date);
    }


    private function checkTotalDistanceBadges(User $user, Activity $activity, $date)
    {
        $totalDist = $user->activities()->where('type', 'Run')->sum('distance') / 1000;
        if ($totalDist >= 100)
            $this->award($user, 'total_100k', $date);
        if ($totalDist >= 500)
            $this->award($user, 'total_500k', $date);
        if ($totalDist >= 1000)
            $this->award($user, 'total_1000k', $date);
        if ($totalDist >= 2000)
            $this->award($user, 'total_2000k', $date);
        if ($totalDist >= 5000)
            $this->award($user, 'total_5000k', $date);
        if ($totalDist >= 10000)
            $this->award($user, 'total_10000k', $date);
    }


    private function checkElevationBadges(User $user, Activity $activity, $date)
    {
        $elev = $activity->total_elevation_gain;
        if ($elev >= 100)
            $this->award($user, 'elev_100m', $date);
        if ($elev >= 500)
            $this->award($user, 'elev_500m', $date);
        if ($elev >= 1000)
            $this->award($user, 'elev_1000m', $date);
        if ($elev >= 2000)
            $this->award($user, 'elev_2000m', $date);
        if ($elev >= 8848)
            $this->award($user, 'elev_8848m', $date);
    }


    private function checkMovingTimeBadges(User $user, Activity $activity, $date)
    {
        $minutes = $activity->moving_time / 60;
        if ($minutes >= 30)
            $this->award($user, 'time_30m', $date);
        if ($minutes >= 60)
            $this->award($user, 'time_1h', $date);
        if ($minutes >= 120)
            $this->award($user, 'time_2h', $date);
        if ($minutes >= 180)
            $this->award($user, 'time_3h', $date);
        if ($minutes >= 300)
            $this->award($user, 'time_5h', $date);
    }


    private function checkCaloriesBadges(User $user, Activity $activity, $date)
    {
        $calories = $activity->calories ?? 0;
        if ($calories >= 500)
            $this->award($user, 'cal_500', $date);
        if ($calories >= 1000)
            $this->award($user, 'cal_1000', $date);
        if ($calories >= 2000)
            $this->award($user, 'cal_2000', $date);
    }


    private function checkOtherBadges(User $user, Activity $activity, $date)
    {
        $start = $activity->start_date_local;
        $hour = $start->hour;

        if ($hour >= 4 && $hour < 7) {
            $this->award($user, 'early_bird', $date);
        }

        if ($hour >= 12 && $hour < 14) {
            $this->award($user, 'lunch_runner', $date);
        }

        if ($hour >= 20) {
            $this->award($user, 'night_owl', $date);
        }

        if ($start->isWeekend()) {
            $this->award($user, 'weekend_warrior', $date);
        }

        if ($user->activities()->count() >= 1 && !$user->badges()->where('identifier', 'first_activity')->exists()) {
            $this->award($user, 'first_activity', $date);
        }

        $this->checkStreaks($user, $activity, $date);
    }


    private function award(User $user, string $identifier, $date)
    {
        static $badgesCache = null;
        if (!$badgesCache) {
            $badgesCache = Badge::all()->keyBy('identifier');
        }

        $badge = $badgesCache->get($identifier);

        if ($badge && !$user->badges()->where('badge_id', $badge->id)->exists()) {
            $user->badges()->attach($badge->id, [
                'awarded_at' => $date ?? now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }


    private function checkStreaks(User $user, Activity $currentActivity, $date)
    {
        $activityDates = $user->activities()
            ->where('start_date_local', '<=', $currentActivity->start_date_local)
            ->where('type', 'Run')
            ->orderBy('start_date_local', 'desc')
            ->get()
            ->pluck('start_date_local')
            ->map(function ($d) {
                return $d->format('Y-m-d');
            })
            ->unique()
            ->values();

        if ($activityDates->count() < 3)
            return;

        $streakCount = 1;
        $currentCheckDate = Carbon::parse($activityDates[0]);

        for ($i = 1; $i < $activityDates->count(); $i++) {
            $prevDate = Carbon::parse($activityDates[$i]);

            $diff = $currentCheckDate->diffInDays($prevDate);

            if ($diff == 1) {
                $streakCount++;
                $currentCheckDate = $prevDate;
            } else {
                break;
            }
        }

        if ($streakCount >= 3)
            $this->award($user, 'streak_3runs', $date);
        if ($streakCount >= 5)
            $this->award($user, 'streak_5runs', $date);
        if ($streakCount >= 7)
            $this->award($user, 'streak_7runs', $date);
    }


    public function calcCurrentStreak(User $user): int
    {
        $activityDates = $user->activities()
            ->where('type', 'Run')
            ->orderBy('start_date_local', 'desc')
            ->pluck('start_date_local')
            ->map(fn($d) => $d->format('Y-m-d'))
            ->unique()
            ->values();

        $currentStreak = 0;
        if ($activityDates->count() > 0) {
            $currentStreak = 1;
            $checkDate = Carbon::parse($activityDates[0]);
            
            if ($checkDate->diffInDays(now()) <= 1) {
                for ($i = 1; $i < $activityDates->count(); $i++) {
                    $prevDate = Carbon::parse($activityDates[$i]);
                    if ($checkDate->diffInDays($prevDate) == 1) {
                        $currentStreak++;
                        $checkDate = $prevDate;
                    } else {
                        break;
                    }
                }
            } else {
                $currentStreak = 0;
            }
        }

        return $currentStreak;
    }


    public function userBadgesWithProgress(Activity $userStats, int $currentStreak): Collection
    {
        $allBadges = Badge::all()->map(function ($badge) use ($userStats, $currentStreak) {
            $progress = null;
            $id = $badge->identifier;

            if (str_starts_with($id, 'dist_') || $id === 'marathon' || $id === 'half_marathon') {
                $targetKm = 0;
                if ($id === 'marathon') $targetKm = 42.195;
                elseif ($id === 'half_marathon') $targetKm = 21.097;
                else $targetKm = (int) filter_var($id, FILTER_SANITIZE_NUMBER_INT);

                $progress = [
                    'current' => $userStats->max_distance,
                    'target' => $targetKm * 1000,
                    'unit' => 'km'
                ];
            }
            elseif (str_starts_with($id, 'total_')) {
                $targetKm = (int) filter_var($id, FILTER_SANITIZE_NUMBER_INT);
                $progress = [
                    'current' => $userStats->total_distance,
                    'target' => $targetKm * 1000,
                    'unit' => 'km'
                ];
            }
            elseif (str_starts_with($id, 'elev_')) {
                $targetMeters = (int) filter_var($id, FILTER_SANITIZE_NUMBER_INT);
                $progress = [
                    'current' => $userStats->max_elevation,
                    'target' => $targetMeters,
                    'unit' => 'm'
                ];
            }
            elseif (str_starts_with($id, 'cal_')) {
                $targetCal = (int) filter_var($id, FILTER_SANITIZE_NUMBER_INT);
                $progress = [
                    'current' => $userStats->max_calories,
                    'target' => $targetCal,
                    'unit' => 'kcal'
                ];
            }
            elseif (str_starts_with($id, 'time_')) {
                $targetMinutes = 0;
                $val = (int) filter_var($id, FILTER_SANITIZE_NUMBER_INT);
                if (str_ends_with($id, 'h')) $targetMinutes = $val * 60;
                else $targetMinutes = $val;

                $progress = [
                    'current' => $userStats->max_time / 60,
                    'target' => $targetMinutes,
                    'unit' => 'min'
                ];
            }
            elseif (str_starts_with($id, 'streak_')) {
                $targetRuns = (int) filter_var($id, FILTER_SANITIZE_NUMBER_INT);
                $progress = [
                    'current' => $currentStreak,
                    'target' => $targetRuns,
                    'unit' => 'runs'
                ];
            }

            if ($progress) {
                if ($progress['target'] > 0) {
                    $progress['percentage'] = min(100, round(($progress['current'] / $progress['target']) * 100));
                } else {
                    $progress['percentage'] = 0;
                }
                $badge->progress = $progress;
            }

            return $badge;
        });

        return $allBadges;
    }
}