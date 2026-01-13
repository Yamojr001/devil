<?php
// FILE: app/Http/Controllers/BookingController.php
// This is the complete, final, and fully functional version.

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\Booking;
use App\Mail\BookingMail;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;

class BookingController extends Controller
{
    /**
     * Display a listing of the tenant's bookings.
     */
    public function index(Request $request)
    {
        // Security check for tenants
        if ($request->user()->role !== 'tenant') {
            abort(403, 'Unauthorized action.');
        }

        // Fetch bookings and add the 'expires_at' attribute for approved ones
        $bookings = $request->user()->bookings()
            ->with(['property.images'])
            ->latest()
            ->get()
            ->map(function ($booking) {
                if ($booking->status === 'approved') {
                    $booking->expires_at = $booking->updated_at->addDays(2)->toIso8601String();
                }
                return $booking;
            });
        
        return Inertia::render('Bookings/MyBookings', [
            'bookings' => $bookings,
        ]);
    }

    /**
     * Show the form for creating a new booking (the confirmation page).
     */
    public function create(Property $property, Request $request)
    {
        $this->authorize('create', Booking::class);

        // Security checks
        if (!$property->is_available) {
             return redirect()->route('properties.show', $property)->withErrors(['form' => 'This property is not currently available.']);
        }
        $existingBooking = $request->user()->bookings()
            ->where('property_id', $property->id)
            ->whereIn('status', ['pending', 'approved'])
            ->exists();

        // Eager load the necessary data
        $property->load(['images', 'user']);

        return Inertia::render('Bookings/Create', [
            'property' => $property,
            'hasExistingBooking' => $existingBooking,
        ]);
    }

    public function store(Property $property, Request $request)
    {
        // Authorize that only tenants can perform this action
        $this->authorize('create', Booking::class);

        // Validate the incoming message
        $request->validate([
            'message' => 'nullable|string|max:2000',
        ]);
        
        // Final security check to prevent duplicate requests
        $existingBooking = $request->user()->bookings()
            ->where('property_id', $property->id)
            ->whereIn('status', ['pending', 'approved'])
            ->exists();

        if ($existingBooking) {
            return to_route('my-bookings.index')->withErrors(['form' => 'You have already sent a request for this property.']);
        }

        // Create the booking in the database
        $booking = $request->user()->bookings()->create([
            'property_id' => $property->id,
            'message' => $request->input('message'),
            'status' => 'pending', // All new requests start as 'pending'
        ]);

        // Send emails
        try {
            Mail::to($request->user()->email)->send(new BookingMail($booking));
            Mail::to($property->user->email)->send(new BookingMail($booking));
        } catch (\Exception $e) {
            \Log::error("Email sending failed: " . $e->getMessage());
        }

        // Redirect the tenant to their "My Bookings" page with a success message
        return to_route('my-bookings.index')->with('success', 'Booking request sent successfully! The landlord has been notified.');
    }
}