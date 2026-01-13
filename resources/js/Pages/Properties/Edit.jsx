// FILE: resources/js/Pages/Properties/Edit.jsx
// Definitive, complete version with robust form structure.

import { useState } from 'react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { FaCamera, FaInfoCircle, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const TabButton = ({ active, onClick, children }) => (
    <button type="button" onClick={onClick} className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 ${active ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
        {children}
    </button>
);

export default function Edit({ auth, property }) {
    const [activeTab, setActiveTab] = useState('details');
    const { props } = usePage();
    const flash = props.flash || {};
    const [images, setImages] = useState(property.images || []);
    
    const { data, setData, post, processing, errors } = useForm({
        _method: 'patch',
        title: property.title || '',
        description: property.description || '',
        property_type: property.property_type || 'Apartment',
        price: property.price || '',
        price_period: property.price_period || 'month',
        bedrooms: property.bedrooms || '1',
        bathrooms: property.bathrooms || '1',
        country: property.country || '',
        state: property.state || '',
        city: property.city || '',
        address: property.address || '',
        amenities: property.amenities ? (Array.isArray(property.amenities) ? property.amenities : property.amenities.split(',')) : [],
        new_images: [],
    });

    const handleAmenityChange = (e) => {
        const { value, checked } = e.target;
        setData('amenities', checked ? [...data.amenities, value] : data.amenities.filter(item => item !== value));
    };

    const handleImageChange = (e) => setData('new_images', Array.from(e.target.files));

    const removeImage = async (imageId) => {
        if (!confirm('Are you sure you want to permanently delete this image?')) return;
        try {
            await axios.delete(route('properties.images.destroy', imageId));
            setImages(images.filter(img => img.id !== imageId));
        } catch (error) {
            console.error('Failed to delete image:', error);
            alert('Error: Could not delete the image.');
        }
    };
    
    const submit = (e) => {
        e.preventDefault();
        post(route('properties.update', property.id), {
            forceFormData: true,
            onSuccess: () => {
                setData('new_images', []);
                document.getElementById('new_images_input').value = "";
            }
        });
    };  

    return (
        <SidebarLayout user={auth.user} header={`Edit Property`}>
            <Head title="Edit Property" />
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md my-8">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-4 px-6">
                        <TabButton active={activeTab === 'details'} onClick={() => setActiveTab('details')}><FaInfoCircle className="mr-2" /> Details</TabButton>
                        <TabButton active={activeTab === 'images'} onClick={() => setActiveTab('images')}><FaCamera className="mr-2" /> Images</TabButton>
                    </nav>
                </div>
                
                <form id="edit-property-form" onSubmit={submit} className="p-6">
                    {flash.success && <div className="mb-4 text-sm font-medium text-green-600 bg-green-100 p-3 rounded">{flash.success}</div>}
                    
                    <div style={{ display: activeTab === 'details' ? 'block' : 'none' }}>
                        <div className="space-y-4">
                            <div><InputLabel htmlFor="title" value="Property Title" /><TextInput id="title" value={data.title} onChange={e => setData('title', e.target.value)} className="mt-1 block w-full" required /></div>
                            <div><InputLabel htmlFor="description" value="Description" /><textarea id="description" value={data.description} onChange={e => setData('description', e.target.value)} rows="5" className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm" required /></div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div><InputLabel htmlFor="country" value="Country" /><TextInput id="country" value={data.country} onChange={e => setData('country', e.target.value)} className="mt-1 block w-full" required /></div>
                                <div><InputLabel htmlFor="state" value="State / Region" /><TextInput id="state" value={data.state} onChange={e => setData('state', e.target.value)} className="mt-1 block w-full" required /></div>
                                <div><InputLabel htmlFor="city" value="City" /><TextInput id="city" value={data.city} onChange={e => setData('city', e.target.value)} className="mt-1 block w-full" required /></div>
                            </div>
                            <hr className="my-4" />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div><InputLabel htmlFor="bedrooms" value="Bedrooms" /><TextInput type="number" id="bedrooms" value={data.bedrooms} onChange={e => setData('bedrooms', e.target.value)} className="mt-1 block w-full" required /></div>
                                <div><InputLabel htmlFor="bathrooms" value="Bathrooms" /><TextInput type="number" id="bathrooms" value={data.bathrooms} onChange={e => setData('bathrooms', e.target.value)} className="mt-1 block w-full" required /></div>
                                <div><InputLabel htmlFor="property_type" value="Property Type" /><select id="property_type" value={data.property_type} onChange={e => setData('property_type', e.target.value)} className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"><option>Apartment</option><option>Bungalow</option><option>Duplex</option><option>Villa</option></select></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div><InputLabel htmlFor="price" value="Price ($)" /><TextInput type="number" id="price" value={data.price} onChange={e => setData('price', e.target.value)} className="mt-1 block w-full" required /></div>
                                <div><InputLabel htmlFor="price_period" value="Per" /><select id="price_period" value={data.price_period} onChange={e => setData('price_period', e.target.value)} className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"><option value="month">Month</option><option value="year">Year</option></select></div>
                            </div>
                            <hr className="my-4" />
                            <h4 className="text-md font-bold text-gray-700 mb-2">Amenities</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {['WiFi', 'Parking', 'Pool', 'Air Conditioning', 'Gym', 'Washing Machine'].map((amenity) => (
                                    <label key={amenity} className="flex items-center space-x-2"><input type="checkbox" value={amenity} checked={data.amenities.includes(amenity)} onChange={handleAmenityChange} className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500" /><span className="text-sm text-gray-600">{amenity}</span></label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: activeTab === 'images' ? 'block' : 'none' }}>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Existing Images</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {images.map((image) => (
                                <div key={image.id} className="relative"><img src={`/storage/${image.image_path}`} className="w-full h-32 object-cover rounded-lg" /><button type="button" onClick={() => removeImage(image.id)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs"><FaTimes /></button></div>
                            ))}
                        </div>
                        <hr className="my-6" />
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Upload New Images</h3>
                        <input type="file" id="new_images_input" multiple onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        <InputError message={errors.new_images} className="mt-2" />
                    </div>
                    
                    <div className="mt-8 pt-4 border-t flex justify-end">
                        <Link href={route('my-properties.index')} className="text-sm text-gray-600 hover:text-gray-900 mr-4 self-center">Cancel</Link>
                        <PrimaryButton type="submit" form="edit-property-form" disabled={processing}>Save Changes</PrimaryButton>
                    </div>
                </form>
            </div>
        </SidebarLayout>
    );
}