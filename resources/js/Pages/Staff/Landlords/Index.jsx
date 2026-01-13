// FILE: resources/js/Pages/Staff/Landlords/Index.jsx
// This is the complete and final version.

import StaffLayout from '@/Layouts/StaffLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import { FaPlus } from 'react-icons/fa';

// A reusable Pagination component
const Pagination = ({ links }) => (
    <div className="mt-6 flex flex-wrap -mb-1">
        {links.map((link, key) => (
            link.url === null ?
                (<span key={key} dangerouslySetInnerHTML={{ __html: link.label }} className="mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-400 border rounded" />) :
                (<Link key={key} href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} className={`mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white focus:border-indigo-500 focus:text-indigo-500 ${link.active ? 'bg-white font-bold' : ''}`} />)
        ))}
    </div>
);


export default function Index({ auth, landlords }) {
    const { flash } = usePage().props;

    return (
        <StaffLayout user={auth.user} header="My Landlords">
            <Head title="My Landlords" />
            
            {flash.success && <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg">{flash.success}</div>}

            <div className="flex justify-end mb-4">
                <Link href={route('staff.landlords.create')}>
                    <PrimaryButton><FaPlus className="mr-2" /> Add New Landlord</PrimaryButton>
                </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined On</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {landlords.data.map((landlord) => (
                                <tr key={landlord.id}>
                                    <td className="px-6 py-4">{landlord.name}</td>
                                    <td className="px-6 py-4">{landlord.email}</td>
                                    <td className="px-6 py-4">{new Date(landlord.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                         <Link href={route('staff.landlords.show', landlord.id)} className="text-indigo-600 hover:text-indigo-900 font-semibold">View Details</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {landlords.data.length === 0 && <p className="p-6 text-center text-gray-500">You have not added any landlords yet.</p>}
                </div>
                 {landlords.links.length > 3 && (
                    <div className="p-4 border-t">
                        <Pagination links={landlords.links} />
                    </div>
                )}
            </div>
        </StaffLayout>
    );
}