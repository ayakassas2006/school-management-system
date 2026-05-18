<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{
    /**
     * Display a listing of courses.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Course::with(['classRoom', 'assignments', 'teacher.user'])->withCount('enrollments');

        if ($user && $user->role === 'teacher') {
            $teacher = \App\Models\Teacher::where('user_id', $user->id)->first();
            if ($teacher) {
                $query->where('teacher_id', $teacher->id);
            }
        } elseif ($user && $user->role === 'student') {
            $student = \App\Models\Student::where('user_id', $user->id)->first();
            if ($student && $student->class_id) {
                $query->where('class_id', $student->class_id);
            }
        }

        $courses = $query->get();
        return response()->json(['status' => 'success', 'data' => $courses]);
    }

    /**
     * Store a newly created course.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'class_id' => 'required|exists:classes,id',
            'description' => 'nullable|string',
            'instructor' => 'nullable|string',
            'capacity' => 'nullable|integer',
            'schedule' => 'nullable|string',
            'duration' => 'nullable|string',
            'teacher_id' => 'nullable|exists:teachers,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $course = Course::create($request->all());

        return response()->json(['status' => 'success', 'data' => $course, 'message' => 'Course created and linked to class.'], 201);
    }

    /**
     * Display the specified course.
     */
    public function show($id)
    {
        $course = Course::with(['classRoom', 'assignments', 'grades.student.user'])->find($id);
        if (!$course) {
            return response()->json(['status' => 'error', 'message' => 'Course not found.'], 404);
        }
        return response()->json(['status' => 'success', 'data' => $course]);
    }

    /**
     * Update the specified course.
     */
    public function update(Request $request, $id)
    {
        $course = Course::find($id);
        if (!$course) {
            return response()->json(['status' => 'error', 'message' => 'Course not found.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'class_id' => 'nullable|exists:classes,id',
            'description' => 'nullable|string',
            'instructor' => 'nullable|string',
            'capacity' => 'nullable|integer',
            'schedule' => 'nullable|string',
            'duration' => 'nullable|string',
            'teacher_id' => 'nullable|exists:teachers,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $course->update($request->all());

        return response()->json(['status' => 'success', 'data' => $course, 'message' => 'Course updated.']);
    }

    /**
     * Remove the specified course.
     */
    public function destroy($id)
    {
        $course = Course::find($id);
        if (!$course) {
            return response()->json(['status' => 'error', 'message' => 'Course not found.'], 404);
        }
        $course->delete();
        return response()->json(['status' => 'success', 'message' => 'Course deleted.']);
    }

    /**
     * Display the roster for the specified course (students in the same class).
     */
    public function roster($id)
    {
        $course = Course::find($id);
        if (!$course) {
            return response()->json(['status' => 'error', 'message' => 'Course not found.'], 404);
        }

        if (!$course->class_id) {
            return response()->json([]); // No class assigned to this course
        }

        $students = \App\Models\Student::where('class_id', $course->class_id)
            ->with('user')
            ->get();

        $result = $students->map(function ($student) {
            return [
                'id' => $student->id,
                'name' => $student->user ? $student->user->name : 'Unknown',
            ];
        });

        return response()->json($result);
    }

    /**
     * Get all courses belonging to the currently authenticated teacher (scoped).
     * Returns courses where either:
     *   - The course belongs to a class the teacher is assigned to (via class_teacher pivot), OR
     *   - The course has the teacher's teacher_id directly set on it.
     */
    public function myCourses(Request $request)
    {
        $user = $request->user();
        $teacher = \App\Models\Teacher::where('user_id', $user->id)->first();

        if (!$teacher) {
            return response()->json(['status' => 'error', 'message' => 'Teacher profile not found.'], 404);
        }

        // Get class IDs from the pivot table
        $classIds = $teacher->classes()->pluck('classes.id')->toArray();

        $courses = Course::with(['classRoom'])
            ->where(function ($q) use ($classIds, $teacher) {
                if (!empty($classIds)) {
                    $q->whereIn('class_id', $classIds);
                }
                // Also include courses directly assigned to this teacher
                $q->orWhere('teacher_id', $teacher->id);
            })
            ->get()
            ->map(function ($course) {
                return [
                    'id'       => $course->id,
                    'name'     => $course->name,
                    'class_id' => $course->class_id,
                    'class'    => $course->classRoom ? ['id' => $course->classRoom->id, 'name' => $course->classRoom->name] : null,
                ];
            });

        return response()->json(['status' => 'success', 'data' => $courses]);
    }
}
