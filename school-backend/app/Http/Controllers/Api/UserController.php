<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use App\Services\ActivityLogger;

class UserController extends Controller
{
    /**
     * Get all users with their role sub-profiles (for admin directory).
     */
    public function index(Request $request)
    {
        $query = User::with(['student', 'teacher', 'schoolParent']);

        if ($request->has('role') && $request->role !== 'All') {
            $query->where('role', strtolower($request->role));
        }

        if ($request->has('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%$s%")
                  ->orWhere('email', 'like', "%$s%");
            });
        }

        $users = $query->get()->map(function ($user) {
            $profile = $user->role === 'student'
                ? $user->student
                : ($user->role === 'teacher' ? $user->teacher : $user->schoolParent);
            return [
                'id'         => $user->id,
                'name'       => $user->name,
                'email'      => $user->email,
                'role'       => ucfirst($user->role),
                'created_at' => $user->created_at,
                'profile'    => $profile,
            ];
        });

        return response()->json(['status' => 'success', 'data' => $users]);
    }

    /**
     * Update user profile details (name, email).
     */
    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'User not found.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'  => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $id,
            'password' => 'nullable|string|min:8',
            'role'  => 'sometimes|string|in:admin,teacher,student,parent'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $data = $request->only('name', 'email');
        if ($request->filled('password')) {
            $data['password'] = bcrypt($request->password);
        }
        // If role is provided and differs, we could update it, but handling cross-role profile changes 
        // is complex. Let's just update the role if provided.
        if ($request->has('role') && $request->role !== $user->role) {
            $data['role'] = $request->role;
        }

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $user->update($data);

        // Update sub-profiles if applicable
        if ($user->role === 'teacher') {
            $teacherData = [];
            if ($request->has('specialization')) $teacherData['specialization'] = $request->specialization;
            if (!empty($teacherData) && $user->teacher) {
                $user->teacher()->update($teacherData);
            }
            if ($request->has('class_id') && $user->teacher) {
                // Clear any existing class assignment for this teacher
                \App\Models\ClassRoom::where('teacher_id', $user->teacher->id)->update(['teacher_id' => null]);
                
                if ($request->filled('class_id')) {
                    \App\Models\ClassRoom::where('id', $request->class_id)->update(['teacher_id' => $user->teacher->id]);
                }
            }
        } elseif ($user->role === 'student') {
            $studentData = [];
            if ($request->has('class_id')) $studentData['class_id'] = $request->class_id;
            if ($request->has('parent_id')) $studentData['parent_id'] = $request->parent_id;
            if (!empty($studentData) && $user->student) {
                $user->student()->update($studentData);
            }
        } elseif ($user->role === 'parent') {
            if ($request->has('student_id') && $user->schoolParent) {
                // Clear any previous assignments if necessary
                \App\Models\Student::where('parent_id', $user->schoolParent->id)->update(['parent_id' => null]);
                
                if ($request->filled('student_id')) {
                    $student = \App\Models\Student::find($request->student_id);
                    if ($student) {
                        $student->update(['parent_id' => $user->schoolParent->id]);
                    }
                }
            }
        }

        ActivityLogger::log('update', 'users', 'Updated user profile for ' . $user->email);

        return response()->json(['status' => 'success', 'data' => $user, 'message' => 'User updated.']);
    }

    /**
     * Delete a user.
     */
    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'User not found.'], 404);
        }

        ActivityLogger::log('delete', 'users', 'Deleted user ' . $user->email);
        $user->delete();
        
        return response()->json(['status' => 'success', 'message' => 'User deleted.']);
    }
}
