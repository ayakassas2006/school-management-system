<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AttendanceController extends Controller
{
    /**
     * Display a listing of attendance records, filtered by date, class, or course.
     */
    public function index(Request $request)
    {
        $query = Attendance::with(['student.user']);

        if ($request->has('date')) {
            $query->whereDate('date', $request->date);
        }

        if ($request->has('class_id')) {
            $query->whereHas('student', function ($q) use ($request) {
                $q->where('class_id', $request->class_id);
            });
        }

        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        $attendance = $query->get();
        return response()->json(['status' => 'success', 'data' => $attendance]);
    }

    /**
     * Store a newly created attendance record.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'required|exists:students,id',
            'course_id'  => 'nullable|exists:courses,id',
            'date'       => 'required|date',
            'status'     => 'required|in:present,absent,late,excused',
            'remarks'    => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $attendance = Attendance::updateOrCreate(
            [
                'student_id' => $request->student_id,
                'course_id'  => $request->course_id,
                'date'       => $request->date,
            ],
            ['status' => $request->status, 'remarks' => $request->remarks]
        );

        return response()->json([
            'status'  => 'success',
            'data'    => $attendance,
            'message' => 'Attendance recorded successfully.'
        ]);
    }

    /**
     * Batch store attendance for multiple students scoped to a course.
     */
    public function batchStore(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'date'                       => 'required|date',
            'course_id'                  => 'nullable|exists:courses,id',
            'attendance'                 => 'required|array',
            'attendance.*.student_id'    => 'required|exists:students,id',
            'attendance.*.status'        => 'required|in:present,absent,late,excused',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        foreach ($request->attendance as $record) {
            Attendance::updateOrCreate(
                [
                    'student_id' => $record['student_id'],
                    'course_id'  => $request->course_id,
                    'date'       => $request->date,
                ],
                ['status' => $record['status'], 'remarks' => $record['remarks'] ?? null]
            );
        }

        return response()->json(['status' => 'success', 'message' => 'Batch attendance recorded.']);
    }
}