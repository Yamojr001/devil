<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        
        Log::info('Profile edit accessed by user', [
            'user_id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ]);
        
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        Log::info('Profile update request received', [
            'user_id' => $request->user()->id,
            'request_data' => $request->all(),
            'has_file' => $request->hasFile('id_document') ? 'Yes' : 'No',
        ]);

        $user = $request->user();
        
        // Get validated data
        $validatedData = $request->validated();
        
        Log::info('Validated data', $validatedData);
        
        // Handle ID document upload
        if ($request->hasFile('id_document')) {
            $file = $request->file('id_document');
            Log::info('File details', [
                'name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime' => $file->getMimeType(),
            ]);
            
            // Delete old document if exists
            if ($user->id_document_path && Storage::exists($user->id_document_path)) {
                Storage::delete($user->id_document_path);
            }
            
            // Store new document
            $path = $file->store('id-documents', 'public');
            $user->id_document_path = $path;
            
            Log::info('File stored at', ['path' => $path]);
        }
        
        // Update user with validated data
        foreach ($validatedData as $key => $value) {
            if ($key !== 'id_document') { // Skip file field as we handled it separately
                if ($value === '' || $value === null) {
                    $user->$key = null;
                } else {
                    $user->$key = $value;
                }
            }
        }
        
        // Check if email was changed
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }
        
        // Save user
        $user->save();
        
        Log::info('User updated successfully', [
            'user_id' => $user->id,
            'changes' => $user->getChanges(),
        ]);
        
        return Redirect::route('profile.edit')
            ->with('status', 'Profile updated successfully!');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        // Delete ID document if exists
        if ($user->id_document_path && Storage::exists($user->id_document_path)) {
            Storage::delete($user->id_document_path);
        }

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}