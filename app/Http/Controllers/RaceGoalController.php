<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RaceGoalController extends Controller
{
    public function create()
    {
        return Inertia::render('Onboarding/SetGoal');
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'race_date' => 'required|date|after:today',
            'location' => 'required|string|max:255',
            'race_distance' => 'required|numeric|min:1|max:500',
            'start_date' => 'required|date|before:race_date',
            'weekly_goal_km' => 'required|integer|min:1|max:200',
        ]);

        $request->user()->currentGoal()->create($validated);

        return to_route('dashboard.index');
    }


    public function edit()
    {
        $goal = Auth::user()->currentGoal;

        if (!$goal) {
            return to_route('goals.create');
        }

        return Inertia::render('Onboarding/SetGoal', [
            'goal' => $goal
        ]);
    }


    public function update(Request $request)
    {
        $goal = Auth::user()->currentGoal;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'race_date' => 'required|date|after:today',
            'location' => 'required|string|max:255',
            'race_distance' => 'required|numeric|min:1|max:500',
            'start_date' => 'required|date|before:race_date',
            'weekly_goal_km' => 'required|integer|min:1|max:200',
        ]);

        $goal->update($validated);

        return to_route('dashboard.index')->with('success', 'Objetivo atualizado!');
    }
}
