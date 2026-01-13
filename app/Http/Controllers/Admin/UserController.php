<?php
// FILE: app/Http/Controllers/Admin/UserController.php
// This is the complete and final version.

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a paginated list of all users.
     */
    public function index(Request $request)
    {
        // Get filter and search values from the request URL
        $filters = $request->only(['search', 'role']);

        $users = User::query()
            // Apply search filter if a search term is present
            ->when($request->input('search'), function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
            })
            // Apply role filter if a role is selected
            ->when($request->input('role'), function ($query, $role) {
                $query->where('role', $role);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(15) // Paginate the results, showing 15 users per page
            ->withQueryString(); // Ensures filters are not lost when changing pages

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $filters, // Pass the current filters back to the view
        ]);
    }
      public function show(User $user)
    {
        // Eager load relationships based on the user's role for a complete view
        if ($user->role === 'landlord') {
            $user->load('properties.images');
        } elseif ($user->role === 'tenant') {
            $user->load('bookings.property');
        }

        return Inertia::render('Admin/Users/Show', [
            'profileUser' => $user
        ]);
    }
}