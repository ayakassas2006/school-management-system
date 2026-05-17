<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::with('course')->get();
        return response()->json(['status' => 'success', 'data' => $events]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after_or_equal:start_time',
            'type' => 'nullable|string',
            'description' => 'nullable|string',
            'course_id' => 'nullable|exists:courses,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $event = Event::create($request->all());

        return response()->json(['status' => 'success', 'data' => $event, 'message' => 'Event created.'], 201);
    }

    public function destroy($id)
    {
        $event = Event::find($id);
        if (!$event) {
            return response()->json(['status' => 'error', 'message' => 'Event not found.'], 404);
        }
        $event->delete();
        return response()->json(['status' => 'success', 'message' => 'Event deleted.']);
    }
}
