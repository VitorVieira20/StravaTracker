<?php

namespace App\Http\Controllers;

use App\Services\RaceGoalService;
use App\Services\StravaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        if (!$user->stravaAccount) {
            return to_route('strava.index');
        }

        $goal = $user->currentGoal;

        if (!$goal) {
            return to_route('goals.create');
        }

        $stravaService = new StravaService();
        $raceGoalService = new RaceGoalService();

        $shouldSync = $request->has('refresh') || !$request->session()->get('strava_synced', false);

        $stravaData = $stravaService->formatStravaData($goal, $shouldSync);
        $raceGoalData = $raceGoalService->formatRaceGoalData($goal);
        
        if ($shouldSync) {
            $request->session()->put('strava_synced', true);
        }

        return Inertia::render('Dashboard', [
            'raceGoal' => $raceGoalData,
            'weeklyHistory' => $stravaData['weeklyHistory'],
            'stravaData' => $stravaData['stravaData'],
            'isTvMode' => (bool) $user->tv_mode
        ]);
    }
}
