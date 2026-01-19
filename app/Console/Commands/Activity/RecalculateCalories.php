<?php

namespace App\Console\Commands\Activity;

use App\Models\Activity;
use Illuminate\Console\Command;

class RecalculateCalories extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'activities:recalculate-calories {--force : Force update to all activities}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Recalculates calories from activities using an estimate of weight 70kg (Dist * 70 * 1.036)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $query = Activity::where('type', 'Run');

        if (!$this->option('force')) {
            $query->where(function ($q) {
                $q->whereNull('calories')->orWhere('calories', 0);
            });
            $this->info("Safe Mode: Updating activities with null calories.");
        } else {
            $this->warn("Force Mode: Updating ALL activities (current values will be updated).");
        }

        $count = $query->count();

        if ($count === 0) {
            $this->info("None activity found to be updated.");
            return;
        }

        $this->info("Processing {$count} activities...");
        
        $bar = $this->output->createProgressBar($count);
        $bar->start();

        $query->chunkById(100, function ($activities) use ($bar) {
            foreach ($activities as $activity) {
                
                $distanceKm = $activity->distance / 1000;
                $estimatedCalories = round($distanceKm * 70 * 1.036);

                $activity->timestamps = false; 
                $activity->update(['calories' => $estimatedCalories]);
                $activity->timestamps = true;

                $bar->advance();
            }
        });

        $bar->finish();
        $this->newLine();
        $this->info("✅ Process finished with success!");
    }
}
