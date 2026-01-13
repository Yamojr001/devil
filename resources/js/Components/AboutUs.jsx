import React from 'react';
import { motion } from 'framer-motion'; 
import { Home, GraduationCap, Building, Briefcase, User } from 'lucide-react'; 

const brandOrange= 'bg-[#FF4500]'; 
const brandWhite = 'text-white';
const brandBlack = 'text-gray-900';


const audienceGroups = [
  { 
    title: "Students", 
    description: "Accommodation near FUD or anywhere else in Dutse.", 
    icon: GraduationCap 
  },
  { 
    title: "NYSC corp Members", 
    description: "Searching for a comfortable place to stay.", 
    icon: Home 
  },
  { 
    title: "Entrepreneurs", 
    description: "Needing shops or business spaces to set up a venture.", 
    icon: Building 
  },
  { 
    title: "Visitors", 
    description: "Seeking short-term or hotel rooms in Dutse.", 
    icon: Briefcase 
  },
];


const MissionAndAudience = () => {
    
  const missionVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
  };
    
  return (
    <section className="py-20 md:py-32 bg-white " id='about'>
      <div className="max-w-7xl mx-auto px-6">

        {/* OUR MISSION */}
        <motion.div 
            variants={missionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            className={`p-8 md:p-12 rounded-2xl bg-gray-600 text-center shadow-2xl mb-20`}
        >
            <h2 className={`text-3xl md:text-5xl font-extrabold text-white mb-4`}>
                Our Mission
            </h2>
            <p className={`text-xl md:text-2xl font-medium ${brandWhite} max-w-4xl mx-auto`}>
                To make rental discovery in Dutse simple, transparent, and accessible. We aim to connect property owners with individuals who are actively searching, removing the usual stress and uncertainty that comes with finding a place.
            </p>
        </motion.div>


        {/*  TARGET AUDIENCE - Who We Built It For */}
        <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl lg:text-5xl mb-6 font-extrabold ${brandBlack}`}>
                Who We Built It For
          </h2>
          

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

            <p className="text-gray-600 text-lg md:text-xl max-w-4xl mx-auto mt-4">
                If your goal is to find a place to stay or set up a business within Dutse, this platform is for you.
            </p>
        </div>
        
        {/* Audience Grid - Responsive Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {audienceGroups.map((group, index) => {
                const IconComponent = group.icon;
                return (
                    <div 
                        key={index}
                        // motion.div
                        // initial={{ opacity: 0, scale: 0.8 }}
                        // whileInView={{ opacity: 1, scale: 1 }}
                        // viewport={{ once: true, amount: 0.8 }}
                        // transition={{ delay: index * 0.1 }}
                        className="p-6 text-center rounded-xl border-2 border-gray-100 hover:border-orange-500 transition duration-300 transform hover:shadow-lg"
                    >
                        <IconComponent size={40} className={`mx-auto mb-3 p-1 rounded-full bg-orange-500`} />
                        <h4 className="text-xl font-bold mb-1">{group.title}</h4>
                        <p className="text-gray-500 text-sm">{group.description}</p>
                    </div>
                );
            })}
        </div>
        
        {/* Final CTA/Reinforcement */}
        <div className="mt-16 text-center">
            <div className={`inline-flex items-center p-3 rounded-full bg-orange-100 ${brandOrange} font-semibold`}>
                <User size={18} className="mr-2" />
                Anyone relocating or working within Dutse
            </div>
        </div>

      </div>
    </section>
  );
};

export default MissionAndAudience;