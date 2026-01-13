// FILE: resources/js/Pages/Search.jsx

import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head } from '@inertiajs/react';

export default function Search({ auth }) {
    return (
        <SidebarLayout user={auth.user} header="Search Properties">
            <Head title="Search" />
            
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold">Search Page</h3>
                <p className="mt-2 text-gray-600">This is the placeholder for the advanced property search page. We will build the filters and dynamic results here.</p>
            </div>
        </SidebarLayout>
    );
}