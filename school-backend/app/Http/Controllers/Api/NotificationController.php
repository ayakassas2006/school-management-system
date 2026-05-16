<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Display a listing of personal notifications.
     */
    public function index()
    {
        $notifications = Notification::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['status' => 'success', 'data' => $notifications]);
    }

    /**
     * Store a newly created notification.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'message' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $notification = Notification::create([
            'user_id' => $request->user_id,
            'title' => $request->title,
            'message' => $request->message,
            'read' => false
        ]);

        return response()->json(['status' => 'success', 'data' => $notification, 'message' => 'Notification created.'], 201);
    }

    /**
     * Mark notification as read.
     */
    public function markAsRead(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'sometimes|exists:notifications,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        if ($request->has('id')) {
            $notification = Notification::where('id', $request->id)
                ->where('user_id', Auth::id())
                ->first();
            
            if ($notification) {
                $notification->update(['read' => true]);
            }
        } else {
            // Mark all as read
            Notification::where('user_id', Auth::id())
                ->update(['read' => true]);
        }

        return response()->json(['status' => 'success', 'message' => 'Notifications marked as read.']);
    }
}