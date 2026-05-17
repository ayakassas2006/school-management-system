<?php

$dir = __DIR__ . '/backend/app/Http/Controllers/Api/';
if (!is_dir($dir)) mkdir($dir, 0777, true);

$controllers = [
    'SchoolParentController.php' => <<<'EOD'
<?php
namespace App\Http\Controllers\Api;
use App\Models\SchoolParent;
use Illuminate\Http\Request;

class SchoolParentController extends BaseController {
    public function index(Request $request) {
        try {
            $query = SchoolParent::with(['user', 'students']);
            if ($request->has('search')) $query->whereHas('user', fn($q) => $q->where('name', 'like', '%'.$request->search.'%'));
            return $this->sendResponse($query->paginate($request->get('limit', 15)), 'Parents retrieved successfully');
        } catch (\Exception $e) { return $this->sendError($e->getMessage(), [], 500); }
    }
    public function store(Request $request) {
        try {
            $validated = $request->validate(['user_id' => 'required|exists:users,id', 'phone' => 'nullable|string', 'address' => 'nullable|string']);
            return $this->sendResponse(SchoolParent::create($validated), 'Parent created successfully');
        } catch (\Exception $e) { return $this->sendError($e->getMessage(), [], 500); }
    }
    public function show($id) {
        try {
            $item = SchoolParent::with(['user', 'students'])->find($id);
            if (!$item) return $this->sendError('Not found');
            return $this->sendResponse($item, 'Retrieved successfully');
        } catch (\Exception $e) { return $this->sendError($e->getMessage(), [], 500); }
    }
    public function update(Request $request, $id) {
        try {
            $item = SchoolParent::find($id);
            if (!$item) return $this->sendError('Not found');
            $item->update($request->all());
            return $this->sendResponse($item, 'Updated successfully');
        } catch (\Exception $e) { return $this->sendError($e->getMessage(), [], 500); }
    }
    public function destroy($id) {
        try {
            $item = SchoolParent::find($id);
            if (!$item) return $this->sendError('Not found');
            $item->delete();
            return $this->sendResponse([], 'Deleted successfully');
        } catch (\Exception $e) { return $this->sendError($e->getMessage(), [], 500); }
    }
}
EOD,
    'EnrollmentController.php' => <<<'EOD'
<?php
namespace App\Http\Controllers\Api;
use App\Models\Enrollment;
use Illuminate\Http\Request;

class EnrollmentController extends BaseController {
    public function index(Request $request) {
        try {
            $query = Enrollment::with(['student', 'course']);
            return $this->sendResponse($query->paginate($request->get('limit', 15)), 'Retrieved successfully');
        } catch (\Exception $e) { return $this->sendError($e->getMessage(), [], 500); }
    }
    public function store(Request $request) {
        try {
            $validated = $request->validate(['student_id' => 'required|exists:students,id', 'course_id' => 'required|exists:courses,id']);
            return $this->sendResponse(Enrollment::create($validated), 'Created successfully');
        } catch (\Exception $e) { return $this->sendError($e->getMessage(), [], 500); }
    }
    public function destroy($id) {
        try {
            $item = Enrollment::find($id);
            if (!$item) return $this->sendError('Not found');
            $item->delete();
            return $this->sendResponse([], 'Deleted successfully');
        } catch (\Exception $e) { return $this->sendError($e->getMessage(), [], 500); }
    }
}
EOD,
    'AttendanceController.php' => <<<'EOD'
<?php
namespace App\Http\Controllers\Api;
use App\Models\Attendance;
use Illuminate\Http\Request;

class AttendanceController extends BaseController {
    public function index(Request $request) {
        try {
            $query = Attendance::with(['student']);
            if ($request->has('student_id')) $query->where('student_id', $request->student_id);
            return $this->sendResponse($query->paginate($request->get('limit', 15)), 'Retrieved successfully');
        } catch (\Exception $e) { return $this->sendError($e->getMessage(), [], 500); }
    }
    public function store(Request $request) {
        try {
            $validated = $request->validate(['student_id' => 'required|exists:students,id', 'date' => 'required|date', 'status' => 'required|in:present,absent,late']);
            return $this->sendResponse(Attendance::create($validated), 'Created successfully');
        } catch (\Exception $e) { return $this->sendError($e->getMessage(), [], 500); }
    }
    public function update(Request $request, $id) {
        try {
            $item = Attendance::find($id);
            if (!$item) return $this->sendError('Not found');
            $item->update($request->all());
            return $this->sendResponse($item, 'Updated successfully');
        } catch (\Exception $e) { return $this->sendError($e->getMessage(), [], 500); }
    }
}
EOD,
    'GradeController.php' => <<<'EOD'
<?php
namespace App\Http\Controllers\Api;
use App\Models\Grade;
use Illuminate\Http\Request;

class GradeController extends BaseController {
    public function index(Request $request) {
        try {
            $query = Grade::with(['student', 'course']);
            if ($request->has('student_id')) $query->where('student_id', $request->student_id);
            if ($request->has('course_id')) $query->where('course_id', $request->course_id);
            return $this->sendResponse($query->paginate($request->get('limit', 15)), 'Retrieved successfully');
        } catch (\Exception $e) { return $this->sendError($e->getMessage(), [], 500); }
    }
    public function store(Request $request) {
        try {
            $validated = $request->validate(['student_id' => 'required|exists:students,id', 'course_id' => 'required|exists:courses,id', 'score' => 'required|numeric']);
            return $this->sendResponse(Grade::create($validated), 'Created successfully');
        } catch (\Exception $e) { return $this->sendError($e->getMessage(), [], 500); }
    }
    public function update(Request $request, $id) {
        try {
            $item = Grade::find($id);
            if (!$item) return $this->sendError('Not found');
            $item->update($request->all());
            return $this->sendResponse($item, 'Updated successfully');
        } catch (\Exception $e) { return $this->sendError($e->getMessage(), [], 500); }
    }
}
EOD,
    'PaymentController.php' => <<<'EOD'
<?php
namespace App\Http\Controllers\Api;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends BaseController {
    public function index(Request $request) {
        try {
            $query = Payment::with(['student']);
            if ($request->has('student_id')) $query->where('student_id', $request->student_id);
            return $this->sendResponse($query->paginate($request->get('limit', 15)), 'Retrieved successfully');
        } catch (\Exception $e) { return $this->sendError($e->getMessage(), [], 500); }
    }
    public function store(Request $request) {
        try {
            $validated = $request->validate(['student_id' => 'required|exists:students,id', 'amount' => 'required|numeric', 'status' => 'required|string']);
            return $this->sendResponse(Payment::create($validated), 'Created successfully');
        } catch (\Exception $e) { return $this->sendError($e->getMessage(), [], 500); }
    }
    public function update(Request $request, $id) {
        try {
            $item = Payment::find($id);
            if (!$item) return $this->sendError('Not found');
            $item->update($request->all());
            return $this->sendResponse($item, 'Updated successfully');
        } catch (\Exception $e) { return $this->sendError($e->getMessage(), [], 500); }
    }
}
EOD,
    'MessageController.php' => <<<'EOD'
<?php
namespace App\Http\Controllers\Api;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends BaseController {
    public function index(Request $request) {
        try {
            $query = Message::with(['sender', 'receiver']);
            if ($request->has('user_id')) {
                $query->where('sender_id', $request->user_id)->orWhere('receiver_id', $request->user_id);
            }
            return $this->sendResponse($query->orderBy('created_at', 'desc')->paginate($request->get('limit', 15)), 'Retrieved successfully');
        } catch (\Exception $e) { return $this->sendError($e->getMessage(), [], 500); }
    }
    public function store(Request $request) {
        try {
            $validated = $request->validate(['sender_id' => 'required|exists:users,id', 'receiver_id' => 'required|exists:users,id', 'content' => 'required|string']);
            return $this->sendResponse(Message::create($validated), 'Created successfully');
        } catch (\Exception $e) { return $this->sendError($e->getMessage(), [], 500); }
    }
    public function update(Request $request, $id) {
        try {
            $item = Message::find($id);
            if (!$item) return $this->sendError('Not found');
            $item->update(['is_read' => true]);
            return $this->sendResponse($item, 'Updated successfully');
        } catch (\Exception $e) { return $this->sendError($e->getMessage(), [], 500); }
    }
}
EOD,
    'NotificationController.php' => <<<'EOD'
<?php
namespace App\Http\Controllers\Api;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends BaseController {
    public function index(Request $request) {
        try {
            $query = Notification::with(['user']);
            if ($request->has('user_id')) $query->where('user_id', $request->user_id);
            return $this->sendResponse($query->orderBy('created_at', 'desc')->paginate($request->get('limit', 15)), 'Retrieved successfully');
        } catch (\Exception $e) { return $this->sendError($e->getMessage(), [], 500); }
    }
    public function store(Request $request) {
        try {
            $validated = $request->validate(['user_id' => 'required|exists:users,id', 'title' => 'required|string', 'message' => 'nullable|string']);
            return $this->sendResponse(Notification::create($validated), 'Created successfully');
        } catch (\Exception $e) { return $this->sendError($e->getMessage(), [], 500); }
    }
    public function update(Request $request, $id) {
        try {
            $item = Notification::find($id);
            if (!$item) return $this->sendError('Not found');
            $item->update(['read' => true]);
            return $this->sendResponse($item, 'Updated successfully');
        } catch (\Exception $e) { return $this->sendError($e->getMessage(), [], 500); }
    }
}
EOD
];

foreach ($controllers as $filename => $content) {
    file_put_contents($dir . $filename, $content);
}

echo "Controllers 2 created.\n";
