<?php

namespace App\Policies;

use App\Models\Property;
use App\Models\User;

class PropertyPolicy
{
    /**
     * Determine whether the user can view the list of their own properties.
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'landlord';
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->role === 'landlord';
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Property $property): bool
    {
        return $user->id === $property->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
     public function delete(User $user, Property $property): bool
    {
        return $user->id === $property->user_id && $property->is_available;
    }
}