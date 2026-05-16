<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key');
        return response()->json([
            'status' => 'success',
            'data' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'settings' => 'required|array',
        ]);

        foreach ($data['settings'] as $key => $value) {
            // For file uploads (like logos)
            if ($request->hasFile("settings.$key")) {
                $file = $request->file("settings.$key");
                $path = $file->store('settings', 'public');
                $value = '/storage/' . $path;
            }

            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        ActivityLogger::log('update', 'settings', 'Updated system settings');

        return response()->json([
            'status' => 'success',
            'message' => 'Settings updated successfully'
        ]);
    }
}
