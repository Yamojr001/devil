<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class MonnifyPaymentController extends Controller
{
    public function show(Booking $booking)
    {
        $booking->load('property');
        return Inertia::render('Payments/Create', [
            'booking' => $booking,
            'monnify_api_key' => env('MONNIFY_API_KEY'),
            'monnify_contract_code' => env('MONNIFY_CONTRACT_CODE'),
        ]);
    }

    public function verify(Request $request)
    {
        $request->validate([
            'transactionReference' => 'required',
            'booking_id' => 'required|exists:bookings,id'
        ]);

        $booking = Booking::findOrFail($request->booking_id);
        
        // Update booking status
        $booking->update(['status' => 'paid']);
        
        // Mark property as unavailable if slots are full
        $property = $booking->property;
        $paidCount = $property->bookings()->where('status', 'paid')->count();
        if ($paidCount >= $property->accepted_tenants) {
            $property->update(['is_available' => false]);
        }

        return response()->json(['success' => true]);
    }

    public function webhook(Request $request)
    {
        $data = $request->all();
        Log::info('Monnify Webhook:', $data);
        
        if (isset($data['paymentReference']) && ($data['paymentStatus'] === 'PAID' || $data['paymentStatus'] === 'SUCCESS')) {
            $bookingId = $data['metaData']['booking_id'] ?? null;
            if ($bookingId) {
                $booking = Booking::find($bookingId);
                if ($booking) {
                    $booking->update(['status' => 'paid']);
                    $property = $booking->property;
                    $paidCount = $property->bookings()->where('status', 'paid')->count();
                    if ($paidCount >= $property->accepted_tenants) {
                        $property->update(['is_available' => false]);
                    }
                }
            }
        }

        return response()->json(['status' => 'success']);
    }
}