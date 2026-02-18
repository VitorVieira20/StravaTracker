<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Activity;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class UserSeeder extends Seeder
{
    public function run()
    {
        $this->command->info('🏃 Creating fake elite athletes...');

        $this->createUser(
            'Admin Runner', 
            'admin@runtracker.com', 
            'password', 
            true
        );
        
        $this->command->info("✅ Admin created: admin@runtracker.com / password");

        User::factory(10)->create()->each(function ($user) {
            $this->setupFakeStrava($user);
            
            $this->generateFakeActivities($user, rand(10, 50));
        });

        $this->command->info("✅ 10 Extra users created with activities!");
    }


    private function createUser($name, $email, $password, $generateActivities = false)
    {
        $user = User::firstOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => Hash::make($password),
                'email_verified_at' => now(),
            ]
        );

        $this->setupFakeStrava($user);

        if ($generateActivities) {
            $this->generateFakeActivities($user, 30);
        }

        return $user;
    }


    private function setupFakeStrava(User $user)
    {
        if ($user->stravaAccount()->exists()) return;
        
        $user->stravaAccount()->create([
            'user_id' => $user->id,
            'strava_id' => rand(1000000, 9999999), // Fake Strava ID
            'access_token' => 'fake_token_' . \Illuminate\Support\Str::random(10),
            'refresh_token' => 'fake_refresh_' . \Illuminate\Support\Str::random(10),
            'expires_at' => now()->addYears(10)->timestamp, // Valid for a long time
            'avatar' => "https://ui-avatars.com/api/?name=" . urlencode($user->name) . "&background=random&color=fff",
        ]);
    }


    private function generateFakeActivities(User $user, $count)
    {
        for ($i = 0; $i < $count; $i++) {
            
            $date = Carbon::now()->subDays(rand(1, 90))->subHours(rand(0, 12));
            $distance = rand(3000, 21000);
            $avgSpeed = rand(238, 416) / 100; 
            $movingTime = round($distance / $avgSpeed);
            $elevation = round(($distance / 1000) * rand(5, 20));
            $calories = round(($distance / 1000) * 75 * 1.036);

            Activity::create([
                'user_id' => $user->id,
                'strava_id' => rand(1000000000, 9999999999),
                'name' => $this->getRandomRunName($date, $distance),
                'type' => 'Run',
                'distance' => $distance,
                'moving_time' => $movingTime,
                'elapsed_time' => $movingTime + rand(0, 300),
                'total_elevation_gain' => $elevation,
                'start_date_local' => $date,
                'timezone' => '(GMT+00:00) Europe/Lisbon',
                'average_speed' => $avgSpeed,
                'max_speed' => $avgSpeed + 1.5,
                'average_heartrate' => rand(130, 170),
                'average_watts' => rand(200, 350),
                'calories' => $calories,
                'map_polyline' => null,
            ]);
        }
    }


    private function getRandomRunName($date, $distance)
    {
        $hour = $date->hour;
        $period = 'Night';
        if ($hour >= 5 && $hour < 12) $period = 'Morning';
        else if ($hour >= 12 && $hour < 18) $period = 'Afternoon';
        else if ($hour >= 18 && $hour < 21) $period = 'Evening';

        $types = ['Run', 'Jog', 'Intervals', 'Long Run', 'Recovery'];
        
        if ($distance > 15000) return "Long {$period} Run";
        if ($distance < 5000) return "Quick {$period} Jog";

        return "{$period} " . $types[array_rand($types)];
    }
}