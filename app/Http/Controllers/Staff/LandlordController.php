<?php
// FILE: app/Http/Controllers/Staff/LandlordController.php
// This is the complete and final version with the corrected query.

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class LandlordController extends Controller
{
    /**
     * Display a list of landlords managed by the current staff member.
     */
    public function index(Request $request)
    {
        $staff = $request->user();

        // --- THIS IS THE CORRECTED QUERY ---
        $landlords = User::query()
            // Condition 1: The user's role MUST be 'landlord'.
            ->where('role', 'landlord') 
            // Condition 2: Their 'staff_id' MUST match the current staff member's ID.
            ->where('staff_id', $staff->id) 
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Staff/Landlords/Index', [
            'landlords' => $landlords,
        ]);
    }

    /**
     * Show the form for creating a new landlord.
     */
    public function create()
    {
        return Inertia::render('Staff/Landlords/Create');
    }

    /**
     * Store a newly created landlord in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'landlord',
            'staff_id' => $request->user()->id,
        ]);

        return to_route('staff.landlords.index')->with('success', 'Landlord created and assigned successfully.');
    }
     public function show(User $landlord)
    {
        $this->authorize('view', $landlord);

        $landlord->load('properties.images');

        return Inertia::render('Staff/Landlords/Show', [
            'landlord' => $landlord,
        ]);
    }
}