import { Link, Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Navbar from '@/Components/Navbar.jsx';
import HowItWorks from '@/Components/HowItWorks';
import Features from '@/Components/Features';
import AboutUs from '@/Components/AboutUs.jsx';
import Properties from '@/Components/PropertyListing.jsx';
import Footer from '@/Components/Footer';
import houseImage from '../../images/propty.jpeg';

export default function Welcome({ auth }) {
   
  const textVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0, transition: { duration: 1.0, ease: "easeOut" } }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { delay: 0.6, duration: 0.6 } }
  };
    return (
        <>
            <Head title="Renthouse - Find Rentals in Dutse" />
            <Navbar />

            {/* Main Background Wrapper */}
            <div className="min-h-screen bg-white text-gray-900 selection:bg-orange-500 pt-8 selection:text-white" id='home'>


                {/* Hero Section */}
              
            
            {/*  House Image - Positioned Right */}
            {/* This element is absolutely positioned to manage  overlap */}
            <div className="absolute right-0 top-0 md:top-1/2 transform md:-translate-y-1/2 h-full w-full md:w-[47%] pointer-events-none overflow-hidden ">
                <motion.img
                src={houseImage}
                alt=""
                className="w-full h-full object-cover object-right-bottom transform scale-140 translate-x-6"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                />

                {/* Backdrop Blur Overlay - Visible ONLY on Small Screens */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm px-8 md:hidden"></div>
            </div>


            {/* 2. Main Content - Text and CTA (Positioned Left) */}
            <div className="relative z-10 max-w-7xl mx-auto h-full flex items-center px-6 pt-20">
                <div className="w-full md:w-1/2 lg:w-[60%] text-left">


                {/*will visually 'overlap' the edge of the image */}
                <motion.h1 
                    className="text-white md:text-gray-900 text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight "
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                >
                    We make managing your rentals <span className="text-orange-600"> <br />easier than ever.</span> 
                </motion.h1>

                <motion.p 
                    className="text-white md:text-[#222222] text-xl md:text-2xl mb-10 font-light max-w-lg"
                    variants={textVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    Find Houses, Shops, and Hotels for Rent in Dutse — Fast & Easy
                    Your one-stop platform for discovering reliable rentals across Dutse.
                    Search verified listings from trusted property owners and agents, all in one place.
                </motion.p>
          
          {/* Get Started Button */}

            {/* CTA Buttons */}
            <div  className="flex flex-col sm:flex-row  md:space-x-8  ">
                {auth.user ? (
                    <Link
                        href={route('dashboard')}
                        className="px-8 py-4 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 transition shadow-lg shadow-orange-500/30"
                    >
                        Go to Dashboard
                    </Link>
                ) : (
                    <Link
                        href={route('register')}
                        className="px-8 py-4 bg-orange-500 text-white rounded-xl mb-8 font-bold text-lg hover:bg-orange-600 transition shadow-lg shadow-orange-500/30"
                    >
                        Get Started
                    </Link>
                )}
                    <Link
                        href={route('contact')}
                        className="px-8 py-4 bg-gray-50 border border-gray-300 text-orange-600 rounded-xl mb-8 font-bold text-lg hover:bg-orange-200 transition"
                    >
                        Register as a Landord
                    </Link>
            </div>
        </div>
      </div>


                {/* Decorative background element (Optional subtle blur) */}
                <div className="fixed top-0 left-0 -z-10 w-full h-full bg-white">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-200/30 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-[100px]" />
                </div>
            </div>
            <HowItWorks />
            <Features />
            <AboutUs />
            <Properties />
            <Footer/>


        </>
    );
}