<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\RaceGoal;
use Carbon\Carbon;

class RaceGoalSeeder extends Seeder
{

    public function run(): void
    {
        $this->command->info('🎯 A verificar utilizadores sem objetivos...');

        $usersWithoutGoals = User::doesntHave('currentGoal')->get();

        $users = User::all();
        $count = 0;

        foreach ($users as $user) {
            if (RaceGoal::where('user_id', $user->id)->exists()) {
                continue;
            }

            $this->createFakeGoal($user);
            $count++;
        }

        if ($count > 0) {
            $this->command->info("✅ Criados {$count} objetivos de corrida para utilizadores que não tinham.");
        } else {
            $this->command->info("ℹ️ Todos os utilizadores já têm objetivos definidos.");
        }
    }

    private function createFakeGoal(User $user)
    {
        $scenarios = [
            [
                'name' => 'Maratona de Lisboa',
                'distance' => 42195, // Metros
                'weekly_goal' => rand(50, 90),
                'location' => 'Lisboa, Portugal'
            ],
            [
                'name' => 'Meia Maratona do Porto',
                'distance' => 21097,
                'weekly_goal' => rand(30, 60),
                'location' => 'Porto, Portugal'
            ],
            [
                'name' => 'São Silvestre da Amadora',
                'distance' => 10000,
                'weekly_goal' => rand(20, 40),
                'location' => 'Amadora, Portugal'
            ],
            [
                'name' => 'Maratona de Valência',
                'distance' => 42195,
                'weekly_goal' => rand(60, 100),
                'location' => 'Valência, Espanha'
            ],
            [
                'name' => 'Corrida do Benfica',
                'distance' => 10000,
                'weekly_goal' => rand(25, 45),
                'location' => 'Lisboa, Portugal'
            ],
        ];

        $scenario = $scenarios[array_rand($scenarios)];

        $raceDate = Carbon::now()->addDays(rand(30, 180));
        
        $startDate = Carbon::now()->subDays(rand(0, 30));

        RaceGoal::create([
            'user_id' => $user->id,
            'name' => $scenario['name'],
            'race_date' => $raceDate,
            'location' => $scenario['location'],
            'race_distance' => $scenario['distance'],
            'start_date' => $startDate,
            'weekly_goal_km' => $scenario['weekly_goal'],
        ]);
    }
}