<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model {
    use HasFactory;
    protected $fillable = ['user_id', 'specialization'];
    public function user() { return $this->belongsTo(User::class); }
    public function classes() { return $this->hasMany(ClassRoom::class, 'teacher_id'); }
    public function courses() { return $this->hasMany(Course::class); }
}