// FILE: resources/js/Pages/Properties/Index.jsx
// This is the main page for displaying all available properties.

import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head } from '@inertiajs/react';
import PropertyCard from '@/Components/PropertyCard'; // We will create this reusable component next

export default function Index({ auth, properties }) {
    return (
        <SidebarLayout
            user={auth.user}
            header="Available Properties"
        >
            <Head title="Properties" />

            {/* Check if there are any properties to display */}
            {properties && properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Loop through the properties array and render a card for each one */}
                    {properties.map((property) => (
                        <PropertyCard key={property.id} property={property} user={auth.user} />
                    ))}
                </div>
            ) : (
                // Show a friendly message if the database is empty
                <div className="text-center bg-white p-12 rounded-lg shadow-sm">
                    <h3 className="text-xl font-bold text-gray-700">No Properties Available</h3>
                    <p className="text-gray-500 mt-2">
                        There are currently no available properties listed on the platform. Please check back soon!
                    </p>
                </div>
            )}
        </SidebarLayout>
    );
}