<?php
// FILE: app/Http/Middleware/HandleInertiaRequests.php
// This is the complete and final version with the Ziggy configuration.

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            // --- 2. THIS IS THE CRITICAL FIX ---
            // This merges all of Ziggy's route data into the props
            // that are sent to your React components on every request.
            'ziggy' => fn () => [
                ...(new Ziggy($request))->toArray(),
                'location' => $request->url(),
            ],
            // This is for displaying flash messages like 'success' or 'error'
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}