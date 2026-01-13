<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use App\Mail\LandlordRegistrationMail;

class TestMail extends Command
{
    protected $signature = 'mail:test {email}';
    protected $description = 'Send a test email to specified address';

    public function handle()
    {
        $email = $this->argument('email');
        
        $testData = [
            'name' => 'John Doe',
            'email' => 'test@example.com',
            'phone' => '+234 123 456 7890',
            'address' => '123 Test Street, Lagos',
            'message' => 'This is a test email from RentHouse system.'
        ];

        try {
            Mail::to($email)->send(new LandlordRegistrationMail($testData));
            $this->info("✅ Test email sent successfully to: {$email}");
            $this->info("📧 Email content:");
            $this->line("   Name: {$testData['name']}");
            $this->line("   Email: {$testData['email']}");
            $this->line("   Phone: {$testData['phone']}");
            $this->line("   Address: {$testData['address']}");
        } catch (\Exception $e) {
            $this->error("❌ Failed to send email: " . $e->getMessage());
            $this->line("Check your .env MAIL configuration.");
        }
        
        return Command::SUCCESS;
    }
}