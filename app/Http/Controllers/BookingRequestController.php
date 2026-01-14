<?php
// FILE: app/Http/Controllers/BookingRequestController.php
// This is the complete, final, and corrected version for managing a landlord's requests.

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Notifications\BookingApproved;
use App\Mail\BookingApprovalMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingRequestController extends Controller
{
    /**
     * Display a listing of the booking requests for the landlord.
     */
    public function index(Request $request)
    {
        // --- THIS IS THE FOOLPROOF AUTHORIZATION FIX ---
        // We manually and explicitly check if the user is a landlord.
        // This bypasses the complex Policy system to fix the 403 error.
        if ($request->user()->role !== 'landlord') {
            abort(403, 'Unauthorized action.');
        }
        
        // If the check passes, the rest of the code runs.
        $landlord = $request->user();
        $status = $request->query('status', 'pending');

        $bookings = Booking::query()
            ->whereIn('property_id', $landlord->properties()->pluck('id'))
            ->when($status !== 'all', function ($query) use ($status) {
                return $query->where('status', $status);
            })
            ->with(['tenant', 'property.images', 'property.user'])
            ->latest()
            ->get();
        
        return Inertia::render('BookingRequests/Index', [
            'bookings' => $bookings,
            'filters' => ['status' => $status],
        ]);
    }

    /**
     * Update the status of a booking (Approve or Decline).
     */
    public function update(Request $request, Booking $booking)
    {
        if ($request->user()->id !== $booking->property->user_id) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'status' => 'required|string|in:approved,declined',
        ]);
        
        $booking->update([
            'status' => $validated['status'],
            'updated_at' => now(),
        ]);

        // Send email to tenant
        try {
            Mail::to($booking->tenant->email)->send(new BookingApprovalMail($booking));
        } catch (\Exception $e) {
            \Log::error("Booking approval email failed: " . $e->getMessage());
        }

        // If approved, send the notification to the tenant
        if ($validated['status'] === 'approved') {
            $booking->tenant->notify(new BookingApproved($booking));
        }

        return back()->with('success', 'Booking status updated successfully!');
    }
}