<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BadgeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $badges = [
            ['identifier' => 'dist_1k', 'category' => 'distance', 'tier' => 'bronze'],
            ['identifier' => 'dist_5k', 'category' => 'distance', 'tier' => 'bronze'],
            ['identifier' => 'dist_10k', 'category' => 'distance', 'tier' => 'silver'],
            ['identifier' => 'dist_15k', 'category' => 'distance', 'tier' => 'silver'],
            ['identifier' => 'dist_21k', 'category' => 'distance', 'tier' => 'gold'],
            ['identifier' => 'dist_30k', 'category' => 'distance', 'tier' => 'gold'],
            ['identifier' => 'dist_42k', 'category' => 'distance', 'tier' => 'platinum'],
            ['identifier' => 'dist_50k', 'category' => 'distance', 'tier' => 'platinum'],

            ['identifier' => 'total_100k', 'category' => 'total', 'tier' => 'bronze'],
            ['identifier' => 'total_500k', 'category' => 'total', 'tier' => 'silver'],
            ['identifier' => 'total_1000k', 'category' => 'total', 'tier' => 'gold'],
            ['identifier' => 'total_2000k', 'category' => 'total', 'tier' => 'gold'],
            ['identifier' => 'total_5000k', 'category' => 'total', 'tier' => 'platinum'],
            ['identifier' => 'total_10000k', 'category' => 'total', 'tier' => 'platinum'],

            ['identifier' => 'elev_100m', 'category' => 'elevation', 'tier' => 'bronze'],
            ['identifier' => 'elev_500m', 'category' => 'elevation', 'tier' => 'silver'],
            ['identifier' => 'elev_1000m', 'category' => 'elevation', 'tier' => 'gold'],
            ['identifier' => 'elev_2000m', 'category' => 'elevation', 'tier' => 'gold'],
            ['identifier' => 'elev_8848m', 'category' => 'elevation', 'tier' => 'platinum'],

            ['identifier' => 'time_30m', 'category' => 'time', 'tier' => 'bronze'],
            ['identifier' => 'time_1h', 'category' => 'time', 'tier' => 'silver'],
            ['identifier' => 'time_2h', 'category' => 'time', 'tier' => 'gold'],
            ['identifier' => 'time_3h', 'category' => 'time', 'tier' => 'gold'],
            ['identifier' => 'time_5h', 'category' => 'time', 'tier' => 'platinum'],

            ['identifier' => 'early_bird', 'category' => 'special', 'tier' => 'silver'],
            ['identifier' => 'night_owl', 'category' => 'special', 'tier' => 'silver'],
            ['identifier' => 'lunch_runner', 'category' => 'special', 'tier' => 'bronze'],
            ['identifier' => 'weekend_warrior', 'category' => 'special', 'tier' => 'bronze'],

            ['identifier' => 'streak_3runs', 'category' => 'streak', 'tier' => 'bronze'],
            ['identifier' => 'streak_5runs', 'category' => 'streak', 'tier' => 'silver'],
            ['identifier' => 'streak_7runs', 'category' => 'streak', 'tier' => 'gold'],

            ['identifier' => 'first_activity', 'category' => 'milestone', 'tier' => 'bronze'],
            ['identifier' => 'cal_500', 'category' => 'calories', 'tier' => 'bronze'],
            ['identifier' => 'cal_1000', 'category' => 'calories', 'tier' => 'silver'],
            ['identifier' => 'cal_2000', 'category' => 'calories', 'tier' => 'gold'],
        ];

        $this->command->info("   Begin Badges Creation");

        foreach ($badges as $badge) {
            DB::table('badges')->updateOrInsert(
                ['identifier' => $badge['identifier']],
                $badge
            );

            $this->command->info("   ✅ Badge Created: {$badge['identifier']}");
        }

        $this->command->info("   All Badges Created");
    }
}
