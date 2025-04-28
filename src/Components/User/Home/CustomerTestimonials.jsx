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
    <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <motion.h2
        initial={{ y: -30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center text-4xl font-extrabold mb-16"
      >
        Customer Testimonials
      </motion.h2>

      <div className="flex flex-col md:flex-row justify-center items-center gap-10 px-6 max-w-7xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.3, type: 'spring', stiffness: 100 }}
            className="bg-white text-black p-8 rounded-3xl shadow-2xl hover:scale-105 transform transition-all duration-300 max-w-sm flex flex-col items-center"
          >
            <div className="mb-4 text-yellow-500">
              <FaUserCircle size={60} />
            </div>
            <p className="text-gray-700 mb-6 italic text-center">
              " {testimonial.feedback} "
            </p>
            <h4 className="text-lg font-bold text-gray-900">- {testimonial.name}</h4>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default CustomerTestimonials;
