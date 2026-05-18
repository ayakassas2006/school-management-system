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
        Schema::create('program_applications', function (Blueprint $table) {
            $table->id();
            $table->string('program_id');
            $table->string('parent_name');
            $table->string('email');
            $table->string('phone');
            $table->string('child_name');
            $table->integer('child_age');
            $table->text('message')->nullable();
            $table->string('status')->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('program_applications');
    }
};
