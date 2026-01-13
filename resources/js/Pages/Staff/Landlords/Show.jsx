// FILE: resources/js/Pages/Staff/Landlords/Show.jsx
// This is the complete and final component for viewing a landlord's details from the staff panel.

import StaffLayout from '@/Layouts/StaffLayout';
import { Head, Link } from '@inertiajs/react';
import { FaBuilding, FaInfoCircle, FaArrowLeft } from 'react-icons/fa';

export default function Show({ auth, landlord }) {
    // 'landlord' is the prop passed from the LandlordController@show method
    
    return (
        <StaffLayout user={auth.user} header={`Landlord Profile`}>
            <Head title={`Landlord: ${landlord.name}`} />

            <div className="mb-4">
                <Link href={route('staff.landlords.index')} className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                    <FaArrowLeft className="mr-2" />
                    Back to My Landlords
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* --- Profile Card --- */}
                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md self-start">
                    <div className="flex items-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-gray-200 mr-4"></div>
                        <div>
                            <h3 className="font-bold text-xl text-gray-800">{landlord.name}</h3>
                            <p className="text-sm text-gray-500">Landlord</p>
                        </div>
                    </div>
                    <hr />
                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                        <p><strong>Email:</strong> {landlord.email}</p>
                        <p><strong>Phone:</strong> {landlord.phone || 'Not Provided'}</p>
                        <p><strong>Joined:</strong> {new Date(landlord.created_at).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* --- Activity Feed / Properties --- */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-xl mb-4 flex items-center">
                        <FaBuilding className="mr-2 text-gray-500" />
                        Properties ({landlord.properties.length})
                    </h3>
                    
                    <div className="space-y-4">
                        {landlord.properties && landlord.properties.length > 0 ? (
                            landlord.properties.map(property => (
                                <div key={property.id} className="p-4 border rounded-md flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-gray-800">{property.title}</p>
                                        <p className="text-sm text-gray-500">{property.city}, {property.state}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${property.is_available ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {property.is_available ? 'Available' : 'Occupied'}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">This landlord has not listed any properties yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}