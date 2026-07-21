import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'
import { adminApi } from '../../../config/api'
import { useDispatch } from 'react-redux'
import { addAdmin } from '../../../utils/adminSlice'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { RiShieldUserLine } from 'react-icons/ri'
import { FiMail, FiLock } from 'react-icons/fi'

function AdminLogin() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const initialValues = { email: "", password: "" }
    const [formValues, setFormValues] = useState(initialValues)
    const [formErrors, setFormErrors] = useState({})
    const [isSubmit, setIsSubmit] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { value, name } = e.target;
        const newvalue = value.trim()
        setFormValues({ ...formValues, [name]: newvalue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errors = validate(formValues)
        setFormErrors(errors)
        setIsSubmit(true)

        if (Object.keys(errors).length === 0) {
            setLoading(true)
            try {
                const response = await Axios.post(`${adminApi}/login`, formValues)
                if (response.data.success) {
                    const token = response.data.data.token
                    localStorage.setItem('adminToken', JSON.stringify(token));
                    dispatch(addAdmin({ token: token, username: response.data.data.name }))
                    toast.success(response.data.message);
                    navigate('/admin')
                } else {
                    toast.error(response.data.message)
                }
            } catch (error) {
                console.error(error);
                toast.error("Internal Server Error. Please try again.")
            } finally {
                setLoading(false)
            }
        }
    }

    const validate = (values) => {
        const errors = {}
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const hasUppercase = /[A-Z]/;
        const hasLowercase = /[a-z]/;
        const hasNumber = /\d/;

        if (!values.email) {
            errors.email = "Email is required!"
        } else if (!regex.test(values.email)) {
            errors.email = "This is not a valid email"
        }
        if (!values.password) {
            errors.password = "Password is required!"
        } else if (!hasUppercase.test(values.password)) {
            errors.password = "At least one uppercase letter required"
        } else if (!hasLowercase.test(values.password)) {
            errors.password = "At least one lowercase letter required"
        } else if (!hasNumber.test(values.password)) {
            errors.password = "At least one number required"
        } else if (values.password.length < 8) {
            errors.password = "Length must be at least 8 characters"
        }
        return errors;
    }

    return (
        <div className="w-full min-h-screen relative flex items-center justify-center bg-[#0A0F1D] overflow-hidden px-4">
            {/* Glowing neon bg spots */}
            <div className="absolute top-[-10%] left-[-10%] w-[30rem] h-[30rem] sm:w-[45rem] sm:h-[45rem] rounded-full bg-sky-500/10 blur-[130px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] sm:w-[45rem] sm:h-[45rem] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none"></div>

            {/* Subtle background mesh patterns */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-[24rem] bg-[#111C3A]/40 backdrop-blur-xl border border-[#1E2E5B]/50 rounded-2xl p-6 sm:p-8 shadow-[0_0_60px_rgba(14,165,233,0.1)] z-10"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-sky-500/10 border border-sky-400/30 rounded-xl flex items-center justify-center text-sky-400 mb-3 shadow-[0_0_15px_rgba(14,165,233,0.2)]">
                        <RiShieldUserLine size={24} />
                    </div>
                    <h2 className="text-2xl font-extrabold text-white tracking-tight">Admin Portal</h2>
                    <p className="text-xs text-slate-400 mt-1 font-medium">RevOn Rentals dashboard management</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                                <FiMail size={16} />
                            </span>
                            <input
                                type="text"
                                placeholder="name@example.com"
                                className="bg-[#0B132B]/80 border border-[#1E2E5B]/60 text-slate-200 placeholder-slate-600 rounded-lg py-2.5 pl-10 pr-4 w-full focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all duration-150 text-sm"
                                value={formValues.email}
                                onChange={handleChange}
                                name="email"
                            />
                        </div>
                        {formErrors.email && (
                            <p className="text-[11px] text-rose-400 mt-1.5 text-left font-semibold pl-1">
                                {formErrors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Security Password</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                                <FiLock size={16} />
                            </span>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="bg-[#0B132B]/80 border border-[#1E2E5B]/60 text-slate-200 placeholder-slate-600 rounded-lg py-2.5 pl-10 pr-4 w-full focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all duration-150 text-sm"
                                value={formValues.password}
                                onChange={handleChange}
                                name="password"
                            />
                        </div>
                        {formErrors.password && (
                            <p className="text-[11px] text-rose-400 mt-1.5 text-left font-semibold pl-1">
                                {formErrors.password}
                            </p>
                        )}
                    </div>

                    <div className="pt-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                            type="submit"
                            className="w-full bg-sky-600 hover:bg-sky-500 py-2.5 text-center text-white font-bold text-sm rounded-lg shadow-lg shadow-sky-500/20 active:shadow-none hover:shadow-sky-500/30 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "Access Dashboard"
                            )}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

export default AdminLogin;