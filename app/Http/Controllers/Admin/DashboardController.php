<?php
// FILE: app/Http/Controllers/Admin/AdminDashboardController.php
// This is the complete and final version with the corrected name.

namespace App\Http\Controllers\Admin; // <-- The namespace is correct

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Property;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

// --- THIS IS THE CRITICAL CHANGE: The class name is unique ---
class DashboardController extends Controller
{
    /**
     * Display the dashboard for an administrator.
     */
    public function index()
    {
        $stats = [
            'total_users' => User::count(),
            'total_landlords' => User::where('role', 'landlord')->count(),
            'total_tenants' => User::where('role', 'tenant')->count(),
            'total_properties' => Property::count(),
            'total_bookings' => Booking::count(),
            'pending_bookings' => Booking::where('status', 'pending')->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats
        ]);
    }
}