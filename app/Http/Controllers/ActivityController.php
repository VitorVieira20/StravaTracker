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

        $activities = $query
            ->orderBy('start_date_local', 'desc')
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
            'total_elevation_gain' => $activity->total_elevation_gain,
            'map_polyline' => $activity->map_polyline,
            'laps' => $activity->laps,
        ]);

        return Inertia::render('Activities/Index', [
            'activities' => $activities,
            'filters' => $request->only(['search']),
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

            $activity->update(['laps' => $laps]);

            return response()->json(['laps' => $laps, 'message' => 'Splits sincronizados!']);

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