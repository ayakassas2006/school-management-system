<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\SchoolParent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
use App\Services\ActivityLogger;
use App\Models\Course;

class AuthController extends Controller
{
    /**
     * Register a new user with role-based profile creation.
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:admin,teacher,student,parent',
            'class_ids' => 'nullable|array',
            'class_ids.*' => 'exists:classes,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();

        try {
            $avatarPath = null;
            if ($request->hasFile('avatar')) {
                $avatarPath = $request->file('avatar')->store('avatars', 'public');
            }

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
                'avatar' => $avatarPath,
            ]);

            switch ($request->role) {
                case 'student':
                    Student::create([
                        'user_id' => $user->id,
                        'class_id' => $request->class_id,
                        'parent_id' => $request->parent_id,
                    ]);
                    break;
                case 'teacher':
                    $teacher = Teacher::create([
                        'user_id' => $user->id,
                        'specialization' => $request->specialization,
                    ]);
                    
                    if ($request->has('class_ids') && is_array($request->class_ids)) {
                        \App\Models\ClassRoom::whereIn('id', $request->class_ids)->update(['teacher_id' => $teacher->id]);
                    }
                    break;
                case 'parent':
                    $parent = SchoolParent::create(['user_id' => $user->id]);
                    if ($request->has('student_ids') && is_array($request->student_ids)) {
                        Student::whereIn('id', $request->student_ids)->update(['parent_id' => $parent->id]);
                    } elseif ($request->student_id) {
                        Student::where('id', $request->student_id)->update(['parent_id' => $parent->id]);
                    }
                    break;
            }

            DB::commit();

            $token = $user->createToken('auth_token')->plainTextToken;

            ActivityLogger::log('register', 'auth', 'New user registered: ' . $user->email, $user->id);

            return response()->json([
                'status' => 'success',
                'data' => [
                    'user' => $user,
                    'access_token' => $token,
                    'token_type' => 'Bearer',
                ],
                'message' => 'User registered successfully and profile created.',
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Registration failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Authenticate a user and return a Sanctum token.
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
            'role' => 'required|in:admin,teacher,student,parent',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found.',
            ], 404);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid password.',
            ], 401);
        }

        if ($user->role !== $request->role) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid role selected.',
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        ActivityLogger::log('login', 'auth', 'User logged in', $user->id);

        return response()->json([
            'status' => 'success',
            'data' => [
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ],
            'message' => 'Logged in successfully.',
        ], 200);
    }

    /**
     * Log out the user and revoke the token.
     */
    public function logout(Request $request)
    {
        ActivityLogger::log('logout', 'auth', 'User logged out', $request->user()->id);
        
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully.',
        ]);
    }
}