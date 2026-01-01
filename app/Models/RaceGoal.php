<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RaceGoal extends Model
{
    protected $fillable = [
        'user_id', 'name', 'race_date', 'location', 'race_distance', 'start_date', 'weekly_goal_km'
    ];

    protected $casts = [
        'race_date' => 'date',
        'start_date' => 'date',
    ];
    
    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }
}