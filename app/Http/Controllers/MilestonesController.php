<?php

namespace App\Http\Controllers;

use App\Models\Badge;
use App\Services\PersonalBestsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MilestonesController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $personalBestsService = new PersonalBestsService();
        
        $allBadges = Badge::all();
        $userBadges = $user->badges;

        $account = $user->stravaAccount;

        if (!$account) {
            return redirect()->route('dashboard.index');
        }

        $personalRecords = $personalBestsService->personalBests($user);

        return Inertia::render('Milestones/Index', [
            'allBadges' => $allBadges,
            'userBadges' => $userBadges,
            'personalBests' => $personalRecords,
        ]);
    }
}
