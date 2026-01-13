<?php
// FILE: app/Http/Controllers/DeletionRequestController.php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;

class DeletionRequestController extends Controller
{
    /**
     * Store a new deletion request from a landlord.
     */
    public function store(Property $property, Request $request)
    {
        $landlord = $request->user();

        // Security check: user must be a landlord and own the property
        if ($landlord->role !== 'landlord' || $landlord->id !== $property->user_id) {
            abort(403);
        }
        
        // Security check: cannot request deletion for a property that is already available
        if ($property->is_available) {
            return back()->withErrors(['form' => 'You can delete available properties directly.']);
        }

        // Find the staff member assigned to this landlord
        $staff = $landlord->staff;
        if (!$staff) {
            return back()->withErrors(['form' => 'You are not assigned to a staff member. Please contact support.']);
        }

        // Create the deletion request
        $property->deletionRequests()->create([
            'user_id' => $landlord->id,
            'staff_id' => $staff->id,
            'status' => 'pending',
            // 'reason' => $request->input('reason') // We can add a reason field later
        ]);

        return back()->with('success', 'Deletion request sent to your staff manager for approval.');
    }
}