import React from 'react';
import { motion } from 'framer-motion';
import { FaMotorcycle, FaMoneyBillWave, FaRegCalendarCheck, FaHeadset } from 'react-icons/fa';

function WhyChooseUs() {
  const reasons = [
    { icon: <FaMotorcycle size={40} />, title: 'Wide Range of Bikes', desc: 'Choose from a variety of bikes suited for every ride.' },
    { icon: <FaMoneyBillWave size={40} />, title: 'Affordable Pricing', desc: 'Best value for money with flexible rental plans.' },
    { icon: <FaRegCalendarCheck size={40} />, title: 'Easy Booking', desc: 'Quick and simple online booking process.' },
    { icon: <FaHeadset size={40} />, title: '24/7 Support', desc: 'We are here for you anytime during your journey.' },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <motion.h2
        initial={{ y: -30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center text-4xl font-extrabold mb-16"
      >
        Why Choose Us
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-6 max-w-7xl mx-auto">
        {reasons.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, type: 'spring', stiffness: 120 }}
            className="bg-white text-black p-8 rounded-3xl shadow-2xl hover:scale-105 transform transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className="mb-4 text-yellow-500">
              {item.icon}
            </div>
            <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default WhyChooseUs;
