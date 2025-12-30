<?php

namespace App\Http\Controllers;

use App\Services\RaceGoalService;
use App\Services\StravaService;
use Carbon\Carbon;
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

        $stravaService = new StravaService($user->stravaAccount);
        $raceGoalService = new RaceGoalService();

        $forceRefresh = $request->has('refresh');

        $stravaData = $stravaService->formatStravaData($goal, $forceRefresh);
        $raceGoalData = $raceGoalService->formatRaceGoalData($goal);

        return Inertia::render('Dashboard', [
            'raceGoal' => $raceGoalData,
            'weeklyHistory' => $stravaData['weeklyHistory'],
            'stravaData' => $stravaData['stravaData']
        ]);
    }
}
