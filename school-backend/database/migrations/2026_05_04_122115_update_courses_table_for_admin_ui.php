<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->string('instructor')->nullable();
            $table->integer('capacity')->nullable();
            $table->string('schedule')->nullable();
        });

        // Use DB statement to make class_id nullable to bypass Doctrine requirement for changes
        DB::statement('ALTER TABLE courses MODIFY class_id bigint unsigned NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn(['instructor', 'capacity', 'schedule']);
        });
        
        // Note: Reversing class_id back to NOT NULL requires manual handling if there are nulls.
        // For development purposes, we can leave it or write a DB statement.
        DB::statement('ALTER TABLE courses MODIFY class_id bigint unsigned NOT NULL');
    }
};
