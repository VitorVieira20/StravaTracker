<?php

use App\Http\Controllers\API\WidgetController;
use Illuminate\Support\Facades\Route;

Route::get('/widget/stats/full/{token}', [WidgetController::class, 'fullStats']);
Route::get('/widget/stats/{token}', [WidgetController::class, 'stats']);