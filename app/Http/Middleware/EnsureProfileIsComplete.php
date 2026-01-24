<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureProfileIsComplete
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->role === 'tenant') {
            $isComplete = $user->phone && 
                         $user->nin && 
                         $user->nationality && 
                         $user->address_city &&
                         $user->id_type;

            if (!$isComplete) {
                return redirect()->route('profile.edit')->with('error', 'Please complete your profile (Phone, NIN, Nationality, City, and ID Type) before booking a property.');
            }
        }

        return $next($request);
    }
}
