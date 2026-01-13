import React from 'react';
import { motion } from 'framer-motion'; 
import { Heart, MapPin } from 'lucide-react'; 


const brandOrange = 'bg-[#FF4500]'; 



const PropertyCard = ({ property }) => {
    return (

        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{ y: -5 }} // Subtle lift on hover
            className="relative bg-white rounded-xl shadow-xl overflow-hidden group transition-all duration-300"
        >
      
            {/* Property Image Container */}
            <div className="h-56 overflow-hidden">
                <img
                    src={property.image}
                    alt={property.name}
                    // The image uses scale-100 by default and zooms to scale-110 on hover
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-100 transition-transform duration-500 ease-in-out"
                />
        
                
        
                {/* Favorite Button */}
                <button className="absolute top-4 right-4 bg-white/70 backdrop-blur-sm p-2 rounded-full text-gray-700 hover:text-red-500 transition duration-300">
                    <Heart size={18} fill="currentColor" />
                </button>
            </div>

            {/* Details Section */}
            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-orange-600 transition duration-300">
                        {property.name}
                    </h3>
                    {/* <span className="text-2xl font-extrabold text-black ml-4">
                        N{property.price}
                    </span> */}
                </div>

                <p className="text-gray-500 flex items-center mb-4">
                    <MapPin size={16} className="mr-1.5 text-orange-400" />
                    {property.location}
                </p>

                {/* Feature Icons */}
                {/* <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                    <div className="flex items-center text-gray-600 text-sm">
                        <Bed size={16} className="mr-1 text-orange-500" /> {property.beds} Beds
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                        <Bath size={16} className="mr-1 text-orange-500" /> {property.baths} Baths
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                        <Maximize size={16} className="mr-1 text-orange-500" /> {property.sqft} sqft
                    </div>
                </div> */}
            </div>
        </motion.div>
    );
};
export default PropertyCard;