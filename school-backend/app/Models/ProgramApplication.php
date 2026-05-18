<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProgramApplication extends Model
{
    protected $fillable = [
        'program_id',
        'parent_name',
        'email',
        'phone',
        'child_name',
        'child_age',
        'message',
        'status',
    ];
}
