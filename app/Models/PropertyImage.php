<?php
// FILE: app/Models/PropertyImage.php
// FINAL AND CORRECTED VERSION

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PropertyImage extends Model
{
    use HasFactory;

    /**
     * -----------------------------------------------------------------
     *  THIS IS THE CRITICAL FIX
     * -----------------------------------------------------------------
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'image_path',
        // We don't need 'property_id' here because Laravel handles it
        // automatically when we use the relationship create() method.
    ];

    /**
     * Indicates if the model should be timestamped.
     * Our property_images table does not have created_at/updated_at columns.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Get the property that this image belongs to.
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }
}