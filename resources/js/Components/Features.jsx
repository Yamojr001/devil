import React from 'react';
import { motion } from 'framer-motion'; 
import { RefreshCw, Filter, Camera, Locate, Users, Bookmark } from 'lucide-react'; // Lucide Icons

const brandOrange = 'text-orange-500'; 
const brandBlack = 'text-gray-900';
const bgGray = 'bg-gray-100';


const platformFeatures = [
  { title: "Search by Category", description: "Filter by House, Shop, or Hotel.", icon: Camera },
  { title: "Advanced Filtering", description: "Filter by price, size, and location within Dutse.", icon: Filter },
  { title: "Verified Information", description: "See verified owner or agent information for trust.", icon: Users },
  { title: "Bookmark Listings", description: "Save your favorite listings to view later.", icon: Bookmark },
  { title: "Real-time Updates", description: "Get real-time updates on new available spaces.", icon: RefreshCw },
  { title: "Detailed Specs", description: "View full photos, descriptions, and property specs.", icon: Locate },
];

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i) => ({ 
    opacity: 1, 
    scale: 1, 
    transition: { delay: i * 0.1, duration: 0.4 } 
  }),
};


const Features = () => {
  return (
    <section className={`py-20 md:py-32 ${bgGray} font-jakartaSans`}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main Title Block */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl lg:5xl mb-6 font-extrabold ${brandBlack}`}>
            Features
          </h2>
          

            <div className="flex justify-center mb-6">
            <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: '100px' }} // Expands to 100px wide
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-1 bg-orange-500 rounded-full" 
            style={{ maxWidth: '200px' }} 
            ></motion.div>
            </div>


          <p className="text-gray-600 text-lg md:text-xl max-w-4xl mx-auto mt-4">
            Maximize your search potential with our powerful, user-friendly tools designed for the Dutse rental market.
          </p>
        </div>

        {/* Features Grid - Responsive Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {platformFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div 
                key={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                custom={index}
                className="p-8 bg-white rounded-xl shadow-lg border border-gray-100 hover:border-orange-500 transition duration-300 transform hover:-translate-y-1"
              >
                <IconComponent size={30} className={`mb-4 ${brandOrange}`} />
                <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-base">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Features;