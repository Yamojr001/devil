// FILE: resources/js/Pages/Staff/Landlords/Create.jsx

import StaffLayout from '@/Layouts/StaffLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', password: '', password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('staff.landlords.store'), {
            onSuccess: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <StaffLayout user={auth.user} header="Add New Landlord">
            <Head title="Add Landlord" />
            <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <form onSubmit={submit}>
                    <div>
                        <InputLabel htmlFor="name" value="Name" />
                        <TextInput id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required autoFocus autoComplete="name" className="mt-1 block w-full" />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="email" value="Email" />
                        <TextInput id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required autoComplete="username" className="mt-1 block w-full" />
                        <InputError message={errors.email} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Password" />
                        <TextInput id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} required autoComplete="new-password" className="mt-1 block w-full" />
                        <InputError message={errors.password} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                        <TextInput id="password_confirmation" type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} required autoComplete="new-password" className="mt-1 block w-full" />
                        <InputError message={errors.password_confirmation} className="mt-2" />
                    </div>
                    <div className="flex items-center justify-end mt-4">
                        <Link href={route('staff.landlords.index')} className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Cancel</Link>
                        <PrimaryButton className="ms-4" disabled={processing}>Create Landlord</PrimaryButton>
                    </div>
                </form>
            </div>
        </StaffLayout>
    );
}