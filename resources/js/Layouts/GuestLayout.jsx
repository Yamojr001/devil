import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import Logo from '../../images/Logo.png';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-50">
            <div>
                <img src={Logo} alt="RentHouse Logo" className="h-13 w-20 absolute ml-[-50px] " />
                <h1 className='text-3xl lg:text-4xl md:text-4xl m-2 text-[#222222] tracking-tighter font-bold justify-start'>RentHouse</h1>
            </div>

            <div className="w-4/5 sm:max-w-md mt-6 px-6 py-4 border-t-4 border-orange-500 bg-white shadow-2xl overflow-hidden shadow-orange-500/30 rounded-xl sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
