// FILE: resources/js/Components/PropertyCard.jsx
// This is the complete version with the corrected "Slots Available" display.

import { Link, router } from '@inertiajs/react';
import { FaBed, FaBath, FaMapMarkerAlt, FaStar, FaUsers } from 'react-icons/fa';
import { useState } from 'react';

export default function PropertyCard({ property, user }) {
    const [isFavorited, setIsFavorited] = useState(property.is_favorited);
    const imageUrl = property.images && property.images.length > 0
        ? `/${property.images[0].image_path}`
        : `https://via.placeholder.com/400x300.png?text=No+Image`;
        
    const handleFavorite = (e) => {
        e.preventDefault(); e.stopPropagation();
        setIsFavorited(!isFavorited);
        router.post(route('favorites.toggle', property.id), {}, { preserveScroll: true });
    };

    // Correctly calculate available slots from the data provided by the controller
    const approvedBookings = property.bookings_count;
    const availableSlots = property.possible_tenants - approvedBookings;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 group flex flex-col">
            <div className="relative">
                <Link href={route('properties.show', property.id)}>
                    <img src={imageUrl} alt={property.title} className="w-full h-56 object-cover" />
                </Link>
                {user && user.role === 'tenant' && (
                    <button onClick={handleFavorite} className="absolute top-3 right-3 bg-white rounded-full p-2 leading-none z-10 opacity-75 group-hover:opacity-100 transition-opacity" title={isFavorited ? "Remove from favorites" : "Add to favorites"}>
                        <FaStar className={`text-xl ${isFavorited ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`} />
                    </button>
                )}
            </div>
            <div className="p-4 flex-grow">
                <h3 className="font-bold text-lg text-gray-800 truncate">
                    <Link href={route('properties.show', property.id)} className="hover:text-blue-600">{property.title}</Link>
                </h3>
                <p className="text-sm text-gray-500 flex items-center mt-1"><FaMapMarkerAlt className="mr-2" />{property.city}, {property.state}</p>
                
                <div className={`mt-2 flex items-center text-sm font-semibold ${availableSlots > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <FaUsers className="mr-2" />
                    <span>{availableSlots > 0 ? `${availableSlots} Booking Slot(s) Left!` : 'All Booking Slots Full'}</span>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                    <p className="text-lg font-extrabold text-blue-600">${Number(property.price).toLocaleString()}
                        <span className="text-xs font-normal text-gray-500"> / {property.price_period}</span>
                    </p>
                    <div className="flex space-x-4 text-sm text-gray-600">
                        <span className="flex items-center"><FaBed className="mr-1" /> {property.bedrooms}</span>
                        <span className="flex items-center"><FaBath className="mr-1" /> {property.bathrooms}</span>
                    </div>
                </div>
            </div>
            <div className="p-4 bg-gray-50 border-t">
                {user && user.role === 'tenant' ? (
                    <div className="flex space-x-2">
                        <Link href={route('bookings.create', property.id)} className="flex-1 text-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-500 transition-colors">
                            Book Now
                        </Link>
                        {/* We will build the messages page link later */}
                        <Link href={`/messages?user_id=${property.user_id}`} className="flex-1 text-center px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 transition-colors">
                            Contact
                        </Link>
                    </div>
                ) : (
                    <Link href={route('properties.show', property.id)} className="w-full block text-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                        View Details
                    </Link>
                )}
            </div>
        </div>
    );
}