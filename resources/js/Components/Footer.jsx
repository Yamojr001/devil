import React from 'react';
import { Mail, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'; 
import { SiTiktok, SiX } from "react-icons/si";
import Logo from '../../images/Logo.png';

const brandOrange = 'bg-[#FF4500]'; 

const Footer = () => {
  return (
    <footer className="bg-[#222222] text-gray-300 font-jakartaSans">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        
        {/* Top Section: Grid Layout for Links, Contact, and Newsletter */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 border-b border-gray-700 pb-12 mb-12">
          
          {/* Column 1: Logo and Brand Slogan (Spans 2 columns on mobile) */}
            <div className="col-span-2 md:col-span-2">
            <div className='flex justify'>   
            <img src={Logo} alt="RentHouse Logo" className="h-12 w-20 ml-[-20px] mt-1 " />
            <h3 className="text-3xl font-extrabold text-white  tracking-tight ml-10 absolute mt-3">
              RentHouse
            </h3></div>
            <p className="text-gray-400 max-w-xs">
              We make managing your rentals easier than ever. Find your next home with ease.
            </p>
            
            {/* Social Icons */}
            <div className="flex space-x-4 mt-6">
              <a href="https://www.facebook.com/share/1AWKCB6mAC/" className="text-gray-400 hover:text-orange-500 transition duration-300">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition duration-300">
                <SiX size={24} />
              </a>
              <a href="https://www.instagram.com/renthousehq?igsh=MWI5eXY1c2pyNzVtcw==&utm_source=ig_contact_invite" className="text-gray-400 hover:text-orange-500 transition duration-300">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition duration-300">
                <SiTiktok size={24} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Explore</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#properties" className="hover:text-white transition duration-200">Listings</a></li>
              <li><a href="#about" className="hover:text-white transition duration-200">About Us</a></li>
              <li><a href="/agents" className="hover:text-white transition duration-200">Our Agents</a></li>
              <li><a href="/faq" className="hover:text-white transition duration-200">FAQ</a></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Info</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/blog" className="hover:text-white transition duration-200">Blog</a></li>
              <li><a href="/terms" className="hover:text-white transition duration-200">Terms & Conditions</a></li>
              <li><a href="/privacy" className="hover:text-white transition duration-200">Privacy Policy</a></li>
              <li><a href="/sitemap" className="hover:text-white transition duration-200">Sitemap</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Section: Copyright and Legal */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} RentHouse. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="/terms" className="hover:text-white">Terms</a>
            <a href="/privacy" className="hover:text-white">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;