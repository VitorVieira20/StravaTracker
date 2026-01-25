<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Services\StravaService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

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


    public function export(Request $request)
    {
        $query = Activity::query()
            ->where('user_id', Auth::id())
            ->where('type', 'Run');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', '%' . $search . '%');
        }

        if ($request->filled('from_date')) {
            $query->whereDate('start_date_local', '>=', $request->input('from_date'));
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

        $activities = $query->get();
        $format = $request->input('format', 'csv');
        $columns = $request->input('columns', ['start_date_local', 'name', 'distance', 'moving_time']);

        $formatValue = function ($key, $value) {
            if (!$value) return '';
            switch ($key) {
                case 'distance':
                    return round($value / 1000, 2);
                case 'moving_time':
                case 'elapsed_time':
                    return gmdate('H:i:s', $value);
                case 'average_speed':
                    if ($value > 0) {
                        $pace = (1 / $value) * 1000 / 60;
                        $minutes = floor($pace);
                        $seconds = round(($pace - $minutes) * 60);
                        return sprintf('%d:%02d', $minutes, $seconds);
                    }
                    return '0:00';
                case 'start_date_local':
                    return \Carbon\Carbon::parse($value)->format('d/m/Y H:i');
                default:
                    return $value;
            }
        };

        $filename = 'activities-export-' . date('Y-m-d') . '.' . ($format === 'excel' ? 'xls' : $format);

        if ($format === 'pdf') {
            $data = $activities->map(function ($activity) use ($columns, $formatValue) {
                $row = [];
                foreach ($columns as $col) {
                    $row[$col] = $formatValue($col, $activity->$col);
                }
                return $row;
            });

            $pdf = Pdf::loadView('pdf.activities_export', [
                'data' => $data,
                'columns' => $columns
            ]);
            return $pdf->download($filename);
        }

        if ($format === 'json') {
            return response()->streamDownload(function () use ($activities, $columns, $formatValue) {
                $data = $activities->map(function ($activity) use ($columns, $formatValue) {
                    $row = [];
                    foreach ($columns as $col) {
                        $row[$col] = $formatValue($col, $activity->$col);
                    }
                    return $row;
                });
                echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            }, $filename);
        }

        return response()->streamDownload(function () use ($activities, $columns, $formatValue) {
            $handle = fopen('php://output', 'w');
            
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));

            fputcsv($handle, $columns);

            foreach ($activities as $activity) {
                $row = [];
                foreach ($columns as $col) {
                    $row[] = $formatValue($col, $activity->$col);
                }
                fputcsv($handle, $row);
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => $format === 'excel' ? 'application/vnd.ms-excel' : 'text/csv',
        ]);
    }
}