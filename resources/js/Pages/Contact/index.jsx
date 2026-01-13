// FILE: resources/js/Pages/Contact/Index.jsx

import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Index({ auth }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        subject: '',
        message: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('contact.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <SidebarLayout user={auth.user} header="Contact & Support">
            <Head title="Contact Support" />

            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800">Get in Touch</h2>
                <p className="mt-2 text-gray-600">
                    Have a question, a problem, or some feedback? Fill out the form below and our support team will get back to you as soon as possible.
                </p>

                {flash.success && (
                    <div className="mt-4 p-4 text-sm text-green-700 bg-green-100 rounded-lg">
                        {flash.success}
                    </div>
                )}

                <form onSubmit={submit} className="mt-6 space-y-4">
                    <div>
                        <InputLabel htmlFor="subject" value="Subject" />
                        <TextInput
                            id="subject"
                            name="subject"
                            value={data.subject}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('subject', e.target.value)}
                            required
                        />
                        <InputError message={errors.subject} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="message" value="Message" />
                        <textarea
                            id="message"
                            name="message"
                            value={data.message}
                            rows="6"
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            onChange={(e) => setData('message', e.target.value)}
                            required
                        />
                        <InputError message={errors.message} className="mt-2" />
                    </div>

                    <div className="flex justify-end">
                        <PrimaryButton disabled={processing}>
                            {processing ? 'Sending...' : 'Send Message'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </SidebarLayout>
    );
}