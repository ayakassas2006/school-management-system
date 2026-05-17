<?php

$dirMiddleware = __DIR__ . '/backend/app/Http/Middleware/';
if (!is_dir($dirMiddleware)) mkdir($dirMiddleware, 0777, true);

$roleMiddleware = <<<'EOD'
<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware {
    public function handle(Request $request, Closure $next, ...$roles): Response {
        if (!$request->user() || !in_array($request->user()->role, $roles)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access. Role requirement not met.',
                'data' => []
            ], 403);
        }
        return $next($request);
    }
}
EOD;
file_put_contents($dirMiddleware . 'RoleMiddleware.php', $roleMiddleware);

$bootstrapApp = <<<'EOD'
<?php
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class,
        ]);
        $middleware->statefulApi();
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
EOD;
file_put_contents(__DIR__ . '/backend/bootstrap/app.php', $bootstrapApp);


$routesApi = <<<'EOD'
<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
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

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) { return response()->json(['status' => 'success', 'data' => $request->user(), 'message' => 'User profile retrieved']); });

    // Admins and Teachers access these basic modules
    Route::middleware('role:admin,teacher')->group(function () {
        Route::apiResource('students', StudentController::class);
        Route::apiResource('classes', ClassController::class);
        Route::apiResource('courses', CourseController::class);
        Route::apiResource('enrollments', EnrollmentController::class)->except(['show', 'update']);
        Route::apiResource('attendance', AttendanceController::class)->except(['show', 'destroy']);
        Route::apiResource('grades', GradeController::class)->except(['show', 'destroy']);
        Route::apiResource('assignments', AssignmentController::class);
    });

    // Admins only
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('teachers', TeacherController::class);
        Route::apiResource('parents', SchoolParentController::class);
        Route::apiResource('payments', PaymentController::class)->except(['show', 'destroy']);
    });

    // Universal Access Modules for authenticated users (logic limited by Controller typically, but here open for CRUD)
    Route::apiResource('messages', MessageController::class)->except(['show', 'destroy']);
    Route::apiResource('notifications', NotificationController::class)->except(['show', 'destroy']);
});
EOD;
file_put_contents(__DIR__ . '/backend/routes/api.php', $routesApi);

echo "Routes and middlewares created.\n";