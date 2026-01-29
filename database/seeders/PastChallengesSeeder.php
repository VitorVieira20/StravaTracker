<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Group;
use App\Models\Challenge;
use App\Models\Activity;
use Carbon\Carbon;
use Illuminate\Support\Str;

class PastChallengesSeeder extends Seeder
{
    public function run()
    {
        $group = Group::with('users')->find(1);

        if (!$group) {
            $this->command->error("❌ Group with ID 1 not found.");
            return;
        }

        $members = $group->users;
        
        if ($members->count() < 2) {
            $this->command->warn("⚠️ Group has few members. Add more members to Group 1 before running this seeder.");
            return;
        }

        $this->command->info("🚀 Generating past challenges and activities to Group: {$group->name}");

        $challengeTemplates = [
            ['name' => 'Desafio de Ano Novo', 'type' => 'total_distance'],
            ['name' => 'Rei da Montanha - Janeiro', 'type' => 'max_elevation'],
            ['name' => 'Consistência de Fevereiro', 'type' => 'total_time'],
            ['name' => 'Sprint de Primavera', 'type' => 'total_distance'],
            ['name' => 'Ultramaratona Virtual', 'type' => 'max_distance'],
            ['name' => 'Vertical Limit', 'type' => 'max_elevation'],
            ['name' => 'Calor de Verão', 'type' => 'total_distance'],
            ['name' => 'Regresso aos Treinos', 'type' => 'total_time'],
            ['name' => 'Preparação Meia Maratona', 'type' => 'total_distance'],
            ['name' => 'Desafio de Outono', 'type' => 'max_elevation'],
            ['name' => 'Halloween Run', 'type' => 'total_distance'],
            ['name' => 'Corrida do Perú', 'type' => 'total_time'],
        ];

        foreach ($challengeTemplates as $index => $template) {
            
            $endDate = Carbon::now()->subMonths($index + 1)->endOfMonth();
            $startDate = Carbon::now()->subMonths($index + 1)->startOfMonth();

            $challenge = Challenge::create([
                'group_id' => $group->id,
                'name' => $template['name'],
                'type' => $template['type'],
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]);

            
            $designatedWinnerIndex = $index % $members->count();
            $winner = $members[$designatedWinnerIndex];

            foreach ($members as $member) {
                $isWinner = $member->id === $winner->id;
                
                $this->createActivityForChallenge($member->id, $challenge, $isWinner);
            }
        }

        $this->command->info("✅ Created " . count($challengeTemplates) . " past challenges!");
    }


    private function createActivityForChallenge($userId, $challenge, $isWinner)
    {
        $distance = rand(5000, 15000);
        $elevation = rand(50, 300);
        $time = rand(1800, 5400);

        if ($isWinner) {
            if ($challenge->type === 'total_distance' || $challenge->type === 'max_distance') {
                $distance = rand(25000, 42000);
            } elseif ($challenge->type === 'max_elevation') {
                $elevation = rand(1000, 2000);
            } elseif ($challenge->type === 'total_time') {
                $time = rand(7200, 15000);
            } else {
                $distance += 10000;
            }
        }

        $randomDate = $challenge->start_date->copy()->addDays(rand(1, 20));

        Activity::create([
            'user_id' => $userId,
            'strava_id' => rand(1000000000, 9999999999),
            'name' => 'Treino Histórico - ' . $challenge->name,
            'type' => 'Run',
            
            'start_date_local' => $randomDate,
            'timezone' => '(GMT+00:00) Europe/Lisbon',
            
            'distance' => $distance,
            'moving_time' => $time,
            'elapsed_time' => $time + 300,
            'total_elevation_gain' => $elevation,
            
            'average_speed' => $time > 0 ? $distance / $time : 0,
            'max_speed' => ($time > 0 ? $distance / $time : 0) + 2.0,
            'average_watts' => rand(150, 300),
            'average_heartrate' => rand(130, 170),
            'calories' => rand(300, 1200),
            'map_polyline' => null,
        ]);
    }
}