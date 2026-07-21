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
    <section className="py-20 bg-gradient-to-b from-[#030712] via-black to-[#030712] text-white border-b border-neutral-900">
      <motion.h2
        initial={{ y: -30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center text-4xl font-extrabold mb-16 tracking-wider font-passion uppercase"
      >
        Why Choose Us
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 max-w-7xl mx-auto">
        {reasons.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, type: 'spring', stiffness: 100 }}
            className="bg-[#0B132B]/60 border border-[#1E293B] shadow-2xl backdrop-blur-md text-white p-8 rounded-2xl w-full hover:-translate-y-1.5 hover:border-yellow-400/30 hover:shadow-yellow-400/5 transform transition-all duration-300 flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="mb-6 p-4 bg-[#111C3A]/80 border border-[#1E293B] rounded-full text-yellow-400 group-hover:scale-110 group-hover:bg-yellow-400 group-hover:text-black transition-all duration-300">
              {item.icon}
            </div>
            <h3 className="text-xl font-bold mb-3 tracking-wide text-white">{item.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default WhyChooseUs;
