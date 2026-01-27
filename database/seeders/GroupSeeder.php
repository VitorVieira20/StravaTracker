<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Group;
use App\Models\User;
use App\Models\Challenge;
use Carbon\Carbon;

class GroupSeeder extends Seeder
{
    public function run()
    {
        $owner1 = User::find(5);
        
        if (!$owner1) {
            $this->command->warn("⚠️  No user found. Please create a user first.");
            return;
        }

        $this->command->info("🚀 Creating groups and challenges for user: {$owner1->name}");

        $g1 = Group::create([
            'name' => 'Marathon Club PT',
            'description' => 'Focused on preparing for the next Lisbon marathon. Long runs on weekends.',
            'owner_id' => $owner1->id,
            'image_path' => null, 
        ]);
        
        $g1->users()->attach($owner1->id, ['role' => 'admin']);

        Challenge::create([
            'group_id' => $g1->id,
            'name' => 'Distance King - This Month',
            'type' => 'total_distance',
            'start_date' => Carbon::now()->startOfMonth(),
            'end_date' => Carbon::now()->endOfMonth(),
        ]);

        Challenge::create([
            'group_id' => $g1->id,
            'name' => 'The January Long Run',
            'type' => 'max_distance',
            'start_date' => Carbon::now()->subMonth()->startOfMonth(),
            'end_date' => Carbon::now()->subMonth()->endOfMonth(),
        ]);


        $owner2 = User::find(6);
        
        if (!$owner2) {
            $this->command->warn("⚠️  No user found. Please create a user first.");
            return;
        }


        $g2 = Group::create([
            'name' => 'Madeira Trail Runners',
            'description' => 'Climbing mountains is our thing. Where there is elevation, we are there.',
            'owner_id' => $owner2->id,
        ]);
        
        $g2->users()->attach($owner2->id, ['role' => 'admin']);

        Challenge::create([
            'group_id' => $g2->id,
            'name' => 'Everest Challenge (Accumulated)',
            'type' => 'max_elevation',
            'start_date' => Carbon::now()->startOfWeek(),
            'end_date' => Carbon::now()->addWeeks(2),
        ]);


        $owner3 = User::find(7);
        
        if (!$owner3) {
            $this->command->warn("⚠️  No user found. Please create a user first.");
            return;
        }

        $g3 = Group::create([
            'name' => 'Morning Coffee Run',
            'description' => 'Light runs before work. Consistency is key, not speed.',
            'owner_id' => $owner3->id,
        ]);
        
        $g3->users()->attach($owner3->id, ['role' => 'admin']);
        $g3->users()->attach($owner2->id, ['role' => 'member']);

        Challenge::create([
            'group_id' => $g3->id,
            'name' => 'Hours of Dedication',
            'type' => 'total_time',
            'start_date' => Carbon::now()->subDays(5),
            'end_date' => Carbon::now()->addDays(25),
        ]);

        $this->command->info("✅ 3 Groups and 4 Challenges created successfully!");
    }
}