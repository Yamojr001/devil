import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head, Link, router } from '@inertiajs/react';
import { FaCreditCard, FaCheckCircle } from 'react-icons/fa';
import { useEffect } from 'react';

export default function Create({ auth, booking, monnify_api_key, monnify_contract_code }) {
    
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://sdk.monnify.com/plugin/monnify.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, []);

    const handlePayment = () => {
        if (!window.MonnifySDK) {
            alert("Payment gateway is loading, please wait...");
            return;
        }

        window.MonnifySDK.initialize({
            amount: booking.property.price,
            currency: "NGN",
            reference: `BOK-${booking.id}-${Date.now()}`,
            customerFullName: auth.user.name,
            customerEmail: auth.user.email,
            apiKey: monnify_api_key,
            contractCode: monnify_contract_code,
            paymentDescription: `Payment for ${booking.property.title}`,
            metadata: {
                "booking_id": booking.id,
                "user_id": auth.user.id
            },
            isTestMode: true, // Set to false for production
            onComplete: function(response) {
                if (response.paymentStatus === 'PAID' || response.paymentStatus === 'SUCCESS') {
                    router.post(route('payments.verify'), {
                        transactionReference: response.transactionReference,
                        booking_id: booking.id
                    }, {
                        onSuccess: (page) => {
                            // The success message will be in the flash session
                            router.visit(route('my-bookings.index'));
                        }
                    });
                }
            },
            onClose: function(data) {
                console.log("Payment modal closed", data);
            }
        });
    };

    return (
        <SidebarLayout user={auth.user} header="Secure Payment">
            <Head title="Payment" />
            
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                        <FaCreditCard className="text-3xl text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Complete Your Payment</h2>
                    <p className="text-gray-600">Secure your spot for {booking.property.title}</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Property Rent</span>
                        <span className="font-bold text-gray-800">₦{Number(booking.property.price).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-bold text-lg">
                        <span>Total Due</span>
                        <span className="text-blue-600">₦{Number(booking.property.price).toLocaleString()}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <button 
                        onClick={handlePayment}
                        className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                         Pay via Monnify
                    </button>
                    <Link href={route('my-bookings.index')} className="w-full block text-center py-2 text-gray-500 hover:text-gray-700">
                        Cancel and Go Back
                    </Link>
                </div>

                <div className="mt-8 flex items-center justify-center text-xs text-gray-400">
                    <FaCheckCircle className="mr-1" />
                    <span>Your transaction is encrypted and secure</span>
                </div>
            </div>
        </SidebarLayout>
    );
}