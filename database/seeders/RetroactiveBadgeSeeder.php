<?php

namespace Database\Seeders;

use App\Models\User;
use App\Services\BadgeService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RetroactiveBadgeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $badgeService = new BadgeService();

        $users = User::has('activities')->with('activities')->get();

        $this->command->info("🔄 Starting retroactive badge assignment for {$users->count()} users...");

        foreach ($users as $user) {
            $this->command->warn("   👤 Processing: {$user->name}");

            DB::table('badge_user')->where('user_id', $user->id)->delete();

            $activities = $user->activities()
                ->orderBy('start_date_local', 'asc')
                ->get();

            $bar = $this->command->getOutput()->createProgressBar($activities->count());
            $bar->start();

            foreach ($activities as $activity) {
                $badgeService->checkBadges($user, $activity, true);

                $bar->advance();
            }

            $bar->finish();
            $this->command->newLine();
            
            $count = $user->badges()->count();
            $this->command->info("      ✅ Done! Total Badges: {$count}");
            $this->command->newLine();
        }

        $this->command->info("🎉 Retroactive process finished successfully!");
    }
}