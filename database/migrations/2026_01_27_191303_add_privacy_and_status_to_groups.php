<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('groups', function (Blueprint $table) {
            $table->enum('privacy', ['public', 'private'])->default('public')->after('description');
        });

        Schema::table('group_user', function (Blueprint $table) {
            $table->enum('status', ['active', 'pending', 'rejected'])->default('active')->after('role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('groups', function (Blueprint $table) {
            $table->dropColumn('privacy');
        });

        Schema::table('group_user', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
