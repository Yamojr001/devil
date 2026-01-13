// FILE: resources/js/Pages/BookingRequests/Index.jsx
// This is the final, corrected, and fully functional version.

import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, router, usePage } from '@inertiajs/react';

// Helper for status badge colors
const getStatusBadgeColor = (status) => {
    switch (status) {
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'approved': return 'bg-green-100 text-green-800';
        case 'declined': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

export default function Index({ auth, bookings, filters }) {
    // Safely get flash messages
    const { props } = usePage();
    const flash = props.flash || {};

    const handleStatusUpdate = (bookingId, newStatus) => {
        if (!confirm(`Are you sure you want to ${newStatus} this request?`)) return;
        
        router.patch(route('booking-requests.update', bookingId), {
            status: newStatus,
        }, { preserveScroll: true });
    };
    
    const onFilterChange = (e) => {
        router.get(route('booking-requests.index'), { status: e.target.value }, {
            preserveState: true, replace: true,
        });
    };

    return (
        <SidebarLayout user={auth.user} header="Booking Requests">
            <Head title="Booking Requests" />

            {flash.success && (
                <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
                    {flash.success}
                </div>
            )}
            
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-800">Manage Incoming Requests</h3>
                    <div className="flex items-center space-x-2">
                        <label htmlFor="status" className="text-sm font-medium text-gray-700">Filter:</label>
                        <select
                            id="status"
                            name="status"
                            value={filters.status}
                            onChange={onFilterChange}
                            className="text-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="declined">Declined</option>
                            <option value="all">All</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tenant</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {bookings && bookings.length > 0 ? (
                                bookings.map((booking) => (
                                    <tr key={booking.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{booking.tenant?.name || 'N/A'}</div>
                                            <div className="text-xs text-gray-500">{booking.tenant?.email}</div>
                                            <div className="text-xs text-blue-600 cursor-pointer" onClick={() => alert(`User Details:\nName: ${booking.tenant.name}\nEmail: ${booking.tenant.email}`)}>View Details</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{booking.property?.title || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{new Date(booking.created_at).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {booking.status === 'pending' ? (
                                                <div className="flex space-x-2">
                                                    <button 
                                                        onClick={() => handleStatusUpdate(booking.id, 'approved')} 
                                                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button 
                                                        onClick={() => handleStatusUpdate(booking.id, 'declined')} 
                                                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                                    >
                                                        Decline
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                                    booking.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {booking.status}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-6 text-center text-gray-500">
                                        No bookings match the current filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </SidebarLayout>
    );
}