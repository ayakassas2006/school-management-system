<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SchoolParent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SchoolParentController extends Controller
{
    /**
     * Display a listing of parents.
     */
    public function index()
    {
        $parents = SchoolParent::with(['user', 'students.user'])->get();
        return response()->json(['status' => 'success', 'data' => $parents]);
    }

    /**
     * Store a newly created parent record.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $parent = SchoolParent::create($request->all());

        return response()->json(['status' => 'success', 'data' => $parent, 'message' => 'Parent record created.'], 201);
    }

    /**
     * Display the specified parent.
     */
    public function show($id)
    {
        $parent = SchoolParent::with(['user', 'students.user'])->find($id);
        if (!$parent) {
            return response()->json(['status' => 'error', 'message' => 'Parent record not found.'], 404);
        }
        return response()->json(['status' => 'success', 'data' => $parent]);
    }

    /**
     * Update the specified parent record.
     */
    public function update(Request $request, $id)
    {
        $parent = SchoolParent::find($id);
        if (!$parent) {
            return response()->json(['status' => 'error', 'message' => 'Parent record not found.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $parent->update($request->all());

        return response()->json(['status' => 'success', 'data' => $parent, 'message' => 'Parent record updated.']);
    }

    /**
     * Remove the specified parent record.
     */
    public function destroy($id)
    {
        $parent = SchoolParent::find($id);
        if (!$parent) {
            return response()->json(['status' => 'error', 'message' => 'Parent record not found.'], 404);
        }
        $parent->delete();
        return response()->json(['status' => 'success', 'message' => 'Parent record deleted.']);
    }

    /**
     * Fetch fees/payments for all students associated with a parent.
     */
    public function fees($id)
    {
        $parent = SchoolParent::with('students.payments.student.user')->where('user_id', $id)->first();
        
        if (!$parent) {
            return response()->json(['status' => 'error', 'message' => 'Parent not found.'], 404);
        }

        $fees = collect();
        foreach ($parent->students as $student) {
            foreach ($student->payments as $payment) {
                $payment->student_name = $student->user->name ?? 'Unknown Student';
                $fees->push($payment);
            }
        }

        return response()->json(['status' => 'success', 'data' => $fees]);
    }
}