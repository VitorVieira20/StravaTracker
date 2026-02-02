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
    Route::get('/setup-goal', [RaceGoalController::class, 'create'])->name('goals.create');
    Route::post('/setup-goal', [RaceGoalController::class, 'store'])->name('goals.store');
    Route::get('/goal/edit', [RaceGoalController::class, 'edit'])->name('goals.edit');
    Route::put('/goal/update', [RaceGoalController::class, 'update'])->name('goals.update');


    // LOGOUT
    Route::post('/logout', [StravaAuthController::class, 'logout'])->name('strava.logout');


    // ACTIVITIES
    Route::get('/activities/export', [ActivityController::class, 'export'])->name('activities.export');
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


    // GROUPS AND CHALLENGES
    Route::get('/groups', [GroupController::class, 'index'])->name('groups.index');
    Route::post('/groups', [GroupController::class, 'store'])->name('groups.store');
    Route::post('/groups/invitations/{id}/respond', [GroupController::class, 'respondInvite'])->name('groups.invite.respond');
    Route::get('/groups/{group}', [GroupController::class, 'show'])->name('groups.show');
    Route::post('/groups/{group}/join', [GroupController::class, 'join'])->name('groups.join');
    Route::delete('/groups/{group}/leave', [GroupController::class, 'leave'])->name('groups.leave');
    Route::post('/groups/{group}/invite', [GroupController::class, 'invite'])->name('groups.invite'); // Enviar convite
    Route::post('/groups/{group}/challenges', [ChallengeController::class, 'store'])->name('challenges.store');
    Route::post('/groups/{group}/members/{user}/approve', [GroupController::class, 'approve'])->name('groups.members.approve');
    Route::delete('/groups/{group}/members/{user}/remove', [GroupController::class, 'remove'])->name('groups.members.remove');
});

Route::middleware('guest.redirect')->group(function () {
    Route::get('/', [StaticPageController::class, 'welcome'])->name('welcome');
    Route::get('/features', [StaticPageController::class, 'features'])->name('features');
    Route::get('/privacy', [StaticPageController::class, 'privacy'])->name('privacy');
    Route::get('/terms', [StaticPageController::class, 'terms'])->name('terms');

    Route::get('/connect', [StravaAuthController::class, 'index'])->name('strava.index');

    // STRAVA OAUTH AUTHENTICATION
    Route::get('/auth/strava/redirect', [StravaAuthController::class, 'redirect'])->name('strava.redirect');
    Route::get('/auth/strava/callback', [StravaAuthController::class, 'callback'])->name('strava.callback');
});


// SUPPORT CONTACTS
Route::get('/support', [SupportController::class, 'create'])->name('support.create');
Route::post('/support', [SupportController::class, 'store'])->name('support.store');


// LANGUAGE
Route::post('/language', [LanguageController::class, 'update'])->name('language.update');