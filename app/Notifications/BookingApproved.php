<?php
// FILE: app/Notifications/BookingApproved.php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingApproved extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Booking $booking)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database']; // We will send via email AND save to the database
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $property = $this->booking->property;
        $url = route('my-bookings.index');

        return (new MailMessage)
                    ->subject('Congratulations! Your Booking Request Was Approved')
                    ->greeting('Hello ' . $notifiable->name . ',')
                    ->line('We have great news! Your booking request for the property "' . $property->title . '" has been approved by the landlord.')
                    ->line('You now have 3 days to complete the payment and secure your new home.')
                    ->action('View My Bookings & Pay Now', $url)
                    ->line('Thank you for using our platform!');
    }

    /**
     * Get the array representation of the notification for the database.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'Your booking for "' . $this->booking->property->title . '" has been approved!',
            'link' => route('my-bookings.index'),
        ];
    }
}