<?php
// FILE: app/Policies/UserPolicy.php
// This is the complete and final version.

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Perform pre-authorization checks.
     * Admins can do anything.
     */
    public function before(User $user, string $ability): bool|null
    {
        if ($user->role === 'admin') {
            return true;
        }
        return null; // Let other policy methods decide
    }

    /**
     * Determine whether the user can view the model.
     * This is for the detailed profile view.
     */
    public function view(User $currentUser, User $profileUser): bool
    {
        // A user can view their own profile.
        if ($currentUser->id === $profileUser->id) {
            return true;
        }

        // A staff member can view the profile of a landlord they manage.
        if ($currentUser->role === 'staff' && $profileUser->role === 'landlord') {
            return $profileUser->staff_id === $currentUser->id;
        }
        
        // Deny all other cases by default.
        return false;
    }
}