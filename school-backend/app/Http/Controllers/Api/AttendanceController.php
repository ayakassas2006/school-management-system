<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AttendanceController extends Controller
{
    /**
     * Display a listing of attendance records, filtered by date or class.
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
            'date' => 'required|date',
            'status' => 'required|in:present,absent,late,excused',
            'remarks' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        // Avoid duplicate attendance for same student on same date
        $attendance = Attendance::updateOrCreate(
            ['student_id' => $request->student_id, 'date' => $request->date],
            ['status' => $request->status, 'remarks' => $request->remarks]
        );

        return response()->json([
            'status' => 'success', 
            'data' => $attendance, 
            'message' => 'Attendance recorded successfully.'
        ]);
    }

    /**
     * Batch store attendance for multiple students.
     */
    public function batchStore(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date',
            'attendance' => 'required|array',
            'attendance.*.student_id' => 'required|exists:students,id',
            'attendance.*.status' => 'required|in:present,absent,late,excused',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        foreach ($request->attendance as $record) {
            Attendance::updateOrCreate(
                ['student_id' => $record['student_id'], 'date' => $request->date],
                ['status' => $record['status']]
            );
        }

        return response()->json(['status' => 'success', 'message' => 'Batch attendance recorded.']);
    }
}