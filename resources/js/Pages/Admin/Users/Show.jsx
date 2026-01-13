// FILE: resources/js/Pages/Admin/Users/Show.jsx

import AdminLayout from '@/Layouts/AdminLayout'; // Or StaffLayout depending on context
import { Head, Link } from '@inertiajs/react';
import { FaBuilding, FaCalendarCheck } from 'react-icons/fa';

export default function Show({ auth, profileUser }) {
    // Determine which layout to use based on the logged-in user's role
    const Layout = auth.user.role === 'admin' ? AdminLayout : null; // Add StaffLayout here later
    
    return (
        <Layout user={auth.user} header={`User Profile: ${profileUser.name}`}>
            <Head title={`Profile: ${profileUser.name}`} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-xl mb-4">{profileUser.name}</h3>
                    <p className="text-gray-600"><strong>Email:</strong> {profileUser.email}</p>
                    <p className="text-gray-600"><strong>Role:</strong> {profileUser.role}</p>
                    <p className="text-gray-600"><strong>Joined:</strong> {new Date(profileUser.created_at).toLocaleDateString()}</p>
                    {profileUser.role === 'landlord' && (
                        <p className="text-gray-600"><strong>Managed by Staff ID:</strong> {profileUser.staff_id || 'N/A'}</p>
                    )}
                </div>

                {/* Activity Feed */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-xl mb-4">User Activity</h3>
                    
                    {profileUser.role === 'landlord' && (
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2 flex items-center"><FaBuilding className="mr-2" /> Properties ({profileUser.properties.length})</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                                {profileUser.properties.map(p => <li key={p.id}>{p.title} - <span className={p.is_available ? 'text-green-600' : 'text-yellow-600'}>{p.is_available ? 'Available' : 'Occupied'}</span></li>)}
                            </ul>
                        </div>
                    )}
                    
                    {profileUser.role === 'tenant' && (
                         <div>
                            <h4 className="font-semibold text-gray-700 mb-2 flex items-center"><FaCalendarCheck className="mr-2" /> Bookings ({profileUser.bookings.length})</h4>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                                {profileUser.bookings.map(b => <li key={b.id}>{b.property.title} - <span className="font-semibold">{b.status}</span></li>)}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}