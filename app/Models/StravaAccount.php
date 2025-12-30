<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StravaAccount extends Model
{
    protected $fillable = [
        'user_id',
        'strava_id',
        'access_token',
        'refresh_token',
        'expires_at',
        'avatar',
        'username'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
