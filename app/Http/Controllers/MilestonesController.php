<?php

namespace App\Http\Controllers;

use App\Models\Badge;
use App\Services\BadgeService;
use App\Services\PersonalBestsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Inertia\Inertia;

class MilestonesController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $account = $user->stravaAccount;

        if (!$account) {
            return redirect()->route('dashboard.index');
        }

        $personalBestsService = new PersonalBestsService();
        $personalRecords = $personalBestsService->personalBests($user);

        $badgeService = new BadgeService();

        $userStats = $user->activities()
            ->where('type', 'Run')
            ->selectRaw('
                COALESCE(MAX(distance), 0) as max_distance,
                COALESCE(SUM(distance), 0) as total_distance,
                COALESCE(MAX(total_elevation_gain), 0) as max_elevation,
                COALESCE(MAX(moving_time), 0) as max_time,
                COALESCE(MAX(calories), 0) as max_calories
            ')
            ->first();

        $currentStreak = $badgeService->calcCurrentStreak($user);
        $allBadges = $badgeService->userBadgesWithProgress($userStats, $currentStreak);
        $userBadges = $user->badges;

        return Inertia::render('Milestones/Index', [
            'allBadges' => $allBadges,
            'userBadges' => $userBadges,
            'personalBests' => $personalRecords,
        ]);
    }
}