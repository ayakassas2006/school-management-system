<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model {
    use HasFactory;
    protected $fillable = ['name', 'class_id', 'description', 'instructor', 'capacity', 'schedule', 'duration', 'teacher_id'];
    public function classRoom() { return $this->belongsTo(ClassRoom::class, 'class_id'); }
    public function teacher() { return $this->belongsTo(Teacher::class); }
    public function enrollments() { return $this->hasMany(Enrollment::class); }
    public function assignments() { return $this->hasMany(Assignment::class); }
    public function grades() { return $this->hasMany(Grade::class); }
}