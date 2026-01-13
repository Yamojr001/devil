<?php
// FILE: app/Http/Controllers/SearchController.php
// This is the complete and final version of the controller for all search functionality.

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class SearchController extends Controller
{
    /**
     * Display the search page with initial properties.
     * This method loads the main React component.
     */
    public function index()
    {
        $user = Auth::user();

        // Fetch all available properties for the initial view, including their images
        // and whether the current user has favorited them.
        $initialProperties = Property::where('is_available', true)
            ->with('images')
            ->latest()
            ->get()
            ->map(function ($property) use ($user) {
                $property->is_favorited = $user ? $user->favorites()->where('property_id', $property->id)->exists() : false;
                return $property;
            });
            
        return Inertia::render('Search/Index', [
            'initialProperties' => $initialProperties
        ]);
    }

    /**
     * Handle the AJAX request for filtering/searching properties.
     * This is called by the React component every time a filter changes.
     */
    public function search(Request $request)
    {
        $user = $request->user();

        // Start with a base query for available properties
        $query = Property::query()->where('is_available', true);

        // Apply filters conditionally for clean and robust query building
        $query->when($request->keyword, function ($q, $keyword) {
            $q->where(function ($q2) use ($keyword) {
                $q2->where('title', 'like', "%{$keyword}%")
                   ->orWhere('city', 'like', "%{$keyword}%")
                   ->orWhere('state', 'like', "%{$keyword}%")
                   ->orWhere('country', 'like', "%{$keyword}%");
            });
        });

        $query->when($request->property_type, fn($q, $type) => $q->where('property_type', $type));
        $query->when($request->bedrooms, fn($q, $beds) => $q->where('bedrooms', '>=', $beds));
        $query->when($request->bathrooms, fn($q, $baths) => $q->where('bathrooms', '>=', $baths));
        $query->when($request->max_price, fn($q, $price) => $q->where('price', '<=', $price));
        
        $query->when($request->amenities, function($q, $amenities) {
            // Ensure amenities is an array before looping
            if (is_array($amenities)) {
                foreach ($amenities as $amenity) {
                    // This assumes amenities are stored as a comma-separated string in the DB
                    $q->where('amenities', 'like', "%{$amenity}%");
                }
            }
        });

        // Handle sorting options
        $sortBy = $request->sort_by ?? 'newest';
        if ($sortBy === 'price_asc') {
            $query->orderBy('price', 'asc');
        } else if ($sortBy === 'price_desc') {
            $query->orderBy('price', 'desc');
        } else {
            $query->latest(); // Default sort by newest
        }

        // Eager load images and execute the final query
        $properties = $query->with('images')->get()->map(function ($property) use ($user) {
            $property->is_favorited = $user->favorites()->where('property_id', $property->id)->exists();
            return $property;
        });

        // Return the results as a JSON response for the React component to consume
        return response()->json([
            'count' => $properties->count(),
            'properties' => $properties,
        ]);
    }

    /**
     * Handle the AJAX request for location suggestions for the search bar.
     */
    public function locations(Request $request)
    {
        $query = $request->input('query', '');
        $locations = [];

        if (strlen($query) > 1) {
            $search = "%{$query}%";
            // Use UNION to efficiently get unique cities, states, and countries
            $cities = Property::select('city as name')->where('city', 'like', $search)->distinct()->limit(3);
            $states = Property::select('state as name')->where('state', 'like', $search)->distinct()->limit(3);
            $countries = Property::select('country as name')->where('country', 'like', $search)->distinct()->limit(3)->union($states)->union($cities)->get();
            $locations = $countries;
        }

        return response()->json($locations);
    }
}