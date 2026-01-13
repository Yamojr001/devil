import React from 'react';
import PropertyCard from './PropertyCard2';   
import { motion } from 'framer-motion';
import image1 from '../../images/propty3.jpeg'
import image2 from '../../images/propty4.jpeg'
import image3 from '../../images/propty1.jpeg'
import image4 from '../../images/propty5.jpeg'

const mockProperties = [
  { id: 1, name: "Master Bedroom", location: "Indian Quaters, Dutse", price: "115K", isNew: true, image: image1 },
  { id: 2, name: "Sitting Area", location: "Indian Quaters, Dutse", price: "180K", image: image2 },
  { id: 3, name: "Guest Bedroom", location: "Indian Quaters, Dutse", price: "70K", image: image3 },
  { id: 4, name: "Cooking Area", location: "Indian Quaters, Dutse ", price: "125K", image: image4 },

];

const PropertyListingSection = () => {
  return (
    <section className="py-20 bg-white " id='properties'>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
                 <motion.h2 
                  
                   className={`text-5xl md:text-5xl lg:text-5xl text-gray-900 font-extrabold mb-6 `}
                 >
                   Featured Properties
                 </motion.h2>
       
                   <div className="flex justify-center mb-6">
       
                   <motion.div 
                     initial={{ width: 0 }}
                     whileInView={{ width: '100px' }} // Expands to 100px wide
                     viewport={{ once: true, amount: 0.8 }}
                     transition={{ duration: 0.8, delay: 0.4 }}
                     className="h-1 bg-orange-500 rounded-full" 
                     style={{ maxWidth: '200px' }} // Ensures it doesn't expand past this width if motion fails
                   ></motion.div>
                 </div>
          <p className="text-gray-600 text-lg mt-2">
            Explore our curated selection of verified homes for rent and sale.
          </p>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {mockProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertyListingSection;