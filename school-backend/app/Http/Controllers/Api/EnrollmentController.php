<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EnrollmentController extends Controller
{
    /**
     * Display a listing of enrollments.
     */
    public function index()
    {
        $enrollments = Enrollment::with(['student.user', 'course'])->get();
        return response()->json(['status' => 'success', 'data' => $enrollments]);
    }

    /**
     * Store a newly created enrollment (Enroll a student in a course).
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'required|exists:students,id',
            'course_id' => 'required|exists:courses,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        // Check if already enrolled
        $exists = Enrollment::where('student_id', $request->student_id)
            ->where('course_id', $request->course_id)
            ->exists();
        
        if ($exists) {
            return response()->json(['status' => 'error', 'message' => 'Student already enrolled in this course.'], 400);
        }

        $enrollment = Enrollment::create($request->all());

        return response()->json(['status' => 'success', 'data' => $enrollment, 'message' => 'Student enrolled successfully.'], 201);
    }

    /**
     * Remove the specified enrollment.
     */
    public function destroy($id)
    {
        $enrollment = Enrollment::find($id);
        if (!$enrollment) {
            return response()->json(['status' => 'error', 'message' => 'Enrollment not found.'], 404);
        }
        $enrollment->delete();
        return response()->json(['status' => 'success', 'message' => 'Enrollment deleted.']);
    }
}