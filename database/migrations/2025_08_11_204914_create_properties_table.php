<?php

// In database/migrations/YYYY_MM_DD_HHMMSS_create_properties_table.php

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
        Schema::create('properties', function (Blueprint $table) {
            $table->id(); // This creates an auto-incrementing, unsigned Big Integer primary key

            // Foreign key to the 'users' table (for the landlord)
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            $table->string('title');
            $table->text('description');
            $table->string('property_type');
            $table->string('country');
            $table->string('state');
            $table->string('city');
            $table->text('address')->nullable();
            
            $table->decimal('price', 12, 2);
            $table->enum('price_period', ['month', 'year'])->default('month');
            
            $table->unsignedTinyInteger('bedrooms')->default(1);
            $table->unsignedTinyInteger('bathrooms')->default(1);
            
            $table->text('amenities')->nullable();
            $table->boolean('is_available')->default(true);
            
            $table->timestamps(); // This automatically creates `created_at` and `updated_at` columns
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};