<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\MilestonesController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RaceGoalController;
use App\Http\Controllers\SettingsController;
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


    // ACTIVITIES
    Route::get('/activities', [ActivityController::class, 'index'])->name('activities.index');
    Route::post('/activities/{activity}/fetch-laps', [ActivityController::class, 'fetchLaps'])->name('activities.fetch-laps');
    Route::put('/activities/{activity}/laps', [ActivityController::class, 'updateLaps'])->name('activities.update-laps');


    // SETTINGS
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::get('/settings/export', [SettingsController::class, 'export'])->name('settings.export');
    Route::get('/debug-strava', [SettingsController::class, 'debugStrava'])->name('debug.strava');


    // PROFILE
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');


    // MILESTONES (BADGES AND PERSONAL RECORDS)
    Route::get('/milestones', [MilestonesController::class, 'index'])->name('milestones.index');
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


// LANGUAGE
Route::post('/language', [LanguageController::class, 'update'])->name('language.update');