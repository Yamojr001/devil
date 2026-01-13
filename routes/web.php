<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\PropertyImageController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\BookingRequestController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Staff\StaffDashboardController;
use App\Http\Controllers\Staff\LandlordController as StaffLandlordController;
use App\Http\Controllers\DeletionRequestController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// --- Public Welcome Route ---
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// --- Public Contact Routes ---
Route::get('/contact', [ContactController::class, 'index'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.submit');

// --- Main Authenticated User Routes (for Tenants and Landlords) ---
Route::middleware(['auth', 'verified'])->group(function () {
    
    // -- Main Dashboard (for Tenant and Landlord roles) --
    Route::get('/dashboard', function (Request $request) {
        $user = $request->user();
        $summaryData = [];
        if ($user->role === 'landlord') {
            $summaryData['total_properties'] = $user->properties()->count();
            $summaryData['active_listings'] = $user->properties()->where('is_available', true)->count();
            $summaryData['pending_requests'] = \App\Models\Booking::whereIn('property_id', $user->properties()->pluck('id'))->where('status', 'pending')->count();
        } else { // 'tenant' role
            $summaryData['booking_count'] = $user->bookings()->where('status', 'approved')->count();
            $summaryData['favorite_count'] = $user->favorites()->count();
        }
        return Inertia::render('Dashboard', ['summaryData' => $summaryData]);
    })->name('dashboard');

    // -- User Profile Routes --
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // -- Properties (Main Resource Controller) --
    Route::resource('properties', PropertyController::class)
        ->only(['index', 'show', 'create', 'store', 'edit', 'update', 'destroy']);

    // -- Landlord-Specific Routes --
    Route::get('/my-properties', [PropertyController::class, 'myProperties'])->name('my-properties.index');
    Route::get('/booking-requests', [BookingRequestController::class, 'index'])->name('booking-requests.index');
    Route::patch('/booking-requests/{booking}', [BookingRequestController::class, 'update'])->name('booking-requests.update');
    Route::post('/properties/{property}/request-deletion', [DeletionRequestController::class, 'store'])
         ->name('properties.request-deletion');

    // -- Tenant-Specific Routes --
    Route::get('/my-bookings', [BookingController::class, 'index'])->name('my-bookings.index');
    Route::get('/bookings/{property}/create', [BookingController::class, 'create'])->name('bookings.create');
    Route::post('/bookings/{property}', [BookingController::class, 'store'])->name('bookings.store');
    Route::get('/my-favorites', [FavoriteController::class, 'index'])->name('my-favorites.index');
    Route::get('/search', [SearchController::class, 'index'])->name('search.index');
    
    // -- Functionality Routes (used by multiple roles) --
    Route::delete('/property-images/{propertyImage}', [PropertyImageController::class, 'destroy'])->name('properties.images.destroy');
    Route::post('/favorites/{property}/toggle', [FavoriteController::class, 'toggle'])->name('favorites.toggle');
    
    // -- General Support & Messages Routes --
    Route::get('/messages', [MessageController::class, 'index'])->name('messages.index');
    Route::get('/contact-support', [ContactController::class, 'index'])->name('contact.index');
    Route::post('/contact-support', [ContactController::class, 'store'])->name('contact.store');
});

// --- ADMIN-ONLY ROUTES ---
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::resource('users', AdminUserController::class)->only(['index', 'show', 'edit', 'update', 'destroy']);
    Route::get('/contacts', [ContactController::class, 'getAllMessages'])->name('contacts.index');
    Route::patch('/contacts/{contact}/status', [ContactController::class, 'updateStatus'])->name('contacts.update-status');
    Route::get('/support-tickets', function() { 
        return Inertia::render('Admin/SupportTickets'); 
    })->name('tickets.index');
});

// --- STAFF-ONLY ROUTES ---
Route::middleware(['auth', 'verified', 'staff'])->prefix('staff')->name('staff.')->group(function () {
    Route::get('/dashboard', [StaffDashboardController::class, 'index'])->name('dashboard');
    Route::resource('landlords', StaffLandlordController::class)->only(['index', 'create', 'store', 'show', 'edit', 'update']);
    Route::get('/contact-submissions', function() {
        $contacts = \App\Models\Contact::where('type', 'landlord_registration')
                    ->orderBy('created_at', 'desc')
                    ->paginate(10);
        
        return Inertia::render('Staff/ContactSubmissions', [
            'contacts' => $contacts
        ]);
    })->name('contacts.index');
});

require __DIR__.'/auth.php';