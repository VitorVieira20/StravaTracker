<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    protected $fillable = [
        'name',
        'description',
        'owner_id',
        'image_path',
        'privacy',
    ];


    public function users()
    {
        return $this->belongsToMany(User::class)->withPivot('role', 'status');
    }

    
    public function challenges()
    {
        return $this->hasMany(Challenge::class);
    }
}
