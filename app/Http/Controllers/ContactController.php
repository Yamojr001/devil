<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\LandlordRegistrationMail;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    /**
     * Display contact page
     */
    public function index()
    {
        return inertia('Contact');
    }

    /**
     * Handle contact form submission
     */
    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'required|string|max:500',
            'message' => 'nullable|string',
        ]);

        try {
            // Save to database
            $contact = Contact::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'message' => $validated['message'] ?? null,
                'type' => 'landlord_registration',
                'status' => 'new',
            ]);

            // Send email to yamojr001@gmail.com
            Mail::to('yamojr001@gmail.com')
                ->send(new LandlordRegistrationMail($validated));

            return redirect()->back()
                ->with('success', 'Thank you! Your registration has been submitted successfully. We will contact you within 24 hours.');

        } catch (\Exception $e) {
            Log::error('Contact form submission failed: ' . $e->getMessage());
            
            return redirect()->back()
                ->with('error', 'Something went wrong. Please try again later.')
                ->withInput();
        }
    }

    /**
     * Get all contact messages (for admin dashboard)
     */
    public function getAllMessages()
    {
        $messages = Contact::orderBy('created_at', 'desc')->paginate(10);
        
        return inertia('Admin/Contacts', [
            'messages' => $messages,
        ]);
    }

    /**
     * Update message status
     */
    public function updateStatus(Request $request, Contact $contact)
    {
        $request->validate([
            'status' => 'required|in:new,read,replied,archived'
        ]);

        $contact->update(['status' => $request->status]);

        return response()->json(['success' => true]);
    }
}
// // FILE: app/Http/Controllers/ContactController.php

// namespace App\Http\Controllers;

// use Illuminate\Http\Request;
// use Inertia\Inertia;

// class ContactController extends Controller
// {
//     /**
//      * Display the contact form.
//      */
//     public function index()
//     {
//         return Inertia::render('Contact/Index');
//     }

//     /**
//      * Store a new support ticket from the user.
//      */
//     public function store(Request $request)
//     {
//         $validated = $request->validate([
//             'subject' => 'required|string|max:255',
//             'message' => 'required|string|max:2000',
//         ]);

//         // Create a support ticket and associate it with the logged-in user
//         $request->user()->supportTickets()->create([
//             'subject' => $validated['subject'],
//             'message' => $validated['message'],
//         ]);

//         return to_route('contact.index')->with('success', 'Your message has been sent successfully! Our team will get back to you shortly.');
//     }
// }