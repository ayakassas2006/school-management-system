<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    /**
     * Display a listing of personal messages (inbox).
     */
    public function index()
    {
        $userId = Auth::id();
        $messages = Message::with(['sender', 'receiver'])
            ->where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['status' => 'success', 'data' => $messages]);
    }

    /**
     * Get conversation thread between the authenticated user and another user.
     */
    public function conversation($otherUserId)
    {
        $authUserId = Auth::id();
        
        $messages = Message::with(['sender', 'receiver'])
            ->where(function ($query) use ($authUserId, $otherUserId) {
                $query->where('sender_id', $authUserId)->where('receiver_id', $otherUserId);
            })
            ->orWhere(function ($query) use ($authUserId, $otherUserId) {
                $query->where('sender_id', $otherUserId)->where('receiver_id', $authUserId);
            })
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json(['status' => 'success', 'data' => $messages]);
    }

    /**
     * Send a new message.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'receiver_id' => 'required|exists:users,id',
            'content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $message = Message::create([
            'sender_id' => Auth::id(),
            'receiver_id' => $request->receiver_id,
            'content' => $request->content,
            'is_read' => false
        ]);

        return response()->json(['status' => 'success', 'data' => $message, 'message' => 'Message sent.'], 201);
    }

    /**
     * Mark message as read.
     */
    public function markAsRead($id)
    {
        $message = Message::find($id);
        if (!$message) {
            return response()->json(['status' => 'error', 'message' => 'Message not found.'], 404);
        }

        if ($message->receiver_id !== Auth::id()) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized.'], 403);
        }

        $message->update(['is_read' => true]);

        return response()->json(['status' => 'success', 'message' => 'Message marked as read.']);
    }
}