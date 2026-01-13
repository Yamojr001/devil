// FILE: resources/js/Pages/Admin/Users/Index.jsx
// This is the complete, final, and corrected version.

import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

// A reusable Pagination component that correctly handles Inertia links
const Pagination = ({ links }) => {
    if (links.length <= 3) return null; // Don't render if not enough pages

    return (
        <div className="mt-6 flex flex-wrap -mb-1">
            {links.map((link, key) => (
                link.url === null ?
                    (<span key={`${key}-disabled`} dangerouslySetInnerHTML={{ __html: link.label }} className="mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-400 border rounded" />) :
                    (<Link key={`${key}-link`} href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} className={`mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white focus:border-indigo-500 focus:text-indigo-500 ${link.active ? 'bg-white font-bold' : ''}`} />)
            ))}
        </div>
    );
};


// Main component for the User Management page
export default function Index({ auth, users, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    // Debounce the search input to avoid excessive requests while typing.
    // useCallback ensures the debounce function isn't recreated on every render.
    const debouncedSearch = useCallback(debounce((nextValue) => {
        router.get(route('admin.users.index'), { search: nextValue }, {
            preserveState: true,
            replace: true,
        });
    }, 300), []);

    useEffect(() => {
        debouncedSearch(search);
        return () => {
            debouncedSearch.cancel(); // Cleanup on unmount
        };
    }, [search, debouncedSearch]);

    return (
        <AdminLayout user={auth.user} header="Manage Users">
            <Head title="Manage Users" />
            
            <div className="bg-white rounded-lg shadow-md">
                <div className="p-4 border-b">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="form-input w-full md:w-1/3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined On</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.data && users.data.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{user.name}</div></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{user.email}</div></td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                            user.role === 'staff' ? 'bg-indigo-100 text-indigo-800' :
                                            user.role === 'landlord' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                        }`}>{user.role}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{new Date(user.created_at).toLocaleDateString()}</div></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                         <Link href={route('admin.users.show', user.id)} className="text-indigo-600 hover:text-indigo-900">View</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {users.data.length === 0 && <p className="p-6 text-center text-gray-500">No users found.</p>}
                </div>
                {/* Render pagination links only if there is more than one page */}
                {users.links && users.links.length > 3 && (
                    <div className="p-4 border-t">
                        <Pagination links={users.links} />
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}