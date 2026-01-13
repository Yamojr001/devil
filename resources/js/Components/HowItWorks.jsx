import React from 'react';
import { motion } from 'framer-motion'; 
import { Search, ListChecks, Mail, Bookmark } from 'lucide-react';

const brandOrange = 'text-orange-500'; 
const brandBlack = 'text-gray-900';
const bgGray = 'bg-gray-50';

// Data for the How It Works steps
const workSteps = [
  { 
    title: "Browse Listings", 
    description: "Browse houses, shops, or hotels for rent within Dutse.", 
    icon: Search 
  },
  { 
    title: "View Full Details", 
    description: "Access price, location, photos, and property specs on one page.", 
    icon: ListChecks 
  },
  { 
    title: "Contact Directly", 
    description: "Contact the verified owner or agent directly through the platform.", 
    icon: Mail 
  },
  { 
    title: "Book & Reserve", 
    description: "Book a visit or reserve the space instantly online.", 
    icon: Bookmark 
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ 
    opacity: 1, 
    y: 0, 
    transition: { delay: i * 0.15, duration: 0.5 } 
  }),
};


const HowItWorks = () => {
  return (
    <section className={`py-20 md:py-32 ${bgGray} `} id='features'>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main Title Block */}
        <div className="text-center mb-6">
          <h2 className={`text-4xl md:text-5xl lg:text-5xl mb-6 font-extrabold ${brandBlack}`}>
            How It Works
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
            Our platform helps individuals discover available houses, shops, and hotels for rent within Dutse. Instead of relying on physical trips or word-of-mouth, search everything online within minutes.
          </p>
        </div>

        {/* Steps Grid - Responsive 1/2 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {workSteps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <motion.div 
                key={index}
                
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                custom={index}
                className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-500 transform hover:-translate-y-2 relative"
              >
                {/* Step Number Badge */}
                <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold text-lg shadow-md`}>
                    {index + 1}
                </div>
                
                {/* Icon */}
                <div className={`w-14 h-14 flex items-center justify-center rounded-full bg-orange-100 ${brandOrange} mx-auto mb-4 mt-6`}>
                  <IconComponent size={24} />
                </div>
                
                <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                <p className="text-gray-600 text-base">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
};

export default HowItWorks;