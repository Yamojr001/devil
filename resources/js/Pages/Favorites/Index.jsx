// FILE: resources/js/Pages/Favorites/Index.jsx
// This is the main page for displaying a user's favorited properties.

import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, Link } from '@inertiajs/react';
import PropertyCard from '@/Components/PropertyCard'; // We are reusing our excellent PropertyCard component

export default function Index({ auth, properties }) {
    return (
        <SidebarLayout
            user={auth.user}
            header="My Favorites"
        >
            <Head title="My Favorites" />

            {/* Check if the user has any favorited properties */}
            {properties && properties.length > 0 ? (
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Saved Properties</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {/* Loop through the properties and render a card for each one */}
                        {properties.map((property) => (
                            <PropertyCard key={property.id} property={property} user={auth.user} />
                        ))}
                    </div>
                </div>
            ) : (
                // Show a friendly message if the favorites list is empty
                <div className="text-center bg-white p-12 rounded-lg shadow-sm">
                    <h3 className="text-xl font-bold text-gray-700">Your Favorites List is Empty</h3>
                    <p className="text-gray-500 mt-2 mb-4">
                        Click the star icon on any property to save it here for later.
                    </p>
                    <Link 
                        href={route('properties.index')} 
                        className="inline-flex items-center px-4 py-2 bg-orange-500 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-orange-600"
                    >
                        Browse Properties
                    </Link>
                </div>
            )}
        </SidebarLayout>
    );
}