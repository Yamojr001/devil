// FILE: resources/js/Pages/Dashboard.jsx
// This is the complete, final, and corrected version.

import { Head } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { FaHome, FaCheckCircle, FaClock, FaCalendarAlt, FaHeart } from 'react-icons/fa';

// Reusable component for the summary cards
const SummaryCard = ({ title, value, icon, color }) => (
    <div className={`bg-white shadow-lg rounded-lg p-6 flex items-center justify-between text-${color}-500`}>
        <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`text-5xl opacity-20`}>{icon}</div>
    </div>
);

export default function Dashboard({ auth, summaryData }) {
    return (
        <SidebarLayout user={auth.user} header="Dashboard">
            <Head title="Dashboard" />
            <div className="space-y-6">
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800">Welcome back, {auth.user.name}!</h3>
                    <p className="text-gray-600">Here's a summary of your account activity.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {auth.user.role === 'landlord' && (
                        <>
                            <SummaryCard title="Total Properties" value={summaryData.total_properties ?? 0} icon={<FaHome />} color="blue" />
                            <SummaryCard title="Active Listings" value={summaryData.active_listings ?? 0} icon={<FaCheckCircle />} color="green" />
                            <SummaryCard title="Pending Requests" value={summaryData.pending_requests ?? 0} icon={<FaClock />} color="yellow" />
                        </>
                    )}
                    {auth.user.role === 'tenant' && (
                        <>
                            <SummaryCard title="Active Bookings" value={summaryData.booking_count ?? 0} icon={<FaCalendarAlt />} color="indigo" />
                            <SummaryCard title="My Favorites" value={summaryData.favorite_count ?? 0} icon={<FaHeart />} color="red" />
                        </>
                    )}
                </div>
            </div>
        </SidebarLayout>
    );
}