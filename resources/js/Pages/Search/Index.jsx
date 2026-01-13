// FILE: resources/js/Pages/Search/Index.jsx
// This is a simplified, foolproof version to guarantee functionality.

import { useState } from 'react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head } from '@inertiajs/react';
import PropertyCard from '@/Components/PropertyCard';
import axios from 'axios';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';

export default function Index({ auth, initialProperties }) {
    // STATE MANAGEMENT
    const [properties, setProperties] = useState(initialProperties);
    const [count, setCount] = useState(initialProperties.length);
    const [loading, setLoading] = useState(false);
    
    const [filters, setFilters] = useState({
        keyword: '',
        property_type: '',
        bedrooms: '',
        bathrooms: '',
        max_price: '',
        amenities: [],
        sort_by: 'newest'
    });

    // FUNCTION TO CALL THE API
    const performSearch = () => {
        // --- DEBUG #2: This should run when the search is triggered.
        console.log('PERFORMING SEARCH with filters:', filters);
        setLoading(true);

        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (key === 'amenities' && Array.isArray(value) && value.length > 0) {
                value.forEach(amenity => params.append('amenities[]', amenity));
            } else if (value && key !== 'amenities') {
                params.append(key, value);
            }
        });

        axios.get(route('api.properties.search'), { params })
            .then(response => {
                // --- DEBUG #3: We should see the server's response here.
                console.log('Received response:', response.data);
                setProperties(response.data.properties);
                setCount(response.data.count);
            })
            .catch(error => {
                console.error("Search request failed:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // HANDLER FOR THE FORM SUBMISSION
    const handleSubmit = (e) => {
        e.preventDefault();
        // --- DEBUG #1: This is the first thing we MUST see in the console.
        console.log('Search form submitted!');
        performSearch();
    };

    // HANDLER FOR ANY INPUT CHANGE
    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        setFilters(prevFilters => {
            if (type === 'checkbox') {
                const newAmenities = checked
                    ? [...prevFilters.amenities, value]
                    : prevFilters.amenities.filter(a => a !== value);
                return { ...prevFilters, amenities: newAmenities };
            }
            return { ...prevFilters, [name]: value };
        });
    };

    // Special handler for sort, as it should trigger an immediate search
    const handleSortChange = (e) => {
        const { name, value } = e.target;
        // Create a new filters object to trigger the search
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        // We call performSearch directly here for instant sort updates
        performSearch(); 
    };
    
    return (
        <SidebarLayout user={auth.user} header="Search Properties">
            <Head title="Search Properties" />

            {/* The form now has a clear onSubmit handler */}
            <form onSubmit={handleSubmit}>
                <div className="bg-white p-4 mb-4 rounded-lg shadow-sm">
                    {/* All form inputs go here. Each one calls handleFilterChange */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="lg:col-span-4">
                            <InputLabel htmlFor="keyword" value="Location Keyword" />
                            <TextInput id="keyword" name="keyword" value={filters.keyword} onChange={handleFilterChange} placeholder="Location, Title..." className="mt-1 block w-full" />
                        </div>
                        <div>
                            <InputLabel htmlFor="property_type" value="Type" />
                            <select id="property_type" name="property_type" value={filters.property_type} onChange={handleFilterChange} className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"><option value="">All Types</option><option>Apartment</option><option>Bungalow</option><option>Duplex</option><option>Villa</option></select>
                        </div>
                        <div>
                            <InputLabel htmlFor="bedrooms" value="Bedrooms (Min)" />
                            <select id="bedrooms" name="bedrooms" value={filters.bedrooms} onChange={handleFilterChange} className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"><option value="">Any</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option></select>
                        </div>
                        <div>
                            <InputLabel htmlFor="bathrooms" value="Bathrooms (Min)" />
                            <select id="bathrooms" name="bathrooms" value={filters.bathrooms} onChange={handleFilterChange} className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"><option value="">Any</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option></select>
                        </div>
                        <div>
                            <InputLabel htmlFor="max_price" value="Max Price ($)" />
                            <TextInput id="max_price" type="number" name="max_price" value={filters.max_price} onChange={handleFilterChange} className="mt-1 block w-full" />
                        </div>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-4">
                        <span className="font-semibold text-gray-700">Amenities:</span>
                        {['WiFi', 'Parking', 'Pool', 'Air Conditioning', 'Gym'].map(amenity => (
                            <label key={amenity} className="flex items-center space-x-2">
                                <input type="checkbox" name="amenities" value={amenity} checked={filters.amenities.includes(amenity)} onChange={handleFilterChange} className="form-checkbox rounded text-blue-600" />
                                <span className="text-sm text-gray-600">{amenity}</span>
                            </label>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t text-right">
                        {/* The button is now a standard submit button for the form */}
                        <PrimaryButton type="submit" disabled={loading}>
                            {loading ? 'Searching...' : 'Search'}
                        </PrimaryButton>
                    </div>
                </div>
            </form>

            <div className="flex justify-between items-center mb-4">
                <div className="font-bold text-gray-700">Found {count} properties.</div>
                <select name="sort_by" value={filters.sort_by} onChange={handleSortChange} className="form-select border-gray-300 rounded-md shadow-sm text-sm">
                    <option value="newest">Sort by: Newest</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div></div>
                ) : (
                    properties.map(property => <PropertyCard key={property.id} property={property} user={auth.user} />)
                )}
            </div>
        </SidebarLayout>
    );
}