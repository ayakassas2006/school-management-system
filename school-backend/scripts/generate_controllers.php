<?php

$dir = __DIR__ . '/backend/app/Http/Controllers/Api/';
if (!is_dir($dir)) mkdir($dir, 0777, true);

$controllers = [
    'BaseController.php' => <<<'EOD'
<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;

class BaseController extends Controller {
    public function sendResponse($data, $message = 'Success') {
        return response()->json([
            'status' => 'success',
            'data' => $data,
            'message' => $message
        ]);
    }

    public function sendError($message, $data = [], $code = 404) {
        return response()->json([
            'status' => 'error',
            'data' => $data,
            'message' => $message
        ], $code);
    }
}
EOD,
    'AuthController.php' => <<<'EOD'
<?php
namespace App\Http\Controllers\Api;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends BaseController {
    public function register(Request $request) {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
                'role' => 'in:admin,teacher,student,parent'
            ]);
            $validated['password'] = Hash::make($validated['password']);
            $user = User::create($validated);
            $token = $user->createToken('auth_token')->plainTextToken;
            return $this->sendResponse(['user' => $user, 'token' => $token, 'role' => $user->role], 'User registered successfully');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 500);
        }
    }

    public function login(Request $request) {
        try {
            $request->validate(['email' => 'required|email', 'password' => 'required']);
            $user = User::where('email', $request->email)->first();
            if (!$user || !Hash::check($request->password, $user->password)) {
                return $this->sendError('Invalid credentials', [], 401);
            }
            $token = $user->createToken('auth_token')->plainTextToken;
            return $this->sendResponse(['user' => $user, 'token' => $token, 'role' => $user->role], 'User logged in successfully');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 500);
        }
    }

    public function logout(Request $request) {
        try {
            $request->user()->currentAccessToken()->delete();
            return $this->sendResponse([], 'Logged out successfully');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 500);
        }
    }
}
EOD,
    'StudentController.php' => <<<'EOD'
<?php
namespace App\Http\Controllers\Api;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends BaseController {
    public function index(Request $request) {
        try {
            $query = Student::with(['user', 'classRoom', 'schoolParent', 'enrollments']);
            if ($request->has('search')) {
                $query->whereHas('user', function($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->search . '%');
                });
            }
            if ($request->has('class_id')) {
                $query->where('class_id', $request->class_id);
            }
            if ($request->has('sort')) {
                $query->orderBy($request->sort, $request->get('order', 'asc'));
            }
            $students = $query->paginate($request->get('limit', 15));
            return $this->sendResponse($students, 'Students retrieved successfully');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 500);
        }
    }

    public function store(Request $request) {
        try {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'class_id' => 'nullable|exists:classes,id',
                'parent_id' => 'nullable|exists:parents,id',
                'dob' => 'nullable|date'
            ]);
            $student = Student::create($validated);
            return $this->sendResponse($student, 'Student created successfully');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 500);
        }
    }

    public function show($id) {
        try {
            $student = Student::with(['user', 'classRoom', 'schoolParent', 'grades', 'attendance'])->find($id);
            if (!$student) return $this->sendError('Student not found');
            return $this->sendResponse($student, 'Student retrieved successfully');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 500);
        }
    }

    public function update(Request $request, $id) {
        try {
            $student = Student::find($id);
            if (!$student) return $this->sendError('Student not found');
            $student->update($request->all());
            return $this->sendResponse($student, 'Student updated successfully');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 500);
        }
    }

    public function destroy($id) {
        try {
            $student = Student::find($id);
            if (!$student) return $this->sendError('Student not found');
            $student->delete();
            return $this->sendResponse([], 'Student deleted successfully');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 500);
        }
    }
}
EOD,
    'TeacherController.php' => <<<'EOD'
<?php
namespace App\Http\Controllers\Api;
use App\Models\Teacher;
use Illuminate\Http\Request;

class TeacherController extends BaseController {
    public function index(Request $request) {
        try {
            $query = Teacher::with(['user', 'classes']);
            if ($request->has('search')) {
                $query->whereHas('user', function($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->search . '%');
                });
            }
            if ($request->has('sort')) {
                $query->orderBy($request->sort, $request->get('order', 'asc'));
            }
            $teachers = $query->paginate($request->get('limit', 15));
            return $this->sendResponse($teachers, 'Teachers retrieved successfully');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 500);
        }
    }

    public function store(Request $request) {
        try {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'specialization' => 'nullable|string'
            ]);
            $teacher = Teacher::create($validated);
            return $this->sendResponse($teacher, 'Teacher created successfully');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 500);
        }
    }

    public function show($id) {
        try {
            $teacher = Teacher::with(['user', 'classes', 'classes.students'])->find($id);
            if (!$teacher) return $this->sendError('Teacher not found');
            return $this->sendResponse($teacher, 'Teacher retrieved successfully');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 500);
        }
    }

    public function update(Request $request, $id) {
        try {
            $teacher = Teacher::find($id);
            if (!$teacher) return $this->sendError('Teacher not found');
            $teacher->update($request->all());
            return $this->sendResponse($teacher, 'Teacher updated successfully');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 500);
        }
    }

    public function destroy($id) {
        try {
            $teacher = Teacher::find($id);
            if (!$teacher) return $this->sendError('Teacher not found');
            $teacher->delete();
            return $this->sendResponse([], 'Teacher deleted successfully');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 500);
        }
    }
}
EOD,
    'ClassController.php' => <<<'EOD'
<?php
namespace App\Http\Controllers\Api;
use App\Models\ClassRoom;
use Illuminate\Http\Request;

class ClassController extends BaseController {
    public function index(Request $request) {
        try {
            $query = ClassRoom::with(['teacher.user', 'students', 'courses']);
            if ($request->has('search')) {
                $query->where('name', 'like', '%' . $request->search . '%');
            }
            if ($request->has('teacher_id')) {
                $query->where('teacher_id', $request->teacher_id);
            }
            if ($request->has('sort')) {
                $query->orderBy($request->sort, $request->get('order', 'asc'));
            }
            $classes = $query->paginate($request->get('limit', 15));
            return $this->sendResponse($classes, 'Classes retrieved successfully');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 500);
        }
    }

    public function store(Request $request) {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'teacher_id' => 'nullable|exists:teachers,id'
            ]);
            $classRoom = ClassRoom::create($validated);
            return $this->sendResponse($classRoom, 'Class created successfully');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 500);
        }
    }

    public function show($id) {
        try {
            $classRoom = ClassRoom::with(['teacher', 'students', 'courses'])->find($id);
            if (!$classRoom) return $this->sendError('Class not found');
            return $this->sendResponse($classRoom, 'Class retrieved successfully');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 500);
        }
    }

    public function update(Request $request, $id) {
        try {
            $classRoom = ClassRoom::find($id);
            if (!$classRoom) return $this->sendError('Class not found');
            $classRoom->update($request->all());
            return $this->sendResponse($classRoom, 'Class updated successfully');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 500);
        }
    }

    public function destroy($id) {
        try {
            $classRoom = ClassRoom::find($id);
            if (!$classRoom) return $this->sendError('Class not found');
            $classRoom->delete();
            return $this->sendResponse([], 'Class deleted successfully');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 500);
        }
    }
}
EOD,
    'CourseController.php' => <<<'EOD'
<?php
namespace App\Http\Controllers\Api;
use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends BaseController {
    public function index(Request $request) {
        try {
            $query = Course::with(['classRoom']);
            if ($request->has('search')) {
                $query->where('name', 'like', '%' . $request->search . '%');
            }
            if ($request->has('class_id')) {
                $query->where('class_id', $request->class_id);
            }
            if ($request->has('sort')) {
                $query->orderBy($request->sort, $request->get('order', 'asc'));
            }
            $res = $query->paginate($request->get('limit', 15));
            return $this->sendResponse($res, 'Courses retrieved successfully');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 500);
        }
    }

    public function store(Request $request) {
        try {
            $validated = $request->validate([
                'name' => 'required|string',
                'class_id' => 'required|exists:classes,id',
                'description' => 'nullable|string'
            ]);
            $item = Course::create($validated);
            return $this->sendResponse($item, 'Course created successfully');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 500);
        }
    }

    public function show($id) {
        try {
            $item = Course::with(['classRoom', 'assignments'])->find($id);
            if (!$item) return $this->sendError('Not found');
            return $this->sendResponse($item, 'Retrieved successfully');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 500);
        }
    }

    public function update(Request $request, $id) {
        try {
            $item = Course::find($id);
            if (!$item) return $this->sendError('Not found');
            $item->update($request->all());
            return $this->sendResponse($item, 'Updated successfully');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 500);
        }
    }

    public function destroy($id) {
        try {
            $item = Course::find($id);
            if (!$item) return $this->sendError('Not found');
            $item->delete();
            return $this->sendResponse([], 'Deleted successfully');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 500);
        }
    }
}
EOD,
    'AssignmentController.php' => <<<'EOD'
<?php
namespace App\Http\Controllers\Api;
use App\Models\Assignment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AssignmentController extends BaseController {
    public function index(Request $request) {
        try {
            $query = Assignment::with(['course.classRoom']);
            if ($request->has('course_id')) $query->where('course_id', $request->course_id);
            if ($request->has('sort')) $query->orderBy($request->sort, $request->get('order', 'asc'));
            return $this->sendResponse($query->paginate($request->get('limit', 15)), 'Retrieved successfully');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 500);
        }
    }

    public function store(Request $request) {
        try {
            $validated = $request->validate([
                'course_id' => 'required|exists:courses,id',
                'title' => 'required|string',
                'description' => 'nullable|string',
                'due_date' => 'nullable|date',
                'file' => 'nullable|file'
            ]);
            if ($request->hasFile('file')) {
                $validated['file_path'] = $request->file('file')->store('assignments', 'public');
            }
            $item = Assignment::create($validated);
            return $this->sendResponse($item, 'Created successfully');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 500);
        }
    }

    public function show($id) {
        try {
            $item = Assignment::with(['course'])->find($id);
            if (!$item) return $this->sendError('Not found');
            return $this->sendResponse($item, 'Retrieved successfully');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 500);
        }
    }

    public function update(Request $request, $id) {
        try {
            $item = Assignment::find($id);
            if (!$item) return $this->sendError('Not found');
            $data = $request->all();
            if ($request->hasFile('file')) {
                if ($item->file_path) Storage::disk('public')->delete($item->file_path);
                $data['file_path'] = $request->file('file')->store('assignments', 'public');
            }
            $item->update($data);
            return $this->sendResponse($item, 'Updated successfully');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 500);
        }
    }

    public function destroy($id) {
        try {
            $item = Assignment::find($id);
            if (!$item) return $this->sendError('Not found');
            if ($item->file_path) Storage::disk('public')->delete($item->file_path);
            $item->delete();
            return $this->sendResponse([], 'Deleted successfully');
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], 500);
        }
    }
}
EOD
];

foreach ($controllers as $filename => $content) {
    file_put_contents($dir . $filename, $content);
}

echo "Controllers created.\n";
