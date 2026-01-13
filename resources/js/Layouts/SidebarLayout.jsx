// FILE: resources/js/Layouts/SidebarLayout.jsx
// This is the definitive, complete version with all links for all roles implemented.

import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { 
    FaTachometerAlt, FaPlusCircle, FaHome, FaCalendarCheck, 
    FaBuilding, FaUserCog, FaSignOutAlt, FaCalendarAlt, FaHeart,
    FaSearch, FaEnvelope, FaHeadset, FaTicketAlt, FaUserShield, FaUsers 
} from 'react-icons/fa';
import Logo from '../../images/Logo2.png';

// This is a reusable NavLink component for our sidebar.
const SidebarNavLink = ({ href, active, children }) => (
    <Link
        href={href}
        className={`flex items-center p-4 text-base font-normal rounded-lg transition duration-75 group ${
            active ? 'bg-orange-400 text-white' : 'text-white hover:bg-orange-700 hover:text-white'
        }`}
    >
        {children}
    </Link>
);

export default function SidebarLayout({ user, header, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* --- Off-canvas Sidebar --- */}
            <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-orange-600 text-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0 md:relative`}>
                <div className="flex items-center justify-center h-16 border-b border-white">
                    <img src={Logo} alt="RentHouse Logo" className="h-12 w-20 " />
                    <Link href={route('dashboard')} className="text-3xl font-bold text-white ml-[-20px]">RentHouse</Link>
                </div>
                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                    {/* --- General Links --- */}
                    <SidebarNavLink href={route('dashboard')} active={route().current('dashboard')}>
                        <FaTachometerAlt className="mr-3" /> Dashboard
                    </SidebarNavLink>
                    
                    {/* --- Landlord-Specific Links --- */}
                    {user.role === 'landlord' && (
                        <>
                            <SidebarNavLink href={route('my-properties.index')} active={route().current('my-properties.index')}>
                                <FaHome className="mr-3" /> My Properties
                            </SidebarNavLink>
                            <SidebarNavLink href={route('properties.create')} active={route().current('properties.create')}>
                                <FaPlusCircle className="mr-3" /> Add Property
                            </SidebarNavLink>
                            <SidebarNavLink href={route('booking-requests.index')} active={route().current('booking-requests.index')}>
                                <FaCalendarCheck className="mr-3" /> Booking Requests
                            </SidebarNavLink>
                        </>
                    )}
                    
                    {/* --- Tenant-Specific Links --- */}
                    {user.role === 'tenant' && (
                        <>
                            <SidebarNavLink href={route('properties.index')} active={route().current('properties.index')}>
                                <FaBuilding className="mr-3" /> Properties
                            </SidebarNavLink>
                            <SidebarNavLink href={route('search.index')} active={route().current('search.index')}>
                                <FaSearch className="mr-3" /> Search
                            </SidebarNavLink>
                            <SidebarNavLink href={route('my-bookings.index')} active={route().current('my-bookings.index')}>
                                <FaCalendarAlt className="mr-3" /> My Bookings
                            </SidebarNavLink>
                            <SidebarNavLink href={route('my-favorites.index')} active={route().current('my-favorites.index')}>
                                <FaHeart className="mr-3" /> My Favorites
                            </SidebarNavLink>
                        </>
                    )}
                    
                    {/* --- Admin-Only Section --- */}
                    {user.role === 'admin' && (
                        <>
                            <hr className="my-2 border-white" />
                            <div className="px-4 pt-2 pb-1 text-xs font-semibold text-white uppercase">Admin Area</div>
                            <SidebarNavLink href={route('admin.users.index')} active={route().current('admin.users.index')}>
                                <FaUsers className="mr-3" /> Manage Users
                            </SidebarNavLink>
                            <SidebarNavLink href={route('admin.tickets.index')} active={route().current('admin.tickets.index')}>
                                <FaTicketAlt className="mr-3" /> Support Tickets
                            </SidebarNavLink>
                        </>
                    )}

                    {/* --- Staff & Admin Section --- */}
                    {(user.role === 'staff' || user.role === 'admin') && (
                        <>
                            <hr className="my-2 border-white" />
                            <div className="px-4 pt-2 pb-1 text-xs font-semibold text-white uppercase">Staff Area</div>
                            <SidebarNavLink href={route('staff.dashboard')} active={route().current('staff.dashboard')}>
                                <FaUserShield className="mr-3" /> Staff Panel
                            </SidebarNavLink>
                        </>
                    )}

                    <hr className="my-2 border-white" />
                    
                    {/* --- Links for All Logged-in Roles --- */}
                    <SidebarNavLink href={route('messages.index')} active={route().current('messages.index')}>
                        <FaEnvelope className="mr-3" /> Messages
                    </SidebarNavLink>
                    <SidebarNavLink href={route('contact.index')} active={route().current('contact.index')}>
                        <FaHeadset className="mr-3" /> Contact Support
                    </SidebarNavLink>
                    <SidebarNavLink href={route('profile.edit')} active={route().current('profile.edit')}>
                        <FaUserCog className="mr-3" /> Profile Settings
                    </SidebarNavLink>
                    <Link href={route('logout')} method="post" as="button" className="w-full text-left flex items-center p-4 text-base font-normal text-white rounded-lg hover:bg-orange-700 hover:text-white group">
                         <FaSignOutAlt className="mr-3" /> Logout
                    </Link>
                </nav>
            </aside>

            {/* --- Main Content --- */}
            <div className="flex-1 flex flex-col">
                <header className="flex items-center justify-between h-16 bg-white border-b border-gray-200 px-4 md:hidden">
                    <button onClick={() => setSidebarOpen(true)} className="text-gray-500 focus:outline-none focus:text-gray-700">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </button>
                    <h2 className="text-xl font-semibold">{header}</h2>
                    <div></div> {/* Spacer */}
                </header>
                
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}