<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RaceGoalController;
use App\Http\Controllers\StravaAuthController;
use App\Http\Controllers\SupportController;
use Illuminate\Support\Facades\Route;


Route::middleware('auth.redirect')->group(function () {

    // DASHBOARD
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');


    // RACE GOAL
    Route::get('/setup-goal', [RaceGoalController::class, 'create'])->name('goals.create');
    Route::post('/setup-goal', [RaceGoalController::class, 'store'])->name('goals.store');
    Route::get('/goal/edit', [RaceGoalController::class, 'edit'])->name('goals.edit');
    Route::put('/goal/update', [RaceGoalController::class, 'update'])->name('goals.update');


    // LOGOUT
    Route::post('/logout', [StravaAuthController::class, 'logout'])->name('strava.logout');
});

Route::middleware('guest.redirect')->group(function () {
    Route::get('/', [StravaAuthController::class, 'index'])->name('strava.index');

    // STRAVA OAUTH AUTHENTICATION
    Route::get('/auth/strava/redirect', [StravaAuthController::class, 'redirect'])->name('strava.redirect');
    Route::get('/auth/strava/callback', [StravaAuthController::class, 'callback'])->name('strava.callback');
});

// SUPPORT CONTACTS
Route::get('/support', [SupportController::class, 'create'])->name('support.create');
Route::post('/support', [SupportController::class, 'store'])->name('support.store');