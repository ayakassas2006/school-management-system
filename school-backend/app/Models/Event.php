<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'title',
        'description',
        'start_time',
        'end_time',
        'course_id',
        'type'
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
