<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grade extends Model {
    use HasFactory;
    protected $fillable = ['student_id', 'course_id', 'cc1', 'cc2', 'cc3', 'efm', 'score'];
    public function student() { return $this->belongsTo(Student::class); }
    public function course() { return $this->belongsTo(Course::class); }
}