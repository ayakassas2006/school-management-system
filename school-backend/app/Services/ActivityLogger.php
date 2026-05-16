<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Request;

class ActivityLogger
{
    public static function log($actionType, $module, $description, $userId = null)
    {
        ActivityLog::create([
            'user_id' => $userId ?? auth()->id(),
            'action_type' => $actionType,
            'module' => $module,
            'description' => $description,
            'ip_address' => Request::ip(),
        ]);
    }
}
