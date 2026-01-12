<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('strava_id')->unique();
            $table->string('name');
            $table->string('type');
            $table->dateTime('start_date_local');
            $table->string('timezone');
            $table->decimal('distance', 10, 2);
            $table->integer('moving_time');
            $table->integer('elapsed_time');
            $table->float('total_elevation_gain');
            $table->float('average_speed');
            $table->float('max_speed');
            $table->float('average_grade_adjusted_speed')->nullable();
            $table->float('average_watts')->nullable();
            $table->float('average_heartrate')->nullable();
            $table->text('map_polyline')->nullable();
            $table->timestamps();

            $table->index('start_date_local');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};