<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->date('dob')->nullable(); // Date of Birth
            $table->string('nationality')->nullable()->after('dob');
            $table->string('address_street')->nullable()->after('nationality');
            $table->string('address_city')->nullable()->after('address_street');
            $table->string('address_state')->nullable()->after('address_city');
            $table->string('address_country')->nullable()->after('address_state');
            $table->string('id_type')->nullable()->after('address_country'); // e.g., NIN, Passport
            $table->string('id_number')->nullable()->after('id_type');
            $table->string('id_document_path')->nullable()->after('id_number'); // Path to uploaded ID file
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'dob', 'nationality', 'address_street', 'address_city', 
                'address_state', 'address_country', 'id_type', 'id_number', 'id_document_path'
            ]);
        });
    }
};