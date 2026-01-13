<?php
// FILE: routes/api.php
// This is the complete and final version with all necessary API routes.

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\MessageController; // <-- Add this import

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// This is a default Laravel route.
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// --- PROTECTED API ROUTES ---
// All routes inside this group will require the user to be authenticated via Sanctum.
Route::middleware('auth:sanctum')->group(function () {
    
    // --- Search API Routes ---
    Route::get('/properties/search', [SearchController::class, 'search'])
         ->name('api.properties.search');
    
    Route::get('/locations/search', [SearchController::class, 'locations'])
         ->name('api.locations.search');

    // --- THIS IS THE CRITICAL MISSING BLOCK ---
    // --- Messaging API Routes ---
    Route::get('/messages/{user}', [MessageController::class, 'show'])
         ->name('api.messages.show');

    Route::post('/messages/{user}', [MessageController::class, 'store'])
         ->name('api.messages.store');
    // --- END OF MISSING BLOCK ---
});