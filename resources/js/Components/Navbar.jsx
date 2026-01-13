import { Link } from '@inertiajs/react';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Logo from '../../images/Logo.png';

const navItems = [
  { name: 'Home', href: '/', id: 'home' },
  { name: 'Features', href: '#features', id: 'features' },
  { name: 'About', href: '#about', id: 'about' },
  { name: 'Properties', href: '#properties', id: 'properties' },
  { name: 'Contact Us', href: 'contact', id: 'contact' },
];

const brandOrange = 'bg-[#FF4500]';

export default function Navbar({ auth }) {
  const [activeLink, setActiveLink] = useState('home');
  const [isOpen, setIsOpen] = useState(false); // MOBILE MENU STATE

  return (
    <nav className="fixed w-full z-30 top-0 left-0 bg-black/10 backdrop-blur-sm py-4 px-2  transition duration-300">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center space-x-[-20px]">
          <img src={Logo} alt="RentHouse Logo" className="h-12 w-20 relative ml-[-30px] " />
          <span className="text-[#222222] text-3xl font-extrabold tracking-tighter">
            RentHouse
          </span>
        </div>

        {/* DESKTOP NAV LINKS */}
        <div className="hidden md:flex space-x-8 items-center">
          {navItems.map((item) => (
            <div
              key={item.id}
              className="relative group cursor-pointer"
              onClick={() => setActiveLink(item.id)}
            >
              <a
                href={item.href}
                className={`text-[#222222] text-lg font-medium transition duration-300 ${
                  activeLink === item.id
                    ? 'text-orange-400'
                    : 'hover:text-orange-200'
                }`}
              >
                {item.name}
              </a>

              <div
                className={`absolute bottom-0 left-0 h-0.5 ${brandOrange} transition-all duration-300 ease-out 
                ${
                  activeLink === item.id
                    ? 'w-full'
                    : 'w-0 group-hover:w-1/2'
                }`}
              ></div>
            </div>
          ))}
        </div>

        {/* DESKTOP AUTH BUTTONS */}
        <div className="hidden md:flex items-center gap-4">
          {auth?.user ? (
            <Link
              href={route('dashboard')}
              className="font-semibold text-gray-600 hover:text-orange-600 transition"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href={route('login')}
                className="font-bold text-gray-600 hover:text-orange-600 text-[18px] transition"
              >
                Log in
              </Link>

              <Link
                href={route('register')}
                className="px-4 py-2 bg-orange-500 text-white rounded-full font-medium hover:bg-gray-800 transition"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="space-y-1">
            <span className={`block h-0.5 w-6 bg-gray-800 transition ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block h-0.5 w-6 bg-gray-800 transition ${isOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block h-0.5 w-6 bg-gray-800 transition ${isOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
          </div>
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="md:hidden bg-white shadow-lg rounded-b-2xl mt-3 mx-4 p-4 space-y-4"
        >
          {/* Nav Links */}
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => {
                  setActiveLink(item.id);
                  setIsOpen(false);
                }}
                className={`text-lg font-medium hover:bg-gray-100 rounded-full flex justify-center ${
                  activeLink === item.id
                    ? 'text-orange-500'
                    : 'text-gray-700'
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>

          <hr />

          {/* Auth Buttons */}
          <div className="flex flex-col gap-3">
            {auth?.user ? (
              <Link
                href={route('dashboard')}
                className="text-gray-700 font-semibold text-center bg-gray-200 rounded-full px-4 py-2 hover:bg-gray-300 hover:scale-105 transition"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href={route('login')}
                  className="text-gray-700 font-semibold text-center bg-gray-200 rounded-full px-4 py-2 hover:bg-gray-300 hover:scale-105 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Log in
                </Link>

                <Link
                  href={route('register')}
                  className="w-full text-center px-4 py-2 bg-orange-500 text-white rounded-full font-medium hover:scale-105 hover:bg-orange-600 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
