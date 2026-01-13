<?php
// FILE: app/Models/Message.php
// This is the complete and final version with all necessary relationships.

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    use HasFactory;

    // The fields that can be filled from code
    protected $fillable = ['sender_id', 'receiver_id', 'property_id', 'message_text', 'is_read'];
    
    // We are using a custom 'sent_at' timestamp
    public $timestamps = false;
    
    // Tell Eloquent to treat 'sent_at' as a Carbon date object
    protected $dates = ['sent_at'];

    /**
     * Get the user who sent the message.
     */
    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
    
    /**
     * Get the user who received the message.
     */
    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }
    
    /**
     * Get the property this message is about.
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }
}