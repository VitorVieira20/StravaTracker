<?php

require __DIR__ . '/admin.php';

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\ChallengeController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\MilestonesController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RaceGoalController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\StaticPageController;
use App\Http\Controllers\StravaAuthController;
use App\Http\Controllers\SupportController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth.redirect')->group(function () {

    // DASHBOARD
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');


    // RACE GOAL
    Route::controller(RaceGoalController::class)->group(function () {
        Route::middleware('goal.redirect')->group(function () {
            Route::get('/setup-goal', 'create')->name('goals.create');
            Route::post('/setup-goal', 'store')->name('goals.store');
        });
        Route::get('/goal/edit', 'edit')->name('goals.edit');
        Route::put('/goal/update', 'update')->name('goals.update');
    });


    // LOGOUT
    Route::post('/logout', [StravaAuthController::class, 'logout'])->name('strava.logout');


    // ACTIVITIES
    Route::controller(ActivityController::class)->prefix('/activities')->name('activities.')->group(function () {
        Route::get('/export', 'export')->name('export');
        Route::get('/', 'index')->name('index');
        Route::post('/{activity}/fetch-laps', 'fetchLaps')->name('fetch-laps');
        Route::put('/{activity}/laps', 'updateLaps')->name('update-laps');
    });


    // SETTINGS
    Route::controller(SettingsController::class)->prefix('/settings')->name('settings.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/export', 'export')->name('export');
    });

    // PROFILE
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');


    // MILESTONES (BADGES AND PERSONAL RECORDS)
    Route::get('/milestones', [MilestonesController::class, 'index'])->name('milestones.index');


    // GROUPS AND CHALLENGES
    Route::prefix('/groups')->name('groups.')->group(function () {
        Route::controller(GroupController::class)->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');

            // Invites & Responses (Antes do wildcard {group})
            Route::post('/invitations/{id}/respond', 'respondInvite')->name('invite.respond');

            // Single Group Routes
            Route::get('/{group}', 'show')->name('show');
            Route::post('/{group}/join', 'join')->name('join');
            Route::delete('/{group}/leave', 'leave')->name('leave');
            Route::post('/{group}/invite', 'invite')->name('invite');

            // Members Management
            Route::post('/{group}/members/{user}/approve', 'approve')->name('members.approve');
            Route::delete('/{group}/members/{user}/remove', 'remove')->name('members.remove');
        });

        // Challenges (Nested but distinct controller)
        Route::post('/{group}/challenges', [ChallengeController::class, 'store'])->name('challenges.store'); // Nome corrigido para groups.challenges.store? Ou manténs challenges.store global?
    });
});

Route::middleware('guest.redirect')->group(function () {
    Route::controller(StaticPageController::class)->group(function () {
        Route::get('/', 'welcome')->name('welcome');
        Route::get('/features', 'features')->name('features');
        Route::get('/privacy', 'privacy')->name('privacy');
        Route::get('/terms', 'terms')->name('terms');
    });

    // STRAVA AUTH
    Route::controller(StravaAuthController::class)->group(function () {
        Route::get('/connect', 'index')->name('strava.index');
        Route::get('/auth/strava/redirect', 'redirect')->name('strava.redirect');
        Route::get('/auth/strava/callback', 'callback')->name('strava.callback');
    });
});


// SUPPORT CONTACTS
Route::get('/support', [SupportController::class, 'create'])->name('support.create');
Route::post('/support', [SupportController::class, 'store'])->name('support.store');


// LANGUAGE
Route::post('/language', [LanguageController::class, 'update'])->name('language.update');