// FILE: resources/js/Pages/Staff/Dashboard.jsx
// This is the complete and final version.

import StaffLayout from '@/Layouts/StaffLayout';
import { Head } from '@inertiajs/react';
import { FaUsers, FaHome, FaCheckCircle } from 'react-icons/fa';

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center">
            <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600 mr-4`}>
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
        <StaffLayout user={auth.user} header="Dashboard">
            <Head title="Staff Dashboard" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Managed Landlords" value={stats.managed_landlords} icon={<FaUsers />} color="indigo" />
                <StatCard title="Total Properties (Managed)" value={stats.total_properties} icon={<FaHome />} color="blue" />
                <StatCard title="Active Properties (Managed)" value={stats.active_properties} icon={<FaCheckCircle />} color="green" />
            </div>
        </StaffLayout>
    );
}