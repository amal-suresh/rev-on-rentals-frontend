import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

const FAQs = [
    {
        question: "What documents are required to rent a bike?",
        answer: "You need to upload a valid original Driving License and possess a matching government ID card (Aadhaar, Passport, etc.) for verification at the pickup counter."
    },
    {
        question: "Is there a security deposit?",
        answer: "No! We have a zero-deposit policy on most of our standard bikes to ensure a hassle-free booking experience."
    },
    {
        question: "What is the fuel policy?",
        answer: "We provide vehicles with sufficient fuel to reach the nearest gas station. Please return the vehicle with equivalent fuel or pay fuel charges upon return."
    },
    {
        question: "Can I extend my ride duration mid-trip?",
        answer: "Yes, you can request an extension by contacting our support team, subject to bike availability and standard hourly tariffs."
    },
    {
        question: "How does the damage policy work?",
        answer: "In case of minor scratches or damages, standard repair pricing is charged. Users are highly advised to take a video/photos of the bike during pickup."
    }
];

function FAQ() {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black text-white w-full">
            <div className="max-w-4xl mx-auto px-6">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center text-4xl font-extrabold mb-12 tracking-wide font-passion"
                >
                    Frequently Asked Questions
                </motion.h2>

                <div className="space-y-4">
                    {FAQs.map((faq, index) => {
                        const isOpen = activeIndex === index;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 transition-all duration-300"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex justify-between items-center p-6 text-left focus:outline-none hover:bg-neutral-800 transition-colors duration-200"
                                >
                                    <span className="text-lg md:text-xl font-semibold text-gray-100 hover:text-white">
                                        {faq.question}
                                    </span>
                                    <motion.div
                                        animate={{ rotate: isOpen ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-yellow-400 ml-4 flex-shrink-0"
                                    >
                                        <FiChevronDown size={24} />
                                    </motion.div>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <div className="p-6 pt-0 text-gray-400 md:text-lg border-t border-neutral-800/50 mt-4 leading-relaxed">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default FAQ;
