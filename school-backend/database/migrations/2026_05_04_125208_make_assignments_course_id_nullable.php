<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE assignments MODIFY course_id bigint unsigned NULL');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE assignments MODIFY course_id bigint unsigned NOT NULL');
    }
};
