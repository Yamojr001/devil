<?php
// FILE: app/Http-Controllers/PropertyController.php
// This is the complete, definitive version with all methods fully implemented.

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PropertyController extends Controller
{
    /**
     * Display a listing of all available resources for tenants and guests.
     */
    public function index()
    {
        $user = Auth::user();
        $properties = Property::where('is_available', true)
            ->with('images')
            ->withCount(['bookings' => fn($q) => $q->where('status', 'approved')])
            ->latest()
            ->get()
            ->map(function ($property) use ($user) {
                $property->is_favorited = $user ? $user->favorites()->where('property_id', $property->id)->exists() : false;
                return $property;
            });

        return Inertia::render('Properties/Index', [
            'properties' => $properties,
        ]);
    }

    /**
     * Show the form for creating a new property.
     */
    public function create()
    {
        $this->authorize('create', Property::class);
        return Inertia::render('Properties/Create');
    }

    /**
     * Store a newly created property in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Property::class);
        $validated = $request->validate([
            'title' => 'required|string|max:255', 'description' => 'required|string',
            'property_type' => 'required|string|in:Apartment,Bungalow,Duplex,Villa',
            'price' => 'required|numeric|min:1', 'price_period' => 'required|string|in:month,year',
            'bedrooms' => 'required|integer|min:1', 'bathrooms' => 'required|integer|min:1',
            'country' => 'required|string', 'state' => 'required|string', 'city' => 'required|string',
            'address' => 'nullable|string', 'amenities' => 'nullable|array',
            'accepted_tenants' => 'required|integer|min:1|max:100',
            'images' => 'required|array|min:1', 'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);
        $acceptedTenants = (int)$validated['accepted_tenants'];
        $buffer = 0;
        if ($acceptedTenants <= 5) $buffer = 1; elseif ($acceptedTenants <= 10) $buffer = 2; elseif ($acceptedTenants <= 15) $buffer = 3; else $buffer = 4;
        $possibleTenants = $acceptedTenants + $buffer;
        DB::beginTransaction();
        try {
            $amenities_str = !empty($validated['amenities']) ? implode(',', $validated['amenities']) : null;
            $propertyData = $validated;
            unset($propertyData['images']);
            $propertyData['amenities'] = $amenities_str;
            $propertyData['accepted_tenants'] = $acceptedTenants;
            $propertyData['possible_tenants'] = $possibleTenants;
            $property = $request->user()->properties()->create($propertyData);
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $imageFile) {
                    $path = $imageFile->store('properties', 'public');
                    $property->images()->create(['image_path' => $path]);
                }
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            dd("Error in store method: " . $e->getMessage());
        }
        return to_route('my-properties.index')->with('success', 'Property listed successfully!');
    }

    /**
     * Display the specified property (Single Property View Page).
     */
    public function show(Property $property)
    {
        $property->load(['images', 'user', 'reviews.user']);
        $isFavorited = Auth::check() ? Auth::user()->favorites()->where('property_id', $property->id)->exists() : false;
        return Inertia::render('Properties/Show', [
            'property' => $property,
            'isFavorited' => $isFavorited,
        ]);
    }

    /**
     * Show the form for editing the specified property.
     */
    public function edit(Property $property)
    {
        $this->authorize('update', $property);
        $property->load('images');
        return Inertia::render('Properties/Edit', [
            'property' => $property
        ]);
    }

    /**
     * Update the specified property in storage.
     */
    public function update(Request $request, Property $property)
    {
        $this->authorize('update', $property);
        $validated = $request->validate([
            'title' => 'required|string|max:255', 'description' => 'required|string',
            'property_type' => 'required|string|in:Apartment,Bungalow,Duplex,Villa',
            'price' => 'required|numeric|min:1', 'price_period' => 'required|string|in:month,year',
            'bedrooms' => 'required|integer|min:1', 'bathrooms' => 'required|integer|min:1',
            'country' => 'required|string', 'state' => 'required|string', 'city' => 'required|string',
            'address' => 'nullable|string', 'amenities' => 'nullable|array',
            'new_images' => 'nullable|array', 'new_images.*' => 'image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);
        DB::beginTransaction();
        try {
            $amenities_str = !empty($validated['amenities']) ? implode(',', $validated['amenities']) : null;
            $propertyData = $validated;
            unset($propertyData['new_images']);
            $propertyData['amenities'] = $amenities_str;
            $property->update($propertyData);
            if ($request->hasFile('new_images')) {
                foreach ($request->file('new_images') as $imageFile) {
                    $path = $imageFile->store('properties', 'public');
                    $property->images()->create(['image_path' => $path]);
                }
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            dd("Error in update method: " . $e->getMessage());
        }
        return to_route('properties.edit', $property->id)->with('success', 'Property updated successfully!');
    }

    /**
     * Remove the specified property from storage.
     */
    public function destroy(Property $property)
    {
        $this->authorize('delete', $property);
        foreach ($property->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }
        $property->delete();
        return to_route('my-properties.index')->with('success', 'Property deleted successfully!');
    }

    /**
     * Display a listing of the properties for the authenticated landlord.
     */
    public function myProperties(Request $request)
    {
        $this->authorize('viewAny', Property::class);
        $properties = $request->user()
            ->properties()
            ->with('images')
            ->withCount(['bookings' => fn($q) => $q->where('status', 'approved')])
            ->latest()
            ->get();
        return Inertia::render('Properties/MyProperties', [
            'properties' => $properties,
        ]);
    }
}