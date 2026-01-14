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
            'monnify_api_key' => config('services.monnify.api_key', env('MONNIFY_API_KEY')),
            'monnify_contract_code' => config('services.monnify.contract_code', env('MONNIFY_CONTRACT_CODE')),
        ]);
    }

    public function verify(Request $request)
    {
        $request->validate([
            'transactionReference' => 'required',
            'booking_id' => 'required|exists:bookings,id'
        ]);

        $booking = Booking::findOrFail($request->booking_id);
        
        // Use a standard status that exists in the enum if it's an enum
        // Based on previous logs, 'approved' works. Let's ensure 'paid' is supported or use 'approved' as fallback.
        try {
            $booking->update(['status' => 'paid']);
        } catch (\Exception $e) {
            Log::error('Failed to set status to paid, falling back to approved: ' . $e->getMessage());
            $booking->update(['status' => 'approved']);
        }
        
        $property = $booking->property;
        $paidCount = $property->bookings()->where('status', 'paid')->orWhere('status', 'approved')->count();
        if ($paidCount >= $property->accepted_tenants) {
            $property->update(['is_available' => false]);
        }

        return response()->json(['success' => true]);
    }

    public function webhook(Request $request)
    {
        $data = $request->all();
        Log::info('Monnify Webhook Received', ['payload' => $data]);
        
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