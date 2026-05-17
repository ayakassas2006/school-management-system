<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\ClassController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\SchoolParentController;
use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\GradeController;
use App\Http\Controllers\Api\AssignmentController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\ScheduleController;

// Public routes (no auth required)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return response()->json(['status' => 'success', 'data' => $request->user()]);
    });

    // Admin: User directory management
    Route::middleware('role:admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        Route::apiResource('teachers', TeacherController::class);
        Route::apiResource('parents', SchoolParentController::class);
        Route::apiResource('payments', PaymentController::class)->except(['show', 'destroy']);
        Route::get('/dashboard/admin-stats', [DashboardController::class, 'adminStats']);
        Route::get('/settings', [SettingController::class, 'index']);
        Route::post('/settings', [SettingController::class, 'update']);
    });

    // Admins and Teachers: Academic management
    Route::middleware('role:admin,teacher')->group(function () {
        Route::apiResource('students', StudentController::class);
        Route::post('students/assign-class', [StudentController::class, 'assignClass']);
        Route::apiResource('classes', ClassController::class);
        Route::apiResource('courses', CourseController::class);
        Route::get('courses/{id}/roster', [CourseController::class, 'roster']);
        Route::apiResource('enrollments', EnrollmentController::class)->except(['show', 'update']);
        Route::post('/attendance/batch', [AttendanceController::class, 'batchStore']);
        Route::apiResource('attendance', AttendanceController::class)->except(['show', 'destroy']);
        Route::get('/grades/student/{studentId}', [GradeController::class, 'studentGrades']);
        Route::apiResource('grades', GradeController::class)->except(['show', 'destroy']);
        Route::apiResource('assignments', AssignmentController::class);
        Route::apiResource('events', EventController::class);
        Route::apiResource('schedules', ScheduleController::class);
    });

    // Parent features
    Route::middleware('role:parent,admin')->group(function () {
        Route::get('/parents/{id}/fees', [SchoolParentController::class, 'fees']);
        Route::post('/payments/{id}/process', [PaymentController::class, 'process']);
    });

    // Messaging (all authenticated users)
    Route::get('/messages/conversation/{userId}', [MessageController::class, 'conversation']);
    Route::apiResource('messages', MessageController::class)->only(['index', 'store']);
    Route::put('/messages/{id}/read', [MessageController::class, 'markAsRead']);

    // Notifications (all authenticated users)
    Route::put('/notifications/read', [NotificationController::class, 'markAsRead']);
    Route::apiResource('notifications', NotificationController::class)->only(['index', 'store']);
});