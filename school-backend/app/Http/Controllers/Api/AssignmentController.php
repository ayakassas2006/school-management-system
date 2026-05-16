<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AssignmentController extends Controller
{
    /**
     * Display a listing of assignments.
     */
    public function index(Request $request)
    {
        $query = Assignment::with('course');
        
        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        $assignments = $query->get();
        return response()->json(['status' => 'success', 'data' => $assignments]);
    }

    /**
     * Store a newly created assignment.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'course_id' => 'nullable|exists:courses,id',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $assignment = Assignment::create($request->all());

        return response()->json(['status' => 'success', 'data' => $assignment, 'message' => 'Assignment created.'], 201);
    }

    /**
     * Display the specified assignment.
     */
    public function show($id)
    {
        $assignment = Assignment::with('course')->find($id);
        if (!$assignment) {
            return response()->json(['status' => 'error', 'message' => 'Assignment not found.'], 404);
        }
        return response()->json(['status' => 'success', 'data' => $assignment]);
    }

    /**
     * Update the specified assignment.
     */
    public function update(Request $request, $id)
    {
        $assignment = Assignment::find($id);
        if (!$assignment) {
            return response()->json(['status' => 'error', 'message' => 'Assignment not found.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'course_id' => 'sometimes|required|exists:courses,id',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $assignment->update($request->all());

        return response()->json(['status' => 'success', 'data' => $assignment, 'message' => 'Assignment updated.']);
    }

    /**
     * Remove the specified assignment.
     */
    public function destroy($id)
    {
        $assignment = Assignment::find($id);
        if (!$assignment) {
            return response()->json(['status' => 'error', 'message' => 'Assignment not found.'], 404);
        }
        $assignment->delete();
        return response()->json(['status' => 'success', 'message' => 'Assignment deleted.']);
    }
}
