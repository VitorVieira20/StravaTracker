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
    ];


    public function users()
    {
        return $this->belongsToMany(User::class)->withPivot('role');
    }

    
    public function challenges()
    {
        return $this->hasMany(Challenge::class);
    }
}
