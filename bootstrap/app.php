<?php

use App\Http\Middleware\AdminAccess;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\RedirectIfAuthenticated;
use App\Http\Middleware\RedirectIfNotAuthenticated;
use App\Http\Middleware\SetUserLocale;
use App\Http\Middleware\UserHasRaceGoalRedirect;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Inertia\Inertia;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            SetUserLocale::class,
            HandleInertiaRequests::class,
        ]);

        $middleware->alias([
            'auth.redirect' => RedirectIfNotAuthenticated::class,
            'guest.redirect' => RedirectIfAuthenticated::class,
            'admin.auth' => AdminAccess::class,
            'goal.redirect' => UserHasRaceGoalRedirect::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->respond(function ($response, Throwable $exception, Request $request) {
            if (in_array($response->getStatusCode(), [401, 402, 403, 404, 405, 500, 503])) {

                $locale = app()->getLocale();
    
                $paths = [
                    lang_path("{$locale}.json"),
                    resource_path("lang/{$locale}.json"),
                    lang_path("en.json"),
                    resource_path("lang/en.json")
                ];

                $translations = [];

                foreach ($paths as $path) {
                    if (file_exists($path)) {
                        $translations = json_decode(file_get_contents($path), true);
                        break;
                    }
                }

                return Inertia::render('Error', [
                    'status' => $response->getStatusCode(),
                    'translations' => $translations,
                    'locale' => empty($translations) ? $locale : 'en'
                ])
                    ->toResponse($request)
                    ->setStatusCode($response->getStatusCode());
            } elseif ($response->getStatusCode() === 419) {
                return back()->with([
                    'message' => 'The page expired, please try again.',
                ]);
            }

            return $response;
        });
    })->create();
