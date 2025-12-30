<?php

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Support\Facades\Http;

class StravaService
{
    protected $account;

    public function __construct($account)
    {
        $this->account = $account;
    }

    /**
     * Garante que o access token está válido.
     */
    protected function ensureValidToken()
    {
        // Se o token expirou, renova
        if (Carbon::now()->timestamp >= $this->account->strava_expires_in) {
            $response = Http::asForm()->post('https://www.strava.com/oauth/token', [
                'client_id' => config('services.strava.client_id'),
                'client_secret' => config('services.strava.client_secret'),
                'grant_type' => 'refresh_token',
                'refresh_token' => $this->account->refresh_token,
            ]);

            $data = $response->json();

            // Atualiza os tokens na BD
            $this->account->update([
                'access_token' => $data['access_token'],
                'refresh_token' => $data['refresh_token'],
                'expires_at' => $data['expires_at'],
            ]);
        }

        return $this->account->access_token;
    }

    /**
     * Obtém as últimas atividades (corridas, pedaladas, etc.)
     */
    public function getRecentActivities($perPage = 500, $startDate)
    {
        $token = $this->ensureValidToken();

        $response = Http::withToken($token)
            ->get('https://www.strava.com/api/v3/athlete/activities', [
                'per_page' => $perPage,
                'after' => $startDate
            ]);

        if ($response->failed()) {
            throw new \Exception('Erro ao obter atividades do Strava: ' . $response->body());
        }

        return $response->json();
    }
}
