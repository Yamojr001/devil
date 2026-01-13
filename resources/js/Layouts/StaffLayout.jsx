// FILE: resources/js/Layouts/StaffLayout.jsx
// This is the complete and final version.

import { Link } from '@inertiajs/react';
import { FaTachometerAlt, FaUsers, FaArrowLeft } from 'react-icons/fa';

const StaffSidebarNavLink = ({ href, active, children }) => (
    <Link href={href} className={`flex items-center p-3 text-base font-normal rounded-lg transition duration-75 group ${active ? 'bg-orange-400 text-white' : 'text-white hover:bg-orange-700 hover:text-white'}`}>
        {children}
    </Link>
);

export default function StaffLayout({ user, header, children }) {
    return (
        <div className="min-h-screen bg-gray-100 flex">
            <aside className="w-64 bg-orange-600 text-white flex-shrink-0 md:flex flex-col hidden">
                <div className="flex items-center justify-center h-16 border-b border-white">
                    <Link href={route('staff.dashboard')} className="text-2xl font-bold">Staff Panel</Link>
                </div>
                <nav className="px-4 py-4 space-y-2 flex-grow">
                    <StaffSidebarNavLink href={route('staff.dashboard')} active={route().current('staff.dashboard')}>
                        <FaTachometerAlt className="mr-3" /> Dashboard
                    </StaffSidebarNavLink>
                    <StaffSidebarNavLink href={route('staff.landlords.index')} active={route().current('staff.landlords.index')}>
                        <FaUsers className="mr-3" /> My Landlords
                    </StaffSidebarNavLink>
                    {/* <StaffSidebarNavLink href={route('staff.landlords.index')} active={route().current('staff.landlords.index')}>
                        <FaUsers className="mr-3" /> My Landlords
                    </StaffSidebarNavLink> */}
                </nav>
                <div className="px-4 py-4 border-t border-white">
                     <StaffSidebarNavLink href={route('dashboard')}>
                        <FaArrowLeft className="mr-3" /> Back to Main Site
                    </StaffSidebarNavLink>
                </div>
            </aside>
            <div className="flex-1 flex flex-col">
                <header className="h-16 bg-white border-b flex items-center px-6 justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">{header}</h2>
                    <span className="text-gray-600">Welcome, {user.name} ({user.role})</span>
                </header>
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}