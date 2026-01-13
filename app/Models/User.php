<?php
// app/Models/User.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'staff_id',
        'phone',
        'nin',
        'dob',
        'nationality',
        'address_street',
        'address_city',
        'address_state',
        'address_country',
        'id_type',
        'id_number',
        'id_document_path', // Add this
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the properties for the user (as a landlord).
     */
    public function properties(): HasMany
    {
        return $this->hasMany(Property::class);
    }

    /**
     * Get the bookings for the user (as a tenant).
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class, 'tenant_id');
    }

    /**
     * The properties that the user has favorited.
     */
    public function favorites(): BelongsToMany
    {
        return $this->belongsToMany(Property::class, 'favorites', 'user_id', 'property_id');
    }

    /**
     * Get the messages sent by the user.
     */
    public function sentMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    /**
     * Get the support tickets submitted by the user.
     */
    public function supportTickets(): HasMany
    {
        return $this->hasMany(SupportTicket::class);
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(User::class, 'staff_id');
    }

    /**
     * Get the URL for the ID document.
     */
    public function getIdDocumentUrlAttribute()
    {
        return $this->id_document_path ? Storage::url($this->id_document_path) : null;
    }

    /**
     * Get user's full address.
     */
    public function getFullAddressAttribute()
    {
        $parts = array_filter([
            $this->address_street,
            $this->address_city,
            $this->address_state,
            $this->address_country,
        ]);

        return implode(', ', $parts);
    }
}