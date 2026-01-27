<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Challenge extends Model
{
    protected $fillable = [
        'group_id',
        'name',
        'type',
        'start_date',
        'end_date',
    ];


    protected function casts(): array
    {
        return [
            'start_date' => 'datetime',
            'end_date' => 'datetime',
        ];
    }

    public function group()
    {
        return $this->belongsTo(Group::class);
    }
}
