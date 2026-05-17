<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$token = App\Models\User::where('role', 'admin')->first()->createToken('test')->plainTextToken;
$ch = curl_init('http://localhost:8000/api/users');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json',
    'Authorization: Bearer ' . $token,
]);
$response = curl_exec($ch);
$info = curl_getinfo($ch);
echo "HTTP " . $info['http_code'] . "\n";
echo substr($response, 0, 500) . "\n";
