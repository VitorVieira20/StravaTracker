<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Services\RaceGoalService;
use App\Services\PersonalBestsService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $raceGoalService = new RaceGoalService();

        return Inertia::render('Settings/Index', [
            'user' => $user,
            'raceGoal' => $raceGoalService->formatRaceGoalData($user->currentGoal)
        ]);
    }

    public function export()
    {
        $user = Auth::user();

        $activities = Activity::where('user_id', $user->id)
            ->where('type', 'Run')
            ->orderBy('start_date_local', 'desc')
            ->get();

        $goal = $user->currentGoal;

        $totalDistance = $activities->sum('distance_km');
        $totalSeconds = $activities->sum('moving_time');

        $hours = floor($totalSeconds / 3600);
        $minutes = floor(($totalSeconds / 60) % 60);
        $timeFormatted = "{$hours}h {$minutes}m";

        $bestRun = $activities->filter(fn($a) => $a->distance_km > 1)->sortBy('pace_formatted')->first();
        $bestPace = $bestRun ? $bestRun->pace_formatted : '-';

        $stats = [
            'total_runs' => $activities->count(),
            'total_distance' => number_format($totalDistance, 1, ',', '.'),
            'total_time' => $timeFormatted,
            'best_pace' => $bestPace,
        ];

        $personalBestsService = new PersonalBestsService();
        $personalBests = $personalBestsService->personalBests($user);

        $badges = $user->badges()
            ->withPivot('awarded_at')
            ->orderByPivot('awarded_at', 'desc')
            ->get();

        $data = [
            'user' => $user,
            'activities' => $activities,
            'goal' => $goal,
            'stats' => $stats,
            'personalBests' => $personalBests,
            'badges' => $badges,
            'generated_at' => now()->format('d/m/Y H:i'),
        ];

        $pdf = Pdf::loadView('pdf.run_report', $data);
        $pdf->setPaper('A4', 'portrait');

        return $pdf->download('run_tracker_data_' . now()->format('Ymd') . '.pdf');
    }
}