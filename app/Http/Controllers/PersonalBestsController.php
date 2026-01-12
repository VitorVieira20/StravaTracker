<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PersonalBestsController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $account = $user->stravaAccount;

        if (!$account) {
            return redirect()->route('dashboard.index');
        }

        // Definição Centralizada: Chave Lógica => [Metros, Chave de Tradução, Badge]
        $targets = [
            '400m' => ['meters' => 400, 'label' => 'dist_400m', 'badge' => 'sprint'],
            '1km' => ['meters' => 1000, 'label' => 'dist_1km', 'badge' => 'fast-mile'],
            '1mile' => ['meters' => 1609, 'label' => 'dist_1mile', 'badge' => 'mile-master'],
            '5km' => ['meters' => 5000, 'label' => 'dist_5km', 'badge' => 'five-k'],
            '10km' => ['meters' => 10000, 'label' => 'dist_10km', 'badge' => 'ten-k'],
            'half_marathon' => ['meters' => 21097, 'label' => 'dist_half_marathon', 'badge' => 'half-marathon'],
            'marathon' => ['meters' => 42195, 'label' => 'dist_marathon', 'badge' => 'marathon'],
            '50km' => ['meters' => 50000, 'label' => 'dist_50km', 'badge' => 'ultra-50'],
            '100km' => ['meters' => 100000, 'label' => 'dist_100km', 'badge' => 'ultra-100'],
        ];

        $personalRecords = [];

        foreach ($targets as $key => $data) {
            // Traduz a label (Ex: "Meia Maratona (21k)" ou "Half Marathon (21k)")
            // O frontend usa a chave do array para mostrar o título
            $displayLabel = __($data['label']); 
            
            $bestActivity = $user->activities()
                ->where('type', 'Run')
                ->where('distance', '>=', $data['meters'])
                ->orderBy('average_speed', 'desc')
                ->first();

            if ($bestActivity) {
                $seconds = $data['meters'] / $bestActivity->average_speed;
                $formattedTime = gmdate("H:i:s", $seconds);

                $personalRecords[$displayLabel] = [
                    'calculated_time' => $formattedTime,
                    'pace' => $bestActivity->pace_formatted,
                    'based_on_activity' => $bestActivity->name,
                    'data' => $bestActivity->start_date_local->format('d/m/Y'),
                    'activity' => $bestActivity,
                    'badge' => $data['badge']
                ];
            } else {
                $personalRecords[$displayLabel] = [
                    'message' => __('dist_not_completed'), // Mensagem traduzida também
                    'badge' => $data['badge']
                ];
            }
        }

        return Inertia::render('PersonalBests/Index', [
            'personalBests' => $personalRecords,
        ]);
    }
}