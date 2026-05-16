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
        $query = Course::with(['classRoom', 'assignments', 'teacher.user']);

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
            'class_name' => 'required|string',
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

        $class = \App\Models\ClassRoom::firstOrCreate(
            ['name' => $request->class_name],
            ['teacher_id' => $request->teacher_id]
        );
        
        // If the class exists but has no teacher_id, let's assign it
        if (!$class->teacher_id && $request->teacher_id) {
            $class->update(['teacher_id' => $request->teacher_id]);
        }
        
        $data = $request->all();
        $data['class_id'] = $class->id;
        
        $course = Course::create($data);

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
            'class_name' => 'nullable|string',
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

        $data = $request->all();

        if ($request->filled('class_name')) {
            $class = \App\Models\ClassRoom::firstOrCreate(['name' => $request->class_name]);
            if ($request->filled('teacher_id')) {
                $class->update(['teacher_id' => $request->teacher_id]);
            }
            $data['class_id'] = $class->id;
        }

        $course->update($data);

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
}
