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
        Schema::table('race_goals', function (Blueprint $table) {
            $table->decimal('race_distance', 8, 3)->nullable()->after('location');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('race_goals', function (Blueprint $table) {
            $table->dropColumn('race_distance');
        });
    }
};
