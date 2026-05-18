<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('grades', function (Blueprint $table) {
            $table->decimal('cc1', 5, 2)->default(0)->after('course_id');
            $table->decimal('cc2', 5, 2)->default(0)->after('cc1');
            $table->decimal('cc3', 5, 2)->default(0)->after('cc2');
            $table->decimal('efm', 5, 2)->default(0)->after('cc3');
        });
    }

    public function down(): void
    {
        Schema::table('grades', function (Blueprint $table) {
            $table->dropColumn(['cc1', 'cc2', 'cc3', 'efm']);
        });
    }
};
