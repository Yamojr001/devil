// FILE: resources/js/Pages/Properties/Show.jsx

import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { FaBed, FaBath, FaMapMarkerAlt, FaCheck, FaStar } from 'react-icons/fa';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Show({ auth, property, isFavorited }) {
    const [mainImage, setMainImage] = useState(
        property.images && property.images.length > 0
            ? `/${property.images[0].image_path}`
            : 'https://via.placeholder.com/800x600.png?text=No+Image'
    );

    const amenities = property.amenities ? property.amenities.split(',') : [];

    const handleBookNow = () => {
        router.get(route('bookings.create', property.id));
    };

    return (
        <SidebarLayout user={auth.user} header={property.title}>
            <Head title={property.title} />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Image Gallery & Reviews */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Image Gallery */}
                        <div>
                            <img src={mainImage} alt="Main property view" className="w-full h-[500px] object-cover rounded-lg shadow-lg" />
                            <div className="mt-4 grid grid-cols-5 gap-2">
                                {property.images.map(image => (
                                    <img 
                                        key={image.id}
                                        src={`/${image.image_path}`} 
                                        alt="Property thumbnail" 
                                        className={`w-full h-24 object-cover rounded-md cursor-pointer border-2 ${mainImage === `/${image.image_path}` ? 'border-blue-500' : 'border-transparent'}`}
                                        onClick={() => setMainImage(`/${image.image_path}`)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Description & Amenities */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">About this property</h3>
                            <p className="text-gray-600 whitespace-pre-wrap">{property.description}</p>
                            <hr className="my-6" />
                            <h4 className="text-xl font-bold text-gray-800 mb-4">Amenities</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {amenities.map(amenity => (
                                    <div key={amenity} className="flex items-center text-gray-700">
                                        <FaCheck className="text-green-500 mr-2" /> {amenity}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                             <h3 className="text-2xl font-bold text-gray-800 mb-4">Reviews ({property.reviews.length})</h3>
                             {property.reviews.length > 0 ? (
                                <div className="space-y-6">
                                    {property.reviews.map(review => (
                                        <div key={review.id} className="flex space-x-4">
                                            {/* We will add reviewer profile pics later */}
                                            {/* <img src={review.user.profile_pic} ... /> */}
                                            <div>
                                                <div className="flex items-center">
                                                    <h4 className="font-bold">{review.user.name}</h4>
                                                    <div className="ml-4 flex items-center">
                                                        {[...Array(5)].map((_, i) => <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'} />)}
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 mt-1">{review.comment}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                             ) : <p className="text-gray-500">No reviews yet for this property.</p>}
                        </div>
                    </div>

                    {/* Right Column: Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
                             <p className="text-3xl font-extrabold text-blue-600">
                                ${Number(property.price).toLocaleString()}
                                <span className="text-base font-normal text-gray-500"> / {property.price_period}</span>
                            </p>
                            <div className="flex space-x-4 text-sm text-gray-600 mt-2 border-b pb-4">
                                <span className="flex items-center"><FaBed className="mr-1" /> {property.bedrooms} Bedrooms</span>
                                <span className="flex items-center"><FaBath className="mr-1" /> {property.bathrooms} Bathrooms</span>
                            </div>

                            <div className="mt-4">
                                <h4 className="font-bold text-gray-800">Landlord</h4>
                                <div className="flex items-center mt-2">
                                    {/* <img src={property.user.profile_pic} ... /> */}
                                    <div>
                                        <p className="font-semibold">{property.user.name}</p>
                                        <p className="text-sm text-gray-500">Member since {new Date(property.user.created_at).getFullYear()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 d-grid gap-2">
                                {/* Context-Aware Action Buttons */}
                                {auth.user && auth.user.id === property.user_id ? (
                                    <Link href={route('properties.edit', property.id)} className="w-full text-center py-2 px-4 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500">Edit Your Property</Link>
                                ) : (
                                    <PrimaryButton 
                                        onClick={handleBookNow}
                                        className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        Book Now
                                    </PrimaryButton>
                                )}
                                <button className={`w-full py-2 px-4 border rounded-lg font-semibold ${isFavorited ? 'bg-red-100 border-red-500 text-red-600' : 'border-gray-300'}`}>
                                    {isFavorited ? 'Favorited' : 'Add to Favorites'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}