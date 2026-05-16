<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\ClassRoom;
use App\Models\Course;
use App\Models\Payment;
use App\Models\Attendance;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function adminStats()
    {
        $totalStudents = Student::count();
        $totalTeachers = Teacher::count();
        $totalClasses = ClassRoom::count();
        $totalCourses = Course::count();
        $totalRevenue = Payment::where('status', 'completed')->sum('amount');
        
        $totalAttendanceRecords = Attendance::count();
        $presentRecords = Attendance::where('status', 'present')->count();
        $attendanceRate = $totalAttendanceRecords > 0 ? round(($presentRecords / $totalAttendanceRecords) * 100, 1) : 0;

        $recentActivities = ActivityLog::with('user')->orderBy('created_at', 'desc')->take(5)->get();

        $financialData = [];
        $currentYear = date('Y');
        for ($i = 1; $i <= 12; $i++) {
            $monthAmount = Payment::where('status', 'completed')
                ->whereYear('created_at', $currentYear)
                ->whereMonth('created_at', $i)
                ->sum('amount');
            
            $monthName = date('M', mktime(0, 0, 0, $i, 1));
            
            $financialData[] = [
                'month' => $monthName,
                'amount' => $monthAmount / 1000, 
                'trend' => '+0%' 
            ];
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_students' => $totalStudents,
                'total_teachers' => $totalTeachers,
                'total_classes' => $totalClasses,
                'total_courses' => $totalCourses,
                'total_revenue' => $totalRevenue,
                'attendance_rate' => $attendanceRate,
                'recent_activities' => $recentActivities,
                'financial_data' => array_slice($financialData, 0, 6), // Return first 6 months for UI simplicity as in fake data
            ]
        ]);
    }
}
