<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model {
    use HasFactory;
    protected $fillable = ['user_id', 'class_id', 'parent_id', 'dob'];
    public function user() { return $this->belongsTo(User::class); }
    public function classRoom() { return $this->belongsTo(ClassRoom::class, 'class_id'); }
    public function schoolParent() { return $this->belongsTo(SchoolParent::class, 'parent_id'); }
    public function enrollments() { return $this->hasMany(Enrollment::class); }
    public function attendance() { return $this->hasMany(Attendance::class); }
    public function grades() { return $this->hasMany(Grade::class); }
    public function payments() { return $this->hasMany(Payment::class); }
}