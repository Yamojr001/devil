<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('messages', function (Blueprint $table) {
            $table->id();

            // Foreign key for the user who sent the message
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade');

            // Foreign key for the user who will receive the message
            $table->foreignId('receiver_id')->constrained('users')->onDelete('cascade');

            // Optional: Link the message to a specific property to provide context
            $table->foreignId('property_id')->nullable()->constrained()->onDelete('set null');

            $table->text('message_text');
            $table->boolean('is_read')->default(false);
            
            // In Laravel, `timestamps()` automatically creates `created_at` and `updated_at`.
            // Here, we only need a single timestamp, so we'll use `timestamp()`
            $table->timestamp('sent_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
