// FILE: resources/js/Layouts/AdminLayout.jsx
// This is the complete version with the new "Manage Users" link.

import { Link } from '@inertiajs/react';
import { FaTachometerAlt, FaUsers, FaArrowLeft, FaTicketAlt } from 'react-icons/fa'; // <-- Added FaUsers and FaTicketAlt

const AdminSidebarNavLink = ({ href, active, children }) => ( <Link href={href} className={`flex items-center p-3 text-base font-normal rounded-lg transition duration-75 group ${active ? 'bg-orange-400 text-white' : 'text-white hover:bg-orange-700 hover:text-white'}`}>{children}</Link> );

export default function AdminLayout({ user, header, children }) {
    return (
        <div className="min-h-screen bg-gray-100 flex">
            <aside className="w-64 bg-orange-600 text-white flex-shrink-0 md:flex flex-col hidden">
                <div className="flex items-center justify-center h-16 border-b border-white">
                    <Link href={route('admin.dashboard')} className="text-2xl font-bold">Admin Panel</Link>
                </div>
                <nav className="px-4 py-4 space-y-2 flex-grow">
                    <AdminSidebarNavLink href={route('admin.dashboard')} active={route().current('admin.dashboard')}>
                        <FaTachometerAlt className="mr-3" /> Dashboard
                    </AdminSidebarNavLink>
                    
                    {/* --- THIS IS THE NEW LINK --- */}
                    <AdminSidebarNavLink href={route('admin.users.index')} active={route().current('admin.users.index')}>
                        <FaUsers className="mr-3" /> Manage Users
                    </AdminSidebarNavLink>
                    
                    <AdminSidebarNavLink href={route('admin.tickets.index')} active={route().current('admin.tickets.index')}>
                        <FaTicketAlt className="mr-3" /> Support Tickets
                    </AdminSidebarNavLink>
                </nav>
                <div className="px-4 py-4 border-t border-white">
                     <AdminSidebarNavLink href={route('dashboard')}>
                        <FaArrowLeft className="mr-3" /> Back to Main Site
                    </AdminSidebarNavLink>
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