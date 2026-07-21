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
    <section className="py-20 bg-gradient-to-b from-[#030712] via-black to-[#030712] text-white border-b border-neutral-900 overflow-hidden">
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center text-4xl font-extrabold mb-20 tracking-wider font-passion uppercase"
      >
        How It Works
      </motion.h2>

      {/* Timeline container */}
      <div className="relative max-w-5xl mx-auto px-6">
        {/* Continuous center vertical line */}
        <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-yellow-400 via-yellow-500/40 to-neutral-800"></div>

        <div className="space-y-16">
          {steps.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-start md:items-center ${isEven ? 'md:flex-row-reverse' : ''
                  } relative`}
              >
                {/* Visual Dot Step Counter */}
                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center z-10">
                  <div className="w-12 h-12 rounded-full bg-black border-2 border-yellow-400 flex items-center justify-center font-bold text-yellow-400 text-base shadow-lg shadow-yellow-400/20">
                    {index + 1}
                  </div>
                </div>

                {/* Content Panel */}
                <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${isEven ? 'md:pr-16 md:text-right flex md:justify-end' : 'md:pl-16'
                  }`}>
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                    viewport={{ once: true }}
                    className="p-8 bg-[#0B132B]/60 border border-[#1E293B] backdrop-blur-md rounded-2xl shadow-xl hover:border-yellow-400/30 hover:shadow-yellow-400/5 transition-all duration-300 group hover:-translate-y-1 w-full max-w-md"
                  >
                    <div className={`inline-flex p-3 bg-[#111C3A] rounded-xl text-yellow-400 mb-4 group-hover:scale-110 group-hover:bg-yellow-400 group-hover:text-black transition-all duration-300`}>
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2 tracking-wide text-white">{item.step}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
