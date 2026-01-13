<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the user is authenticated AND their role is 'admin'.
        if (! $request->user() || $request->user()->role !== 'admin') {
            // If not, abort with a 403 Forbidden error.
            abort(403, 'UNAUTHORIZED ACTION.');
        }

        // If they are an admin, allow the request to proceed.
        return $next($request);
    }
}