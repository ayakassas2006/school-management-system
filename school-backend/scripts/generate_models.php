<?php

$dir = __DIR__ . '/backend/app/Models/';

$models = [
    'User.php' => <<<'EOD'
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable {
    use HasApiTokens, HasFactory, Notifiable;
    protected $fillable = ['name', 'email', 'password', 'role'];
    protected $hidden = ['password', 'remember_token'];
    protected function casts(): array { return ['email_verified_at' => 'datetime', 'password' => 'hashed']; }

    public function student() { return $this->hasOne(Student::class); }
    public function teacher() { return $this->hasOne(Teacher::class); }
    public function schoolParent() { return $this->hasOne(SchoolParent::class); }
}
EOD,
    'SchoolParent.php' => <<<'EOD'
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolParent extends Model {
    use HasFactory;
    protected $table = 'parents';
    protected $fillable = ['user_id', 'phone', 'address'];
    public function user() { return $this->belongsTo(User::class); }
    public function students() { return $this->hasMany(Student::class, 'parent_id'); }
}
EOD,
    'Teacher.php' => <<<'EOD'
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Teacher extends Model {
    use HasFactory;
    protected $fillable = ['user_id', 'specialization'];
    public function user() { return $this->belongsTo(User::class); }
    public function classes() { return $this->hasMany(ClassRoom::class, 'teacher_id'); }
}
EOD,
    'ClassRoom.php' => <<<'EOD'
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassRoom extends Model {
    use HasFactory;
    protected $table = 'classes';
    protected $fillable = ['name', 'teacher_id'];
    public function teacher() { return $this->belongsTo(Teacher::class, 'teacher_id'); }
    public function students() { return $this->hasMany(Student::class, 'class_id'); }
    public function courses() { return $this->hasMany(Course::class, 'class_id'); }
}
EOD,
    'Student.php' => <<<'EOD'
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
EOD,
    'Course.php' => <<<'EOD'
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model {
    use HasFactory;
    protected $fillable = ['name', 'class_id', 'description'];
    public function classRoom() { return $this->belongsTo(ClassRoom::class, 'class_id'); }
    public function enrollments() { return $this->hasMany(Enrollment::class); }
    public function assignments() { return $this->hasMany(Assignment::class); }
    public function grades() { return $this->hasMany(Grade::class); }
}
EOD,
    'Enrollment.php' => <<<'EOD'
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model {
    use HasFactory;
    protected $fillable = ['student_id', 'course_id'];
    public function student() { return $this->belongsTo(Student::class); }
    public function course() { return $this->belongsTo(Course::class); }
}
EOD,
    'Attendance.php' => <<<'EOD'
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model {
    use HasFactory;
    protected $table = 'attendance';
    protected $fillable = ['student_id', 'date', 'status'];
    public function student() { return $this->belongsTo(Student::class); }
}
EOD,
    'Grade.php' => <<<'EOD'
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grade extends Model {
    use HasFactory;
    protected $fillable = ['student_id', 'course_id', 'score'];
    public function student() { return $this->belongsTo(Student::class); }
    public function course() { return $this->belongsTo(Course::class); }
}
EOD,
    'Assignment.php' => <<<'EOD'
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assignment extends Model {
    use HasFactory;
    protected $fillable = ['course_id', 'title', 'description', 'due_date', 'file_path'];
    protected $casts = ['due_date' => 'datetime'];
    public function course() { return $this->belongsTo(Course::class); }
}
EOD,
    'Payment.php' => <<<'EOD'
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model {
    use HasFactory;
    protected $fillable = ['student_id', 'amount', 'status'];
    public function student() { return $this->belongsTo(Student::class); }
}
EOD,
    'Message.php' => <<<'EOD'
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model {
    use HasFactory;
    protected $fillable = ['sender_id', 'receiver_id', 'content', 'is_read'];
    public function sender() { return $this->belongsTo(User::class, 'sender_id'); }
    public function receiver() { return $this->belongsTo(User::class, 'receiver_id'); }
}
EOD,
    'Notification.php' => <<<'EOD'
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model {
    use HasFactory;
    protected $fillable = ['user_id', 'title', 'message', 'read'];
    public function user() { return $this->belongsTo(User::class); }
}
EOD
];

foreach ($models as $filename => $content) {
    file_put_contents($dir . $filename, $content);
}

echo "Models created.\n";
