import React from 'react';
import { motion } from 'framer-motion';
import { FaMotorcycle, FaCalendarCheck, FaMapMarkerAlt, FaSmileBeam } from 'react-icons/fa';

function HowItWorks() {
  const steps = [
    { icon: <FaMotorcycle size={40} />, step: 'Choose a Bike', desc: 'Browse and select the perfect bike for your trip.' },
    { icon: <FaCalendarCheck size={40} />, step: 'Book Online', desc: 'Reserve your bike easily through our secure booking system.' },
    { icon: <FaMapMarkerAlt size={40} />, step: 'Pick Up Location', desc: 'Collect the bike from your selected location.' },
    { icon: <FaSmileBeam size={40} />, step: 'Enjoy Your Ride!', desc: 'Ride freely and create unforgettable memories.' },
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-black via-gray-900 to-black text-white">
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center text-4xl font-extrabold mb-16"
      >
        How It Works
      </motion.h2>

      <div className="flex flex-wrap justify-center items-center gap-12 px-6 max-w-7xl mx-auto">
        {steps.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
            className="bg-white text-black p-8 rounded-3xl w-72 shadow-2xl hover:scale-105 transform transition-all duration-300 flex flex-col items-center"
          >
            <div className="mb-4 text-yellow-500">
              {item.icon}
            </div>
            <h3 className="text-2xl font-bold mb-2 text-center">{item.step}</h3>
            <p className="text-gray-600 text-center">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
