// FILE: resources/js/Pages/Profile/Partials/UpdateProfileInformationForm.jsx
import { useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

export default function UpdateProfileInformationForm({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful, reset } = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        nin: user.nin || '',
        dob: user.dob || '',
        nationality: user.nationality || '',
        address_street: user.address_street || '',
        address_city: user.address_city || '',
        address_state: user.address_state || '',
        address_country: user.address_country || '',
        id_type: user.id_type || '',
        id_number: user.id_number || '',
        id_document: null,
    });

    const submit = (e) => {
        e.preventDefault();
        
        // Create FormData object manually to ensure all fields are included
        const formData = new FormData();
        
        // Append all form fields
        Object.keys(data).forEach(key => {
            if (key === 'id_document') {
                if (data[key] instanceof File) {
                    formData.append(key, data[key]);
                }
            } else {
                formData.append(key, data[key] || '');
            }
        });

        // Use Inertia's post method with FormData
        patch(route('profile.update'), formData, {
            preserveScroll: true,
            onSuccess: () => {
                reset('id_document');
                // Force a reload to get updated user data
                window.location.reload();
            },
            forceFormData: true,
        });
    };

    const handleFileChange = (e) => {
        setData('id_document', e.target.files[0]);
    };

    // Update form data when component mounts with user data
    useEffect(() => {
        if (user) {
            setData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                nin: user.nin || '',
                dob: user.dob || '',
                nationality: user.nationality || '',
                address_street: user.address_street || '',
                address_city: user.address_city || '',
                address_state: user.address_state || '',
                address_country: user.address_country || '',
                id_type: user.id_type || '',
                id_number: user.id_number || '',
                id_document: null,
            });
        }
    }, [user]);

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">KYC / Profile Information</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile and identity information.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <InputLabel htmlFor="name" value="Full Name *" />
                        <TextInput
                            id="name"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div>
                        <InputLabel htmlFor="email" value="Email *" />
                        <TextInput
                            id="email"
                            type="email"
                            className="mt-1 block w-full"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                        <InputError className="mt-2" message={errors.email} />
                    </div>

                    <div>
                        <InputLabel htmlFor="phone" value="Phone Number" />
                        <TextInput
                            id="phone"
                            type="tel"
                            className="mt-1 block w-full"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.phone} />
                    </div>

                    <div>
                        <InputLabel htmlFor="nin" value="National ID (NIN)" />
                        <TextInput
                            id="nin"
                            className="mt-1 block w-full"
                            value={data.nin}
                            onChange={(e) => setData('nin', e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.nin} />
                    </div>
                </div>

                {/* Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <InputLabel htmlFor="dob" value="Date of Birth" />
                        <TextInput
                            id="dob"
                            type="date"
                            className="mt-1 block w-full"
                            value={data.dob}
                            onChange={(e) => setData('dob', e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.dob} />
                    </div>

                    <div>
                        <InputLabel htmlFor="nationality" value="Nationality" />
                        <TextInput
                            id="nationality"
                            className="mt-1 block w-full"
                            value={data.nationality}
                            onChange={(e) => setData('nationality', e.target.value)}
                        />
                        <InputError className="mt-2" message={errors.nationality} />
                    </div>
                </div>

                {/* Address Information */}
                <div className="border-t pt-6">
                    <h3 className="text-md font-medium text-gray-900 mb-4">Address Information</h3>
                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="address_street" value="Street Address" />
                            <TextInput
                                id="address_street"
                                className="mt-1 block w-full"
                                value={data.address_street}
                                onChange={(e) => setData('address_street', e.target.value)}
                            />
                            <InputError className="mt-2" message={errors.address_street} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <InputLabel htmlFor="address_city" value="City" />
                                <TextInput
                                    id="address_city"
                                    className="mt-1 block w-full"
                                    value={data.address_city}
                                    onChange={(e) => setData('address_city', e.target.value)}
                                />
                                <InputError className="mt-2" message={errors.address_city} />
                            </div>

                            <div>
                                <InputLabel htmlFor="address_state" value="State/Province" />
                                <TextInput
                                    id="address_state"
                                    className="mt-1 block w-full"
                                    value={data.address_state}
                                    onChange={(e) => setData('address_state', e.target.value)}
                                />
                                <InputError className="mt-2" message={errors.address_state} />
                            </div>

                            <div>
                                <InputLabel htmlFor="address_country" value="Country" />
                                <TextInput
                                    id="address_country"
                                    className="mt-1 block w-full"
                                    value={data.address_country}
                                    onChange={(e) => setData('address_country', e.target.value)}
                                />
                                <InputError className="mt-2" message={errors.address_country} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Identification Details */}
                <div className="border-t pt-6">
                    <h3 className="text-md font-medium text-gray-900 mb-4">Identification Details</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="id_type" value="ID Type" />
                                <select
                                    id="id_type"
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    value={data.id_type}
                                    onChange={(e) => setData('id_type', e.target.value)}
                                >
                                    <option value="">Select ID Type</option>
                                    <option value="NIN">National Identity Number (NIN)</option>
                                    <option value="Passport">Passport</option>
                                    <option value="Drivers License">Driver's License</option>
                                    <option value="Voter Card">Voter's Card</option>
                                    <option value="Other">Other</option>
                                </select>
                                <InputError className="mt-2" message={errors.id_type} />
                            </div>

                            <div>
                                <InputLabel htmlFor="id_number" value="ID Number" />
                                <TextInput
                                    id="id_number"
                                    className="mt-1 block w-full"
                                    value={data.id_number}
                                    onChange={(e) => setData('id_number', e.target.value)}
                                />
                                <InputError className="mt-2" message={errors.id_number} />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="id_document" value="ID Document (Optional)" />
                            <input
                                id="id_document"
                                type="file"
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                onChange={handleFileChange}
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Max file size: 5MB. Supported: PDF, JPG, PNG, DOC
                            </p>
                            {user.id_document_path && (
                                <p className="mt-2 text-sm text-green-600">
                                    ✓ Document already uploaded
                                </p>
                            )}
                            <InputError className="mt-2" message={errors.id_document} />
                        </div>
                    </div>
                </div>

                {/* Email Verification Notice */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-800">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-1 underline text-sm text-yellow-700 hover:text-yellow-900"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>
                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm text-green-600">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>
                        {processing ? 'Saving...' : 'Save Changes'}
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-green-600">Profile updated successfully!</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}