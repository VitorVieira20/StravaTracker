<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;

class LanguageController extends Controller
{
    public function update(Request $request)
    {
        $request->validate([
            'locale' => 'required|in:pt,en,es,fr,it',
        ]);

        $user = Auth::user();
        $user->update(['locale' => $request->locale]);

        App::setLocale($request->locale);

        return back();
    }
}