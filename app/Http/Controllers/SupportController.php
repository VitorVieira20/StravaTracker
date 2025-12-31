<?php

namespace App\Http\Controllers;

use App\Jobs\SendDiscordSupportMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http; // Importante
use Inertia\Inertia;

class SupportController extends Controller
{
    public function create()
    {
        return Inertia::render('Support/Contact', [
            'user' => Auth::user()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:100',
            'message' => 'required|string|min:10',
        ]);

        $user = Auth::user();
        
        SendDiscordSupportMessage::dispatch($user, $validated);

        return to_route('dashboard.index')
            ->with('success', 'Mensagem enviada com sucesso!');
    }
}