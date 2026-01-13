// FILE: resources/js/Pages/Admin/Dashboard.jsx

import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';


const StatCard = ({ title, value, icon }) => (
    <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    </div>
);

export default function Dashboard({ auth, stats }) {
    return (
        <AdminLayout user={auth.user} header="Dashboard">
            <Head title="Admin Dashboard" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Users" value={stats.total_users} />
                <StatCard title="Total Landlords" value={stats.total_landlords} />
                <StatCard title="Total Tenants" value={stats.total_tenants} />
                <StatCard title="Total Properties" value={stats.total_properties} />
                <StatCard title="Total Bookings" value={stats.total_bookings} />
                <StatCard title="Pending Bookings" value={stats.pending_bookings} />
            </div>
        </AdminLayout>
    );
}