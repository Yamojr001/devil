<?php
// FILE: app/Http-Controllers/MessageController.php
// This is the complete, final, and definitive version.

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    /**
     * Display the main chat interface and conversation list.
     * This method now finds all users you have an existing or potential conversation with.
     */
    public function index()
    {
        $currentUser = Auth::user();

        // 1. Get user IDs from existing message conversations
        $usersFromMessages = Message::where('sender_id', $currentUser->id)
            ->select('receiver_id as id')
            ->union(
                Message::where('receiver_id', $currentUser->id)->select('sender_id as id')
            )
            ->pluck('id');

        // 2. Get user IDs from potential conversations (via bookings)
        if ($currentUser->role === 'tenant') {
            // A tenant can talk to landlords they have booked with
            $usersFromBookings = DB::table('bookings')
                ->join('properties', 'bookings.property_id', '=', 'properties.id')
                ->where('bookings.tenant_id', $currentUser->id)
                ->pluck('properties.user_id');

        } else { // 'landlord' or 'admin'
            // A landlord can talk to tenants who have booked their properties
            $usersFromBookings = DB::table('bookings')
                ->whereIn('property_id', $currentUser->properties()->pluck('id'))
                ->pluck('tenant_id');
        }

        // 3. Merge the two lists and get a final, unique list of user IDs to have conversations with
        $conversationPartnerIds = $usersFromMessages->merge($usersFromBookings)->unique();
        
        // 4. Fetch the user models for these partners
        $conversationPartners = User::whereIn('id', $conversationPartnerIds)->get();


        // 5. For each partner, get the last message to display in the conversation list
        $conversations = $conversationPartners->map(function ($partner) use ($currentUser) {
            $lastMessage = Message::where(function ($q) use ($currentUser, $partner) {
                $q->where('sender_id', $currentUser->id)->where('receiver_id', $partner->id);
            })->orWhere(function ($q) use ($currentUser, $partner) {
                $q->where('sender_id', $partner->id)->where('receiver_id', $currentUser->id);
            })->with('property:id,title')->latest('sent_at')->first();

            return [
                'other_user_id' => $partner->id,
                'other_user_name' => $partner->name,
                'last_message' => $lastMessage->message_text ?? 'A booking has been made. Click to start the conversation.',
                'sent_at' => $lastMessage->sent_at ?? $partner->created_at, // Use a fallback date
                'property_title' => $lastMessage->property->title ?? null,
            ];
        })
        ->sortByDesc('sent_at')
        ->values();

        return Inertia::render('Messages/Index', [
            'conversations' => $conversations,
        ]);
    }

    /**
     * API: Fetch all messages for a specific conversation.
     */
    public function show(User $user)
    {
        $currentUser = Auth::user();
        
        // Mark all messages from the other user as read
        Message::where('sender_id', $user->id)
               ->where('receiver_id', $currentUser->id)
               ->update(['is_read' => true]);

        // Fetch the full conversation history between the two users
        $messages = Message::where(function ($query) use ($currentUser, $user) {
            $query->where('sender_id', $currentUser->id)->where('receiver_id', $user->id);
        })->orWhere(function ($query) use ($currentUser, $user) {
            $query->where('sender_id', $user->id)->where('receiver_id', $currentUser->id);
        })
        ->orderBy('sent_at', 'asc')
        ->get();

        // Return a proper JSON array for the frontend
        return response()->json($messages->toArray());
    }

    /**
     * API: Store a new message.
     */
    public function store(Request $request, User $user)
    {
        $validated = $request->validate([
            'message_text' => 'required|string|max:2000',
            'property_id' => 'nullable|integer|exists:properties,id'
        ]);

        $message = Auth::user()->sentMessages()->create([
            'receiver_id' => $user->id,
            'property_id' => $validated['property_id'] ?? null,
            'message_text' => $validated['message_text'],
        ]);
        
        // Return the newly created message so the frontend can display it instantly
        return response()->json($message, 201);
    }
}