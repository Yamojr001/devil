<?php
// FILE: database/seeders/DatabaseSeeder.php
// Corrected Namespace

namespace Database\Seeders; // <-- THIS IS THE CORRECT NAMESPACE

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            // You can add other seeders here later
        ]);
    }
}