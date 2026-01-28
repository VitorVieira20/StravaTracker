<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class StaticPageController extends Controller
{
    public function welcome()
    {
        return Inertia::render('Welcome');
    }


    public function features()
    {
        return Inertia::render('Features');
    }

    
    public function privacy()
    {
        return Inertia::render('Privacy');
    }


    public function terms()
    {
        return Inertia::render('Terms');
    }
}
