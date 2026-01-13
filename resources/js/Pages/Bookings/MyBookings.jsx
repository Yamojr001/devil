// FILE: resources/js/Pages/Bookings/MyBookings.jsx
// This is the complete and final version with countdown timer.

import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, Link } from '@inertiajs/react';
import { FaEye, FaCreditCard } from 'react-icons/fa';
import { useState, useEffect } from 'react';

// --- A New, Reusable Countdown Timer Component ---
const CountdownTimer = ({ expiryDate }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(expiryDate) - +new Date();
        let timeLeft = {};
        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    const timerComponents = Object.entries(timeLeft).map(([interval, value]) => (
        <div key={interval} className="text-center">
            <div className="text-2xl font-bold text-gray-800">{String(value).padStart(2, '0')}</div>
            <div className="text-xs uppercase text-gray-500">{interval}</div>
        </div>
    ));

    return (
        <div className="flex space-x-4 justify-center">
            {timerComponents.length ? timerComponents : <span className="text-red-500 font-bold text-lg">Offer Expired</span>}
        </div>
    );
};

const getStatusBadgeColor = (status) => {
    switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'approved': return 'bg-green-100 text-green-800';
        case 'declined': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const BookingCard = ({ booking }) => {
    const imageUrl = booking.property.images && booking.property.images.length > 0
        ? `/storage/${booking.property.images[0].image_path}`
        : `https://via.placeholder.com/400x300.png?text=No+Image`;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
                <div className="md:w-1/3"><img src={imageUrl} alt={booking.property.title} className="w-full h-48 md:h-full object-cover" /></div>
                <div className="p-6 md:w-2/3 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-xl text-gray-800">{booking.property.title}</h3>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(booking.status)}`}>{booking.status}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{booking.property.city}, {booking.property.state}</p>
                    </div>
                    
                    {booking.status === 'approved' && booking.expires_at && (
                        <div className="my-4 p-4 bg-blue-50 rounded-lg text-center">
                            <h4 className="font-bold text-blue-800">Payment Required to Secure</h4>
                            <p className="text-xs text-blue-700 mb-2">This offer will expire in:</p>
                            <CountdownTimer expiryDate={booking.expires_at} />
                        </div>
                    )}

                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                        <p className="text-sm text-gray-500">Requested: {new Date(booking.created_at).toLocaleDateString()}</p>
                        <div className="flex space-x-2">
                            <Link href={route('properties.show', booking.property.id)} className="flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                                <FaEye className="mr-2" /> View
                            </Link>
                            {booking.status === 'approved' && (
                                <Link href="#" className="flex items-center px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-500">
                                    <FaCreditCard className="mr-2" /> Proceed to Payment
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function MyBookings({ auth, bookings }) {
    return (
        <SidebarLayout user={auth.user} header="My Bookings">
            <Head title="My Bookings" />
            {bookings && bookings.length > 0 ? (
                <div className="space-y-6">
                    {bookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)}
                </div>
            ) : (
                <div className="text-center bg-white p-12 rounded-lg shadow-sm">
                    <h3 className="text-xl font-bold text-gray-700">You have no bookings yet.</h3>
                    <p className="text-gray-500 mt-2 mb-4">When you request to rent a property, its status will appear here.</p>
                    <Link href={route('properties.index')} className="inline-flex items-center px-4 py-2 bg-orange-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-orange-600">
                        Browse Properties
                    </Link>
                </div>
            )}
        </SidebarLayout>
    );
}