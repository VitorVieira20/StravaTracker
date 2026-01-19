<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Services\StravaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class ActivityController extends Controller
{
    public function __construct(private readonly StravaService $stravaService)
    {
    }

    public function index(Request $request)
    {
        $query = Activity::query()
            ->where('user_id', Auth::id())
            ->where('type', 'Run');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', '%' . $search . '%');
        }

        $sort = $request->input('sort', 'date_desc');

        switch ($sort) {
            case 'date_asc':
                $query->orderBy('start_date_local', 'asc');
                break;
            case 'distance_desc':
                $query->orderBy('distance', 'desc');
                break;
            case 'distance_asc':
                $query->orderBy('distance', 'asc');
                break;
            case 'time_desc':
                $query->orderBy('moving_time', 'desc');
                break;
            case 'time_asc':
                $query->orderBy('moving_time', 'asc');
                break;
            case 'pace_fastest':
                $query->orderBy('average_speed', 'desc');
                break;
            case 'pace_slowest':
                $query->orderBy('average_speed', 'asc');
                break;
            case 'calories_desc':
                $query->orderBy('calories', 'desc');
                break;
            case 'calories_asc':
                $query->orderBy('calories', 'asc');
                break;
            default:
                $query->orderBy('start_date_local', 'desc');
                break;
        }

        $activities = $query
            ->paginate(12)
            ->withQueryString();

        $activities->through(fn($activity) => [
            'id' => $activity->id,
            'name' => $activity->name,
            'type' => $activity->type,
            'start_date_local' => $activity->start_date_local,
            'distance' => $activity->distance,
            'moving_time' => $activity->moving_time,
            'average_speed' => $activity->average_speed,
            'average_watts' => $activity->average_watts,
            'average_heartrate' => $activity->average_heartrate,
            'calories' => $activity->calories,
            'total_elevation_gain' => $activity->total_elevation_gain,
            'map_polyline' => $activity->map_polyline,
            'laps' => $activity->laps,
        ]);

        $activitiesArray = $activities->toArray();

        if (app()->environment('production')) {
            foreach ($activitiesArray['links'] as &$link) {
                if (!empty($link['url'])) {
                    $link['url'] = str_replace('http://', 'https://', $link['url']);
                }
            }
            $urlFields = ['first_page_url', 'last_page_url', 'next_page_url', 'prev_page_url', 'path'];
            foreach ($urlFields as $field) {
                if (!empty($activitiesArray[$field])) {
                    $activitiesArray[$field] = str_replace('http://', 'https://', $activitiesArray[$field]);
                }
            }
        }

        return Inertia::render('Activities/Index', [
            'activities' => $activitiesArray,
            'filters' => $request->only(['search', 'sort']),
        ]);
    }


    public function fetchLaps(Activity $activity)
    {
        $user = Auth::user();
        $account = $user->stravaAccount;

        if (!$account) {
            return response()->json(['error' => 'Conta não conectada'], 400);
        }

        try {
            $response = Http::withToken($this->stravaService->ensureValidToken($account))
                ->get("https://www.strava.com/api/v3/activities/{$activity->strava_id}");

            if ($response->failed()) {
                return response()->json(['error' => 'Erro no Strava'], 500);
            }

            $data = $response->json();

            $laps = $data['laps'] ?? [];

            $updateData = ['laps' => $laps];

            if (isset($data['calories'])) {
                $updateData['calories'] = $data['calories'];
            }

            $activity->update($updateData);

            return response()->json(['laps' => $laps, 'calories' => $updateData['calories'] ?? null, 'message' => 'Splits synchronized!']);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    public function updateLaps(Request $request, Activity $activity)
    {
        $validated = $request->validate([
            'laps' => 'nullable|array',
            'laps.*.distance' => 'required|numeric',
            'laps.*.moving_time' => 'required|numeric',
        ]);

        $activity->update(['laps' => $validated['laps']]);

        return back()->with('success', 'Splits atualizados com sucesso.');
    }
}