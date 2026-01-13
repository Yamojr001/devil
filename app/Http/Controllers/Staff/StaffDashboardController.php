<?php
// FILE: app/Http/Controllers/Staff/StaffDashboardController.php
// This is the complete and final version with the corrected class name.

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StaffDashboardController extends Controller
{
    /**
     * Display the dashboard for a staff member.
     */
    public function index(Request $request)
    {
        $staff = $request->user();
        
        $managedLandlordIds = User::where('staff_id', $staff->id)->pluck('id');

        $stats = [
            'managed_landlords' => $managedLandlordIds->count(),
            'total_properties' => Property::whereIn('user_id', $managedLandlordIds)->count(),
            'active_properties' => Property::whereIn('user_id', $managedLandlordIds)->where('is_available', true)->count(),
        ];

        return Inertia::render('Staff/Dashboard', [
            'stats' => $stats
        ]);
    }
}