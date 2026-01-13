<?php

namespace App\Http\Middleware;

use App\Providers\RouteServiceProvider;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * This middleware prevents users who are already logged in from accessing
     * guest pages like the login and register pages.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            // First, check if the user is authenticated for the current guard.
            if (Auth::guard($guard)->check()) {
                
                // --- THIS IS THE CRITICAL LOGIC UPGRADE ---
                // The user is authenticated, so we redirect them.
                // Instead of sending everyone to the same place, we can add logic here.
                // For our current application, both roles go to the same dashboard route,
                // and the React component handles showing the correct UI.
                // This structure allows for future expansion (e.g., redirecting admins to /admin).

                $user = Auth::user(); // Get the authenticated user

                if ($user->role === 'landlord') {
                    // Landlords go to the main dashboard.
                    return redirect()->route('dashboard');
                }
                
                if ($user->role === 'tenant') {
                    // Tenants also go to the main dashboard.
                    return redirect()->route('dashboard');
                }
                
                // A fallback for any other roles or if role is not set
                return redirect(RouteServiceProvider::HOME);
            }
        }

        // If the user is not authenticated, continue with the original request (let them see the login page).
        return $next($request);
    }
}