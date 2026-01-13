// FILE: resources/js/Pages/Properties/Create.jsx
// This is the complete version with the new 'Possible Tenants' dropdown.

import { useState } from 'react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';

const WizardStep = ({ currentStep, stepNumber, children }) => (
    <div className={`wizard-step ${currentStep === stepNumber ? 'active' : ''}`}>{children}</div>
);

export default function Create({ auth }) {
    const [currentStep, setCurrentStep] = useState(1);
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '', description: '', property_type: 'Apartment',
        price: '', price_period: 'month', bedrooms: '1', bathrooms: '1',
        country: '', state: '', city: '', address: '',
        amenities: [],
        possible_tenants: 6, // <-- New form field with a default value
        images: [],
    });
    const [imagePreviews, setImagePreviews] = useState([]);

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    const handleAmenityChange = (e) => {
        const { value, checked } = e.target;
        setData('amenities', checked ? [...data.amenities, value] : data.amenities.filter((item) => item !== value));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setData('images', [...data.images, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };
    
    const removeImage = (indexToRemove) => {
        URL.revokeObjectURL(imagePreviews[indexToRemove]);
        setData('images', data.images.filter((_, index) => index !== indexToRemove));
        setImagePreviews(imagePreviews.filter((_, index) => index !== indexToRemove));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('properties.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setImagePreviews([]);
                setCurrentStep(1);
            },
        });
    };

    return (
        <SidebarLayout user={auth.user} header="List a New Property">
            <Head title="Add Property" />
            <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
                <div className="mb-6">
                    <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${((currentStep - 1) / 3) * 100}%` }}></div></div>
                    <p className="text-center text-sm text-gray-500 mt-2">Step {currentStep} of 4</p>
                </div>
                
                {errors.form && <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded">{errors.form}</div>}
                
                <form id="create-property-form" onSubmit={submit}>
                    <WizardStep currentStep={currentStep} stepNumber={1}>
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Basic Information</h3>
                        <div><InputLabel htmlFor="title" value="Property Title" /><TextInput id="title" name="title" value={data.title} className="mt-1 block w-full" onChange={(e) => setData('title', e.target.value)} required /><InputError message={errors.title} className="mt-2" /></div>
                        <div className="mt-4"><InputLabel htmlFor="description" value="Description" /><textarea id="description" name="description" value={data.description} className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm" onChange={(e) => setData('description', e.target.value)} rows="5" required /><InputError message={errors.description} className="mt-2" /></div>
                    </WizardStep>

                    <WizardStep currentStep={currentStep} stepNumber={2}>
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Location & Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div><InputLabel htmlFor="country" value="Country" /><TextInput id="country" name="country" value={data.country} className="mt-1 block w-full" onChange={(e) => setData('country', e.target.value)} required /></div>
                            <div><InputLabel htmlFor="state" value="State / Region" /><TextInput id="state" name="state" value={data.state} className="mt-1 block w-full" onChange={(e) => setData('state', e.target.value)} required /></div>
                            <div><InputLabel htmlFor="city" value="City" /><TextInput id="city" name="city" value={data.city} className="mt-1 block w-full" onChange={(e) => setData('city', e.target.value)} required /></div>
                        </div>
                        <div className="mt-4"><InputLabel htmlFor="address" value="Street Address" /><TextInput id="address" name="address" value={data.address} className="mt-1 block w-full" onChange={(e) => setData('address', e.target.value)} /></div>
                        <hr className="my-6" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div><InputLabel htmlFor="bedrooms" value="Bedrooms" /><TextInput id="bedrooms" type="number" name="bedrooms" value={data.bedrooms} className="mt-1 block w-full" onChange={(e) => setData('bedrooms', e.target.value)} required /></div>
                            <div><InputLabel htmlFor="bathrooms" value="Bathrooms" /><TextInput id="bathrooms" type="number" name="bathrooms" value={data.bathrooms} className="mt-1 block w-full" onChange={(e) => setData('bathrooms', e.target.value)} required /></div>
                            <div><InputLabel htmlFor="property_type" value="Property Type" /><select id="property_type" name="property_type" value={data.property_type} className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm" onChange={(e) => setData('property_type', e.target.value)}><option>Apartment</option><option>Bungalow</option><option>Duplex</option><option>Villa</option></select></div>
                        </div>
                    </WizardStep>

                    <WizardStep currentStep={currentStep} stepNumber={3}>
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Price & Capacity</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="price" value="Price ($)" />
                                <TextInput id="price" type="number" name="price" value={data.price} className="mt-1 block w-full" onChange={(e) => setData('price', e.target.value)} required />
                            </div>
                            <div>
                                <InputLabel htmlFor="price_period" value="Per" />
                                <select id="price_period" name="price_period" value={data.price_period} className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm" onChange={(e) => setData('price_period', e.target.value)}><option value="month">Month</option><option value="year">Year</option></select>
                            </div>
                            
                           <div className="md:col-span-2">
                                <InputLabel htmlFor="accepted_tenants" value="Number of Tenants to Accept" />
                                <TextInput
                                    id="accepted_tenants"
                                    type="number"
                                    name="accepted_tenants"
                                    value={data.accepted_tenants}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('accepted_tenants', e.target.value)}
                                    min="1"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    The system will add a small buffer to this number for booking requests. This is the exact number of tenants who will be allowed to pay.
                                </p>
                                <InputError message={errors.accepted_tenants} className="mt-2" />
                            </div>

                        </div>
                        <hr className="my-6" />
                        <h4 className="text-md font-bold text-gray-700 mb-2">Amenities</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {['WiFi', 'Parking', 'Pool', 'Air Conditioning', 'Gym'].map((amenity) => (
                                <label key={amenity} className="flex items-center space-x-2"><input type="checkbox" value={amenity} checked={data.amenities.includes(amenity)} onChange={handleAmenityChange} className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500" /><span className="text-sm text-gray-600">{amenity}</span></label>
                            ))}
                        </div>
                    </WizardStep>

                    <WizardStep currentStep={currentStep} stepNumber={4}>
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Property Photos</h3>
                        <div className="p-4 border-2 border-dashed rounded-lg text-center cursor-pointer bg-gray-50 hover:bg-gray-100" onClick={() => document.getElementById('image-upload').click()}>
                            <FaCloudUploadAlt className="mx-auto text-4xl text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">Drag & drop photos here, or click to browse.</p><p className="text-xs text-gray-500">PNG, JPG, WEBP up to 2MB.</p>
                        </div>
                        <input type="file" id="image-upload" multiple className="hidden" accept="image/*" onChange={handleImageChange} />
                        <InputError message={errors.images} className="mt-2" />
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {imagePreviews.map((previewUrl, index) => (
                                <div key={index} className="relative"><img src={previewUrl} className="w-full h-32 object-cover rounded-lg" alt={`Preview ${index + 1}`} /><button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs"><FaTimes /></button></div>
                            ))}
                        </div>
                    </WizardStep>

                    <div className="mt-8 pt-4 border-t flex justify-between items-center">
                        <div>{currentStep > 1 && <SecondaryButton type="button" onClick={prevStep}>Previous</SecondaryButton>}</div>
                        <div>
                            {currentStep < 4 && <PrimaryButton type="button" onClick={nextStep}>Next Step</PrimaryButton>}
                            <PrimaryButton type="submit" form="create-property-form" className={currentStep === 4 ? '' : 'hidden'} disabled={processing}>Finish & List Property</PrimaryButton>
                        </div>
                    </div>
                </form>
            </div>
        </SidebarLayout>
    );
}
