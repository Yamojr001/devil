// FILE: resources/js/Pages/Properties/MyProperties.jsx
// This is the complete, final, and fully functional version.

import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { FaEdit, FaTrashAlt, FaPlus, FaUsers, FaQuestionCircle } from 'react-icons/fa';

// This is a dedicated, reusable component for the management card.
const PropertyManagementCard = ({ property }) => {
    // Determine the image URL. Use the first image if it exists, otherwise a placeholder.
    const imageUrl = property.images && property.images.length > 0 
        ? `/storage/${property.images[0].image_path}` 
        : `https://via.placeholder.com/400x300.png?text=No+Image`;
    
    // Calculate available booking slots from the data provided by the controller
    const availableSlots = property.possible_tenants - property.bookings_count;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transform hover:-translate-y-1 transition-transform duration-300">
            <div className="relative">
                <img 
                    src={imageUrl} 
                    alt={property.title} 
                    className="w-full h-48 object-cover" 
                />
                <span className={`absolute top-2 left-2 px-2 py-1 text-xs font-semibold rounded-full ${property.is_available ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {property.is_available ? 'Available' : 'Occupied'}
                </span>
            </div>
            <div className="p-4 flex-grow">
                <h3 className="font-bold text-lg text-gray-800 truncate">{property.title}</h3>
                <p className="text-sm text-gray-500">{property.city}, {property.state}</p>

                <div className="mt-2 flex items-center text-sm font-semibold text-blue-600">
                    <FaUsers className="mr-2" />
                    <span>{availableSlots > 0 ? availableSlots : 0} of {property.possible_tenants} Slots Free</span>
                </div>
            </div>
            <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
                <div className="text-gray-600 font-bold">
                    ${Number(property.price).toLocaleString()} <span className="font-normal text-sm">/ {property.price_period}</span>
                </div>
                <div className="flex space-x-3">
                    <Link href={route('properties.edit', property.id)} className="text-gray-400 hover:text-indigo-600" title="Edit">
                        <FaEdit />
                    </Link>
                    
                    {/* --- THIS IS THE NEW CONDITIONAL LOGIC --- */}
                    {property.is_available ? (
                        // If property IS available, show the direct Delete button
                        <Link 
                            href={route('properties.destroy', property.id)} 
                            method="delete" 
                            as="button" 
                            onBefore={() => confirm('Are you sure? This property is not rented and will be deleted immediately.')} 
                            className="text-gray-400 hover:text-red-600" 
                            title="Delete"
                        >
                            <FaTrashAlt />
                        </Link>
                    ) : (
                        // If property IS NOT available (rented), show the "Request Deletion" button
                        <Link 
                            href={route('properties.request-deletion', property.id)}
                            method="post"
                            as="button"
                            onBefore={() => confirm('This property is currently rented. Send a deletion request to your staff manager for approval?')}
                            className="text-gray-400 hover:text-yellow-600"
                            title="Request Deletion"
                        >
                            <FaQuestionCircle />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

// This is the main page component that uses the card above.
export default function MyProperties({ auth, properties }) {
    const { props } = usePage();
    const flash = props.flash || {};

    return (
        <SidebarLayout user={auth.user} header="My Properties">
            <Head title="My Properties" />

            {/* Display success messages (e.g., after creating/deleting or sending a request) */}
            {flash.success && (
                <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative" role="alert">
                    {flash.success}
                </div>
            )}
            
            {/* Display error messages */}
            {flash.error && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                    {flash.error}
                </div>
            )}
            
            {properties && properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {properties.map((property) => (
                        <PropertyManagementCard key={property.id} property={property} />
                    ))}
                </div>
            ) : (
                // Show a helpful message if there are no properties
                <div className="text-center bg-white p-12 rounded-lg shadow-sm">
                    <h3 className="text-xl font-bold text-gray-700">No Properties Found</h3>
                    <p className="text-gray-500 mt-2 mb-4">You haven't listed any properties yet. Let's add your first one!</p>
                    <Link 
                        href={route('properties.create')} 
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-500 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    >
                        <FaPlus className="mr-2" /> List a Property
                    </Link>
                </div>
            )}
        </SidebarLayout>
    );
}