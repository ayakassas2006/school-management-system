<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TeacherController extends Controller
{
    /**
     * Display a listing of teachers.
     */
    public function index()
    {
        $teachers = Teacher::with(['user', 'classes'])->get();
        return response()->json(['status' => 'success', 'data' => $teachers]);
    }

    /**
     * Store a newly created teacher.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'specialization' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $teacher = Teacher::create($request->all());

        return response()->json(['status' => 'success', 'data' => $teacher, 'message' => 'Teacher record created.'], 201);
    }

    /**
     * Display the specified teacher.
     */
    public function show($id)
    {
        $teacher = Teacher::with(['user', 'classes'])->find($id);
        if (!$teacher) {
            return response()->json(['status' => 'error', 'message' => 'Teacher not found.'], 404);
        }
        return response()->json(['status' => 'success', 'data' => $teacher]);
    }

    /**
     * Update the specified teacher.
     */
    public function update(Request $request, $id)
    {
        $teacher = Teacher::find($id);
        if (!$teacher) {
            return response()->json(['status' => 'error', 'message' => 'Teacher not found.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'specialization' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $teacher->update($request->all());

        return response()->json(['status' => 'success', 'data' => $teacher, 'message' => 'Teacher record updated.']);
    }

    /**
     * Remove the specified teacher.
     */
    public function destroy($id)
    {
        $teacher = Teacher::find($id);
        if (!$teacher) {
            return response()->json(['status' => 'error', 'message' => 'Teacher not found.'], 404);
        }
        $teacher->delete();
        return response()->json(['status' => 'success', 'message' => 'Teacher record deleted.']);
    }
}
