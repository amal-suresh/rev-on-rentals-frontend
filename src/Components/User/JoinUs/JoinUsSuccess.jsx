import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import bikeImg from '../../../images/HusqvarnaVitpilen701.jpeg'
import UserFooter from '../Footer/UserFooter'
import { FiCheckCircle, FiUser, FiFileText, FiMapPin, FiCreditCard } from 'react-icons/fi'

function JoinUsSuccess() {
    return (
        <div className='w-full min-h-screen bg-black flex flex-col justify-between relative text-slate-100'>
            <Navbar />

            {/* Background Image and overlay */}
            <div className='absolute inset-0 w-full h-full z-0'>
                <img
                    src={bikeImg}
                    className='w-full h-full object-cover'
                    alt="Join Us Success Background"
                />
                <div className='absolute inset-0 bg-[#0A0F1D]/80'></div>
            </div>

            {/* Success Card Wrapper */}
            <div className="relative z-10 flex-grow flex items-center justify-center py-20 mt-20 px-4">
                <div className="max-w-2xl w-full bg-[#0B132B]/85 border border-[#1E293B] shadow-2xl backdrop-blur-md rounded-2xl p-8 sm:p-10 flex flex-col items-center">

                    {/* Glowing outer circle around success check icon */}
                    <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <FiCheckCircle size={44} className="text-emerald-400" />
                    </div>

                    <h2 className="text-3xl sm:text-4xl text-center font-extrabold mb-3 text-white tracking-wide uppercase font-passion">
                        Registration Successful!
                    </h2>
                    <p className="mb-8 text-center text-sm font-semibold text-yellow-400 tracking-wider">
                        You have taken the first step to becoming a Rev-On rental partner.
                    </p>

                    <div className="w-full border-t border-slate-800 my-2 pt-6">
                        <h3 className="text-white text-md font-bold mb-4 uppercase tracking-widest text-center sm:text-left">
                            Next Steps: Completing Profile Verification
                        </h3>
                        <p className="text-xs text-slate-350 leading-relaxed mb-6">
                            To ensure safety and financial compliance across our rental network, all partners must be verified before listing bikes. Please log in to your dashboard to complete:
                        </p>

                        {/* List of actions needed in the profile */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            <div className="flex items-start gap-3 p-3 bg-[#111C3A]/45 border border-slate-800/80 rounded-xl hover:border-yellow-400/20 transition-all">
                                <div className="p-2 bg-yellow-400/10 rounded-lg text-yellow-400">
                                    <FiUser size={18} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Basic Details</h4>
                                    <p className="text-[11px] text-slate-400 mt-0.5">Upload a professional photo and specify your base city.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-[#111C3A]/45 border border-slate-800/80 rounded-xl hover:border-yellow-400/20 transition-all">
                                <div className="p-2 bg-yellow-400/10 rounded-lg text-yellow-400">
                                    <FiFileText size={18} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Identity Verification</h4>
                                    <p className="text-[11px] text-slate-400 mt-0.5">Provide Aadhaar, PAN card, and GST number for billing.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-[#111C3A]/45 border border-slate-800/80 rounded-xl hover:border-yellow-400/20 transition-all">
                                <div className="p-2 bg-yellow-400/10 rounded-lg text-yellow-400">
                                    <FiMapPin size={18} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Pickup / Drop Points</h4>
                                    <p className="text-[11px] text-slate-400 mt-0.5">Define physical locations where users pick up your bikes.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 bg-[#111C3A]/45 border border-slate-800/80 rounded-xl hover:border-yellow-400/20 transition-all">
                                <div className="p-2 bg-yellow-400/10 rounded-lg text-yellow-400">
                                    <FiCreditCard size={18} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Bank Details</h4>
                                    <p className="text-[11px] text-slate-400 mt-0.5">Direct deposit credentials and UPI ID for payouts.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            to="/partner/login"
                            className="w-full sm:w-auto px-8 py-3 bg-yellow-400 hover:bg-yellow-500 font-extrabold text-black text-center text-xs tracking-wider rounded-lg shadow-lg shadow-yellow-400/10 hover:shadow-yellow-400/20 transition-all duration-150 uppercase"
                        >
                            Log In to Partner Dashboard
                        </Link>
                        <Link
                            to="/"
                            className="w-full sm:w-auto px-8 py-3 border border-slate-800 hover:border-slate-700 bg-transparent text-slate-300 font-bold text-center text-xs tracking-wider rounded-lg hover:text-white transition-all duration-150 uppercase"
                        >
                            Return to Homepage
                        </Link>
                    </div>
                </div>
            </div>

            <div className="relative z-10 w-full">
                <UserFooter />
            </div>
        </div>
    )
}

export default JoinUsSuccess
