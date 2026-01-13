<?php
// FILE: database/seeders/UserSeeder.php
// This file defines the actual user data to be created.

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * This method is executed when you run `php artisan db:seed`.
     */    public function run(): void
    {
        // We will create three distinct users with different roles.
        // The password for ALL of them will be 'password'.

        // --- Create a Tenant User ---
        User::create([
            'name' => 'Jamilu Tenant',
            'email' => 'tenant@test.com',
            'role' => 'tenant',
            'password' => Hash::make('password'),
        ]);

        // --- Create a Landlord User ---
        User::create([
            'name' => 'Jamilu Landlord',
            'email' => 'landlord@test.com',
            'role' => 'landlord',
            'password' => Hash::make('password'),
        ]);

        // --- Create an Admin User ---
        User::create([
            'name' => 'Jamilu Admin',
            'email' => 'admin@test.com',
            'role' => 'admin',
            'password' => Hash::make('password'),
        ]);
        user::create([
            'name' => 'Jamilu Staff',
            'email' => 'staff@test.com',
            'role' => 'staff',
            'password' => Hash::make('password'),
        ]);
    }
}