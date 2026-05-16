<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ClassRoom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ClassController extends Controller
{
    /**
     * Display a listing of classes.
     */
    public function index()
    {
        $classes = ClassRoom::with(['teacher.user', 'students.user'])->get();
        return response()->json(['status' => 'success', 'data' => $classes]);
    }

    /**
     * Store a newly created class.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'teacher_id' => 'nullable|exists:teachers,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $class = ClassRoom::create($request->all());

        return response()->json(['status' => 'success', 'data' => $class, 'message' => 'Class created.'], 201);
    }

    /**
     * Display the specified class with its students.
     */
    public function show($id)
    {
        $class = ClassRoom::with(['teacher.user', 'students.user', 'courses'])->find($id);
        if (!$class) {
            return response()->json(['status' => 'error', 'message' => 'Class not found.'], 404);
        }
        return response()->json(['status' => 'success', 'data' => $class]);
    }

    /**
     * Update the specified class (assign teacher).
     */
    public function update(Request $request, $id)
    {
        $class = ClassRoom::find($id);
        if (!$class) {
            return response()->json(['status' => 'error', 'message' => 'Class not found.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'teacher_id' => 'nullable|exists:teachers,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $class->update($request->all());

        return response()->json(['status' => 'success', 'data' => $class, 'message' => 'Class updated.']);
    }

    /**
     * Remove the specified class.
     */
    public function destroy($id)
    {
        $class = ClassRoom::find($id);
        if (!$class) {
            return response()->json(['status' => 'error', 'message' => 'Class not found.'], 404);
        }
        $class->delete();
        return response()->json(['status' => 'success', 'message' => 'Class deleted.']);
    }
}
