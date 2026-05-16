<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$users = App\Models\User::all();
foreach ($users as $user) {
    try {
        $profile = $user->role === 'student'
            ? $user->student
            : ($user->role === 'teacher' ? $user->teacher : $user->schoolParent);
            
        $test = [
            'id'         => $user->id,
            'name'       => $user->name,
            'email'      => $user->email,
            'role'       => ucfirst($user->role),
            'created_at' => $user->created_at,
            'profile'    => $profile,
        ];
    } catch (\Exception $e) {
        echo "Error on User ID {$user->id}: " . $e->getMessage() . "\n";
    } catch (\Error $e) {
        echo "Error on User ID {$user->id}: " . $e->getMessage() . "\n";
    }
}
echo "Done\n";
