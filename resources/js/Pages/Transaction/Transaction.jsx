import React, { useState } from 'react';


// const MONNIFY_PUBLIC_KEY = import.meta.env.VITE_MONNIFY_PUBLIC_KEY;
const MONNIFY_PUBLIC_KEY = import.meta.env.VITE_MONNIFY_PUBLIC_KEY;
const MONNIFY_CONTRACT_CODE = import.meta.env.VITE_MONNIFY_PUBLIC_KEY;



const BACKEND_VERIFY_URL = "";

const useScript = (url) => {
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    document.body.appendChild(script);

    // Cleanup function to remove the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, [url]);
};


const MonnifyLivePaymentForm = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', amount: '', description: '',
    });
    

    useScript("https://sdk.monnify.com/plugin/monnify.js");
  
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault(); 
        
        
        const { name, email, phone, amount, description } = formData;
        
        
        const paymentAmount = Number(amount);

        if (!name || !email || !phone || !paymentAmount || !description || isNaN(paymentAmount) || paymentAmount <= 100) {
            alert("Please ensure all fields are correctly filled.");
            return;
        }

        
        const uniqueRef = `MK_${Date.now()}_${Math.random().toString(36).substring(2)}`;
        
        // --- Call Monnify SDK ---
        window.MonnifySDK.initialize({
            amount: paymentAmount,
            currency: "NGN",
            reference: uniqueRef,
            
            // Customer Details
            customerName: name,
            customerEmail: email,
            customerMobileNumber: phone,
            
            paymentDescription: description,
            apiKey: MONNIFY_PUBLIC_KEY,
            contractCode: MONNIFY_CONTRACT_CODE, 
            
            isTestMode: true, // *** CRITICAL: Set to false for live payments ***

            // We append the unique reference so the backend knows which transaction to verify.
            // redirectUrl: `${BACKEND_VERIFY_URL}?reference=${uniqueRef}`,

            onComplete: (response) => {
                // This function is still needed, but its main job is to log, 
                // as the redirectUrl handles fulfillment.
                console.log("Client-side confirmation received (Redirecting now...)", response);
            },
            onClose: () => {
                alert("Payment window closed.");
            }
        });
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-lg border-orange-600 border-t-4 rounded-xl">
            <h2 className="text-2xl font-bold text-center mb-6 text-orange-600">Secure Payment</h2>
            
            <form onSubmit={handleSubmit}>
                
                {['name', 'email', 'phone', 'amount', 'description'].map((field) => (
                    <div key={field} className="mb-4">
                        <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">
                            {field.replace('amount', 'Amount (NGN)').replace('description', 'Payment Description')}
                        </label>
                        <input
                            type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : field === 'amount' ? 'number' : 'text'}
                            id={field}
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            required
                            min={field === 'amount' ? "101" : undefined}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none outline-none focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>
                ))}

                <button
                    type="submit"
                    className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                    Pay N{formData.amount} Now
                </button>
            </form>

        </div>
    );
};

export default MonnifyLivePaymentForm;