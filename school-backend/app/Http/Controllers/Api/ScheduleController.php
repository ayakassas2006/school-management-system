<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index()
    {
        $schedules = Schedule::with(['classRoom', 'course', 'teacher.user'])->get();
        return response()->json([
            'status' => 'success',
            'data' => $schedules
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'class_room_id' => 'required|exists:classes,id',
            'course_id' => 'required|exists:courses,id',
            'teacher_id' => 'required|exists:teachers,id',
            'day_of_week' => 'required|string',
            'start_time' => 'required',
            'end_time' => 'required',
            'room_number' => 'nullable|string',
        ]);

        // Basic conflict validation
        $conflict = Schedule::where('teacher_id', $data['teacher_id'])
            ->where('day_of_week', $data['day_of_week'])
            ->where(function($query) use ($data) {
                $query->whereBetween('start_time', [$data['start_time'], $data['end_time']])
                      ->orWhereBetween('end_time', [$data['start_time'], $data['end_time']]);
            })
            ->first();
            
        if ($conflict) {
            return response()->json([
                'status' => 'error',
                'message' => 'Teacher already has a class scheduled at this time'
            ], 409);
        }

        $schedule = Schedule::create($data);
        
        ActivityLogger::log('create', 'schedules', 'Created a new schedule for class ID ' . $data['class_room_id']);

        return response()->json([
            'status' => 'success',
            'message' => 'Schedule created successfully',
            'data' => $schedule
        ]);
    }

    public function update(Request $request, $id)
    {
        $schedule = Schedule::findOrFail($id);

        $data = $request->validate([
            'class_room_id' => 'required|exists:classes,id',
            'course_id' => 'required|exists:courses,id',
            'teacher_id' => 'required|exists:teachers,id',
            'day_of_week' => 'required|string',
            'start_time' => 'required',
            'end_time' => 'required',
            'room_number' => 'nullable|string',
        ]);

        $schedule->update($data);

        ActivityLogger::log('update', 'schedules', 'Updated schedule ID ' . $id);

        return response()->json([
            'status' => 'success',
            'message' => 'Schedule updated successfully',
            'data' => $schedule
        ]);
    }

    public function destroy($id)
    {
        $schedule = Schedule::findOrFail($id);
        $schedule->delete();

        ActivityLogger::log('delete', 'schedules', 'Deleted schedule ID ' . $id);

        return response()->json([
            'status' => 'success',
            'message' => 'Schedule deleted successfully'
        ]);
    }
}
