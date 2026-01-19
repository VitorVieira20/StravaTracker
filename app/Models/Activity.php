<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'strava_id',
        'name',
        'type',
        'start_date_local',
        'timezone',
        'distance',
        'moving_time',
        'elapsed_time',
        'total_elevation_gain',
        'average_speed',
        'max_speed',
        'average_grade_adjusted_speed',
        'average_watts',
        'average_heartrate',
        'calories',
        'map_polyline',
        'laps'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'start_date_local' => 'datetime',
        'laps' => 'array',
    ];

    /**
     * Get the distance in kilometers.
     */
    protected function distanceKm(): Attribute
    {
        return Attribute::make(
            get: fn() => round($this->distance / 1000, 2),
        );
    }

    /**
     * Get the formatted pace in minutes per kilometer.
     */
    protected function paceFormatted(): Attribute
    {
        return Attribute::make(
            get: function () {
                $speed = $this->average_grade_adjusted_speed ?? $this->average_speed;

                if ($speed > 0) {
                    $pace = (1 / $speed) * 1000 / 60;
                    $minutes = floor($pace);
                    $seconds = round(($pace - $minutes) * 60);
                    return sprintf('%d:%02d', $minutes, $seconds);
                }

                return '0:00';
            }
        );
    }

    /**
     * Get the formatted moving time.
     */
    protected function timeFormatted(): Attribute
    {
        return Attribute::make(
            get: fn() => gmdate('H:i:s', $this->moving_time),
        );
    }
}