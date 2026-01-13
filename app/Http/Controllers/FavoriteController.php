<?php
// FILE: app/Http/Controllers/FavoriteController.php
// This is the complete and final version.

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FavoriteController extends Controller
{
    /**
     * Display a listing of the user's favorited properties.
     */
    public function index(Request $request)
    {
        // Security check: Only tenants can have a favorites page
        if ($request->user()->role !== 'tenant') {
            abort(403, 'Unauthorized action.');
        }

        // Get the user's favorited properties.
        // The `favorites()` method is the BelongsToMany relationship on the User model.
        // We also eager load the images for display.
        $favoritedProperties = $request->user()
            ->favorites()
            ->with('images')
            ->get()
            ->map(function ($property) {
                // We manually add is_favorited = true so the star icon is solid
                $property->is_favorited = true;
                return $property;
            });

        return Inertia::render('Favorites/Index', [
            'properties' => $favoritedProperties,
        ]);
    }

    /**
     * Attach or detach a property from the user's favorites.
     */
    public function toggle(Property $property, Request $request)
    {
        if (!$request->user() || $request->user()->role !== 'tenant') {
            abort(403, 'Unauthorized action.');
        }

        // The toggle method is perfect for BelongsToMany relationships
        $request->user()->favorites()->toggle($property->id);

        return back();
    }
}