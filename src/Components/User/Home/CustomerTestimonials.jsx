import React from 'react';
import { motion } from 'framer-motion';
import { FaUserCircle } from 'react-icons/fa';

function CustomerTestimonials() {
  const testimonials = [
    { name: 'John Doe', feedback: 'The booking process was seamless and the bike was in excellent condition. Highly recommended!' },
    { name: 'Priya Sharma', feedback: 'Loved the ride! Great customer service and affordable rates.' },
    { name: 'David Kim', feedback: 'Booking was fast, and the bike performed very well on long rides. Will book again!' },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#030712] via-black to-[#030712] text-white border-b border-neutral-900">
      <motion.h2
        initial={{ y: -30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center text-4xl font-extrabold mb-20 tracking-wider font-passion uppercase"
      >
        Customer Testimonials
      </motion.h2>

      <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 px-6 max-w-7xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, type: 'spring', stiffness: 100 }}
            className="flex flex-col items-center max-w-sm w-full relative group justify-between"
          >
            {/* The Speech Bubble Card */}
            <div className="relative bg-[#0B132B]/60 border border-[#1E293B] shadow-2xl backdrop-blur-md text-white p-8 rounded-2xl w-full mb-8 group-hover:border-yellow-400/30 hover:shadow-yellow-400/5 transition-all duration-300 group-hover:-translate-y-1.5 flex-grow">
              <span className="absolute top-2 left-4 text-6xl text-yellow-400/20 font-serif leading-none select-none">“</span>
              <p className="text-gray-300 italic text-sm leading-relaxed text-center relative z-10 pt-2">
                {testimonial.feedback}
              </p>
              {/* Bubble Arrow Pin Outline & Fill */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-t-[8px] border-t-[#0b132beb] border-x-8 border-x-transparent z-10"></div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-t-[9px] border-t-[#1E293B] border-x-[9px] border-x-transparent"></div>
            </div>

            {/* User Details */}
            <div className="flex items-center gap-3">
              <div className="text-yellow-400 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                <FaUserCircle size={36} />
              </div>
              <h4 className="text-sm font-bold text-white tracking-wide">{testimonial.name}</h4>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default CustomerTestimonials;
