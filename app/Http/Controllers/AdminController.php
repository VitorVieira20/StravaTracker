<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function showLogin()
    {
        if (session('admin_authenticated')) {
            return redirect()->route('admin.dashboard');
        }
        return Inertia::render('Admin/Login');
    }


    public function authenticate(Request $request)
    {
        $request->validate(['code' => 'required']);

        if ($request->code === config('auth.admin.access_key')) {
            session(['admin_authenticated' => true]);
            return redirect()->route('admin.dashboard');
        }

        return back()->withErrors(['code' => 'Código incorreto.']);
    }


    public function logout()
    {
        session()->forget('admin_authenticated');
        return redirect()->route('admin.login');
    }


    public function index(Request $request)
    {
        $search = $request->input('search');
        $sort = $request->input('sort', 'created_at');
        $direction = $request->input('direction', 'desc');

        $query = User::query()
            ->withCount(['activities', 'badges'])
            ->withSum('activities as total_distance', 'distance');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('id', $search);
            });
        }

        switch ($sort) {
            case 'activities':
                $query->orderBy('activities_count', $direction);
                break;
            case 'badges':
                $query->orderBy('badges_count', $direction);
                break;
            case 'distance':
                $query->orderBy('total_distance', $direction);
                break;
            case 'name':
                $query->orderBy('name', $direction);
                break;
            default: // created_at
                $query->orderBy('created_at', $direction);
                break;
        }

        $users = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Dashboard', [
            'users' => $users,
            'filters' => $request->only(['search', 'sort', 'direction'])
        ]);
    }
}