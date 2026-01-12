<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function update(Request $request)
    {
        if ($request->has('tv_mode')) {
            $validated = $request->validate([
                'tv_mode' => 'required|boolean',
            ]);

            $request->user()->update([
                'tv_mode' => $validated['tv_mode'],
            ]);

            return back();
        }
    
        return back();
    }
}
