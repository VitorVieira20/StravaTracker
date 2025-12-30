<?php

namespace App\Http\Controllers;

use App\Models\StravaAccount;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Socialite\Socialite;

class StravaAuthController extends Controller
{
    public function index()
    {
        return Inertia::render(('ConnectStrava'));
    }


    public function redirect()
    {
        return Socialite::driver('strava')
            ->scopes(['read_all', 'activity:read_all'])
            ->redirect();
    }


    public function callback()
    {
        try {
            $stravaUser = Socialite::driver('strava')->user();
        } catch (Exception $e) {
            return redirect('/')->with('error', 'Erro ao conectar com o Strava.');
        }

        $existingAccount = StravaAccount::where('strava_id', $stravaUser->id)->first();

        if ($existingAccount) {
            $existingAccount->update([
                'access_token' => $stravaUser->token,
                'refresh_token' => $stravaUser->refreshToken,
                'expires_at' => Carbon::now()->addSeconds($stravaUser->expiresIn),
                'avatar' => $stravaUser->avatar,
            ]);

            Auth::login($existingAccount->user);

        } else {
            $newUser = User::create([
                'name' => $stravaUser->nickname ?? $stravaUser->name,
                'email' => $stravaUser->email ?? "athlete_{$stravaUser->id}@strava.placeholder",
                'password' => Hash::make(Str::random(24)),
            ]);

            StravaAccount::create([
                'user_id' => $newUser->id,
                'strava_id' => $stravaUser->id,
                'access_token' => $stravaUser->token,
                'refresh_token' => $stravaUser->refreshToken,
                'expires_at' => Carbon::now()->addSeconds($stravaUser->expiresIn),
                'username' => $stravaUser->nickname,
                'avatar' => $stravaUser->avatar,
            ]);

            Auth::login($newUser);
        }

        return redirect()->route('dashboard.index');
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
