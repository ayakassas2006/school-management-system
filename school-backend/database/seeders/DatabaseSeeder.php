<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\SchoolParent;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@edusaas.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Teachers
        $teacher1 = User::create([
            'name' => 'Dr. Sarah Jenkins',
            'email' => 's.jenkins@edusaas.com',
            'password' => Hash::make('password'),
            'role' => 'teacher',
        ]);
        Teacher::create(['user_id' => $teacher1->id, 'specialization' => 'Science']);

        $teacher2 = User::create([
            'name' => 'Prof. Mark Davis',
            'email' => 'm.davis@edusaas.com',
            'password' => Hash::make('password'),
            'role' => 'teacher',
        ]);
        Teacher::create(['user_id' => $teacher2->id, 'specialization' => 'Mathematics']);

        // Students
        $student1 = User::create([
            'name' => 'Alex Johnson',
            'email' => 'a.johnson@student.com',
            'password' => Hash::make('password'),
            'role' => 'student',
        ]);
        Student::create(['user_id' => $student1->id]);

        $student2 = User::create([
            'name' => 'Emily Davis',
            'email' => 'e.davis@student.com',
            'password' => Hash::make('password'),
            'role' => 'student',
        ]);
        Student::create(['user_id' => $student2->id]);

        // Parent
        $parent1 = User::create([
            'name' => 'Amanda Clarke',
            'email' => 'amanda.c@parents.com',
            'password' => Hash::make('password'),
            'role' => 'parent',
        ]);
        SchoolParent::create(['user_id' => $parent1->id, 'phone' => '+1 234-567-8903']);
    }
}
