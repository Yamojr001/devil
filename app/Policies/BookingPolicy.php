<?php
// FILE: app/Policies/BookingPolicy.php
// This is the complete and corrected version of the policy.

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class BookingPolicy
{
    /**
     * -----------------------------------------------------------------
     *  THIS IS THE CORRECTED METHOD
     * -----------------------------------------------------------------
     * Determine whether the user can view the list of booking requests.
     */
    public function viewAny(User $user): bool
    {
        // Only landlords should be able to see the main list of booking requests.
        return $user->role === 'landlord';
    }

    /**
     * Determine whether the user can view a specific model.
     * (We are not using this yet, but it's good practice to have).
     */
    public function view(User $user, Booking $booking): bool
    {
        // A user can view a booking if they are the tenant who made it,
        // OR they are the landlord of the property being booked.
        return $user->id === $booking->tenant_id || $user->id === $booking->property->user_id;
    }

    /**
     * Determine whether the user can create models (send a request).
     */
    public function create(User $user): bool
    {
        // Only tenants can create new booking requests.
        return $user->role === 'tenant';
    }

    /**
     * Determine whether the user can update the model (approve/decline).
     */
    public function update(User $user, Booking $booking): bool
    {
        // Only the landlord who owns the property for the booking can update it.
        return $user->id === $booking->property->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     * (We are not using this yet).
     */
    public function delete(User $user, Booking $booking): bool
    {
        // For future use, e.g., only the landlord can delete.
        return $user->id === $booking->property->user_id;
    }
}