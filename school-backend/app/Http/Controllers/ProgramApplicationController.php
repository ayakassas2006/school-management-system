<?php

namespace App\Http\Controllers;

use App\Models\ProgramApplication;
use Illuminate\Http\Request;

class ProgramApplicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'program_id' => 'required|string',
            'parent_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'child_name' => 'required|string|max:255',
            'child_age' => 'required|integer|min:1',
            'message' => 'nullable|string',
        ]);

        $application = ProgramApplication::create($validated);

        \App\Models\ActivityLog::create([
            'user_id' => null,
            'action_type' => 'created',
            'module' => 'Programs',
            'description' => "New application from {$validated['parent_name']} for child {$validated['child_name']} ({$validated['program_id']}).",
            'ip_address' => $request->ip(),
        ]);

        \App\Events\ProgramApplicationSubmitted::dispatch($validated['parent_name'], $validated['program_id']);

        return response()->json([
            'message' => 'Application submitted successfully!',
            'application' => $application
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(ProgramApplication $programApplication)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProgramApplication $programApplication)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProgramApplication $programApplication)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProgramApplication $programApplication)
    {
        //
    }
}
