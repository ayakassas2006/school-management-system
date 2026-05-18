<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Grade;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GradeController extends Controller
{
    /**
     * Display a listing of grades, filtered by class or course.
     */
    public function index(Request $request)
    {
        $query = Grade::with(['student.user', 'course']);

        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        if ($request->has('class_id')) {
            $query->whereHas('student', function ($q) use ($request) {
                $q->where('class_id', $request->class_id);
            });
        }

        $grades = $query->get();
        return response()->json(['status' => 'success', 'data' => $grades]);
    }

    /**
     * Store a newly created grade.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'required|exists:students,id',
            'course_id'  => 'required|exists:courses,id',
            'cc1'        => 'nullable|numeric|min:0|max:20',
            'cc2'        => 'nullable|numeric|min:0|max:20',
            'cc3'        => 'nullable|numeric|min:0|max:20',
            'efm'        => 'nullable|numeric|min:0|max:20',
            'score'      => 'required|numeric|min:0|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $grade = Grade::updateOrCreate(
            ['student_id' => $request->student_id, 'course_id' => $request->course_id],
            [
                'cc1'   => $request->cc1 ?? 0,
                'cc2'   => $request->cc2 ?? 0,
                'cc3'   => $request->cc3 ?? 0,
                'efm'   => $request->efm ?? 0,
                'score' => $request->score
            ]
        );

        return response()->json([
            'status' => 'success', 
            'data' => $grade, 
            'message' => 'Grade recorded (Scale: 0-20).'
        ]);
    }

    /**
     * Display grades for a specific student.
     */
    public function studentGrades($studentId)
    {
        $grades = Grade::with('course')->where('student_id', $studentId)->get();
        return response()->json(['status' => 'success', 'data' => $grades]);
    }
}