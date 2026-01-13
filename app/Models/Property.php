<?php
// FILE: app/Models/Property.php
// This version adds the missing 'user' relationship.

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo; // <-- Add this import
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\DeletionRequest;

class Property extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'description',
        'property_type',
        'price',
        'price_period',
        'bedrooms',
        'bathrooms',
        'country',
        'state',
        'city',
        'address',
        'amenities',
        'is_available',
    ];

    /**
     * -----------------------------------------------------------------
     *  THIS IS THE MISSING METHOD TO ADD
     * -----------------------------------------------------------------
     * Get the user (landlord) that owns the property.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get all images associated with the property.
     */
    public function images(): HasMany
    {
        return $this->hasMany(PropertyImage::class);
    }

    /**
     * Get all bookings for the property.
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

     public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
     public function deletionRequests(): HasMany
    {
        return $this->hasMany(DeletionRequest::class);
    }
    
}