<?php
// FILE: app/Http/Controllers/PropertyImageController.php

namespace App\Http\Controllers;

use App\Models\PropertyImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PropertyImageController extends Controller
{
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PropertyImage $propertyImage)
    {
        // Authorize that the user owns the property this image belongs to
        $this->authorize('update', $propertyImage->property);

        // Delete the physical file from storage
        Storage::disk('public')->delete($propertyImage->image_path);

        // Delete the record from the database
        $propertyImage->delete();

        // Return a success response
        return response()->noContent();
    }
}