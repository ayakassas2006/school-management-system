<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StudentController extends Controller
{
    /**
     * Display a listing of students.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $query = Student::with(['user', 'classRoom', 'schoolParent.user', 'grades', 'attendance']);

        if ($request->has('class_id') && $request->class_id !== '') {
            $query->where('class_id', $request->class_id);
        }

        $students = $query->get();
        return response()->json(['status' => 'success', 'data' => $students]);
    }

    /**
     * Store a newly created student (link existing user or create user).
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'class_id' => 'nullable|exists:classes,id',
            'parent_id' => 'nullable|exists:parents,id',
            'dob' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $student = Student::create($request->all());

        return response()->json(['status' => 'success', 'data' => $student, 'message' => 'Student record created.'], 201);
    }

    /**
     * Display the specified student.
     */
    public function show($id)
    {
        $student = Student::with(['user', 'classRoom', 'schoolParent.user', 'grades', 'attendance'])->find($id);
        if (!$student) {
            return response()->json(['status' => 'error', 'message' => 'Student not found.'], 404);
        }
        return response()->json(['status' => 'success', 'data' => $student]);
    }

    /**
     * Update the specified student (assign class/parent).
     */
    public function update(Request $request, $id)
    {
        $student = Student::find($id);
        if (!$student) {
            return response()->json(['status' => 'error', 'message' => 'Student not found.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'class_id' => 'nullable|exists:classes,id',
            'parent_id' => 'nullable|exists:parents,id',
            'dob' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $student->update($request->all());

        return response()->json(['status' => 'success', 'data' => $student, 'message' => 'Student record updated.']);
    }

    public function destroy($id)
    {
        $student = Student::find($id);
        if (!$student) {
            return response()->json(['status' => 'error', 'message' => 'Student not found.'], 404);
        }
        $userId = $student->user_id;
        $student->delete();
        if ($userId) {
            User::where('id', $userId)->delete();
        }
        return response()->json(['status' => 'success', 'message' => 'Student record deleted.']);
    }

    public function assignClass(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'required|exists:students,id',
            'class_id' => 'required|exists:classes,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        try {
            $student = Student::findOrFail($request->student_id);
            $student->update(['class_id' => $request->class_id]);

            return response()->json([
                'status' => 'success',
                'message' => 'Student successfully added to the class roster.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to assign student: ' . $e->getMessage()
            ], 500);
        }
    }
}
