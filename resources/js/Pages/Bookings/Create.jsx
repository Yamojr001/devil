// FILE: resources/js/Pages/Bookings/Create.jsx
// This is the final version with the full property details section included.

import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { FaBed, FaBath, FaMapMarkerAlt, FaCheck, FaBuilding, FaDollarSign } from 'react-icons/fa';

// A small, reusable component for displaying property stats
const DetailItem = ({ icon, label, value }) => (
    <div className="bg-gray-50 p-3 rounded-lg flex items-center">
        <div className="text-gray-500 mr-3">{icon}</div>
        <div>
            <div className="text-xs text-gray-400 font-bold uppercase">{label}</div>
            <div className="text-sm font-semibold text-gray-800">{value}</div>
        </div>
    </div>
);


export default function Create({ auth, property, hasExistingBooking }) {
    const { data, setData, post, processing, errors } = useForm({
        message: '',
    });
    const { props } = usePage();
    const flash = props.flash || {};

    const imageUrl = property.images && property.images.length > 0
        ? `/storage/${property.images[0].image_path}`
        : `https://via.placeholder.com/400x300.png?text=No+Image`;

    const amenities = property.amenities ? property.amenities.split(',') : [];
    
    const submit = (e) => {
        e.preventDefault();
        post(route('bookings.store', property.id));
    };

    return (
        <SidebarLayout user={auth.user} header="Request to Book">
            <Head title={`Booking Request: ${property.title}`} />
            
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Property Info */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Confirm Your Booking Request</h2>
                        <p className="text-gray-500">You are requesting to book the following property.</p>
                    </div>

                    {/* --- MAIN PROPERTY CARD --- */}
                    <div className="bg-white rounded-lg shadow-md flex space-x-4 p-4">
                        <img src={imageUrl} alt={property.title} className="w-32 h-24 object-cover rounded-md" />
                        <div>
                            <h3 className="font-bold text-lg">{property.title}</h3>
                            <p className="text-sm text-gray-500 flex items-center mt-1"><FaMapMarkerAlt className="mr-1" /> {property.city}, {property.state}</p>
                            <p className="text-lg font-bold text-blue-600 mt-1">${Number(property.price).toLocaleString()} <span className="text-sm font-normal">/ {property.price_period}</span></p>
                        </div>
                    </div>
                    
                    {/* --- NEW, FULL HOUSE DETAILS SECTION --- */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h4 className="font-semibold text-gray-700 mb-3">Property Details</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <DetailItem icon={<FaBed />} label="Bedrooms" value={property.bedrooms} />
                            <DetailItem icon={<FaBath />} label="Bathrooms" value={property.bathrooms} />
                            <DetailItem icon={<FaBuilding />} label="Type" value={property.property_type} />
                            <DetailItem icon={<FaDollarSign />} label="Price" value={`$${Number(property.price).toLocaleString()}`} />
                        </div>
                        <div className="mt-3">
                            <p className="text-xs text-gray-400 font-bold uppercase">Full Address</p>
                            <p className="text-sm text-gray-800">{property.address}, {property.city}, {property.state}, {property.country}</p>
                        </div>
                        <hr className="my-3" />
                        <h4 className="font-semibold text-gray-700 mb-2">Amenities</h4>
                        <div className="grid grid-cols-2 gap-1">
                            {amenities.map(amenity => (
                                <div key={amenity} className="flex items-center text-sm text-gray-700">
                                    <FaCheck className="text-green-500 mr-2 text-xs" /> {amenity}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* --- LANDLORD INFO CARD --- */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h4 className="font-semibold text-gray-700">Landlord Information</h4>
                        <div className="flex items-center mt-2">
                            <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                            <div>
                                <p className="font-bold">{property.user.name}</p>
                                <p className="text-sm text-gray-500">Member since {new Date(property.user.created_at).getFullYear()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Form */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <form onSubmit={submit}>
                        <h3 className="text-lg font-semibold text-gray-800">Your Request</h3>
                        
                        {flash.error && (<div className="mt-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">{flash.error}</div>)}
                        
                        <p className="mt-1 text-sm text-gray-600">A notification will be sent to the landlord. You can add an optional message below.</p>
                        
                        <div className="mt-4">
                            <InputLabel htmlFor="message" value="Message to Landlord (Optional)" />
                            <textarea id="message" name="message" value={data.message} onChange={(e) => setData('message', e.target.value)} rows="6" className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm" placeholder="Introduce yourself, ask questions, or suggest viewing times..."/>
                            <InputError message={errors.message} className="mt-2" />
                            <InputError message={errors.form} className="mt-2" />
                        </div>

                        <div className="mt-6 flex justify-end space-x-4">
                            <Link href={route('properties.show', property.id)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 self-center">
                                Cancel
                            </Link>
                            {hasExistingBooking ? (
                                <PrimaryButton disabled={true}>Request Already Sent</PrimaryButton>
                            ) : (
                                <PrimaryButton disabled={processing}>
                                    {processing ? 'Sending...' : 'Confirm & Send Request'}
                                </PrimaryButton>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </SidebarLayout>
    );
}