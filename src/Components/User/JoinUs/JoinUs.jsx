import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import bikeImg from '../../../images/HusqvarnaVitpilen701.jpeg'
import toast from 'react-hot-toast'
import { registerPartnerRequest } from '../../../config/partnerEndPoints'
import UserFooter from '../Footer/UserFooter'

function JoinUs() {
    const navigate = useNavigate()
    const initialValues = { fname: "", email: "", password: "", lname: "", confirmPassword: "", phone: "" }
    const [formValues, setFormValues] = useState(initialValues)
    const [formErrors, setFormErrors] = useState({})

    const handleChange = (e) => {
        const { value, name } = e.target;
        const newvalue = value.trim()
        setFormValues({ ...formValues, [name]: newvalue, });
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        const errors = validate(formValues)
        setFormErrors(errors)
        if (Object.keys(errors).length === 0) {
            const submitForm = async (formValues) => {
                try {
                    const response = await registerPartnerRequest(formValues)
                    if (response.data.success) {
                        toast.success(response.data.message)
                        navigate('/join-us/success')
                    } else {
                        toast.error(response.data.message)
                    }
                } catch (error) {
                    console.log(error.message);
                }
            }
            submitForm(formValues)
        }
    }

    const validate = (values) => {
        const errors = {}
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const hasUppercase = /[A-Z]/;
        const hasLowercase = /[a-z]/;
        const hasNumber = /\d/;

        if (!values.fname) {
            errors.fname = "fname is required!"
        }
        if (!values.lname) {
            errors.lname = "lname is required!"
        }
        if (!values.email) {
            errors.email = "email is required!"
        } else if (!regex.test(values.email)) {
            errors.email = "This is not a valid email"
        }
        if (!values.phone) {
            errors.phone = "phone number is required!"
        } else if (!/^\d{10}$/.test(values.phone)) {
            errors.phone = "Must be a valid 10-digit number"
        }
        if (!values.password) {
            errors.password = "password is required!"
        } else if (!hasUppercase.test(values.password)) {
            errors.password = "At least one uppercase letter"
        } else if (!hasLowercase.test(values.password)) {
            errors.password = "At least one lowercase letter"
        } else if (!hasNumber.test(values.password)) {
            errors.password = "At least one number"
        } else if (values.password.length <= 8) {
            errors.password = "length should be 8"
        }
        if (!values.confirmPassword) {
            errors.confirmPassword = "confirm your password"
        } else if (values.confirmPassword !== values.password) {
            errors.confirmPassword = "password mismatch"
        }

        return errors;

    }


    return (
        <div className='w-full min-h-screen bg-black flex flex-col justify-between relative'>
            <Navbar />

            {/* Background Image and overlay underneath the card */}
            <div className='absolute inset-0 w-full h-full z-0'>
                <img
                    src={bikeImg}
                    className='w-full h-full object-cover'
                    alt="Join Us Background"
                />
                <div className='absolute inset-0 bg-black opacity-75'></div>
            </div>

            {/* Partner Register Card */}
            <div className="relative z-10 flex-grow flex items-center justify-center py-20 mt-20">
                <div className="container mx-auto flex flex-col items-center">
                    <div className="flex flex-col bg-[#0B132B]/85 border border-[#1E293B] shadow-2xl backdrop-blur-md rounded-2xl w-[21rem] sm:w-[24rem] px-6 py-8">
                        <h2 className="text-3xl text-center font-bold mb-2 text-white tracking-wider font-passion">PARTNER WITH US</h2>
                        <p className="mb-6 text-center text-xs font-semibold text-gray-400">Join our network and start earning today</p>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <input type="text" placeholder="First Name" className="bg-[#111C3A]/50 border border-neutral-700/60 rounded-md py-1.5 px-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all w-full" value={formValues.fname} onChange={handleChange} name="fname" />
                                    <p className='text-sm text-red-500 mt-1 font-semibold'>{formErrors.fname}</p>
                                </div>
                                <div>
                                    <input type="text" placeholder="Last Name" className="bg-[#111C3A]/50 border border-neutral-700/60 rounded-md py-1.5 px-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all w-full" value={formValues.lname} onChange={handleChange} name="lname" />
                                    <p className='text-sm text-red-500 mt-1 font-semibold'>{formErrors.lname}</p>
                                </div>
                            </div>

                            <div className="mt-4">
                                <input type="text" placeholder="Email" className="bg-[#111C3A]/50 border border-neutral-700/60 rounded-md py-1.5 px-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all w-full" value={formValues.email} onChange={handleChange} name="email" />
                                <p className='text-sm text-red-500 mt-1 font-semibold'>{formErrors.email}</p>
                            </div>

                            <div className="mt-4">
                                <input type="text" placeholder="Phone Number" className="bg-[#111C3A]/50 border border-neutral-700/60 rounded-md py-1.5 px-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all w-full" value={formValues.phone} onChange={handleChange} name="phone" />
                                <p className='text-sm text-red-500 mt-1 font-semibold'>{formErrors.phone}</p>
                            </div>

                            <div className="mt-4">
                                <input type="password" placeholder="Password" className="bg-[#111C3A]/50 border border-neutral-700/60 rounded-md py-1.5 px-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all w-full" value={formValues.password} onChange={handleChange} name="password" />
                                <p className='text-sm text-red-500 mt-1 font-semibold'>{formErrors.password}</p>
                            </div>

                            <div className="mt-4">
                                <input type="password" placeholder="Confirm Password" className="bg-[#111C3A]/50 border border-neutral-700/60 rounded-md py-1.5 px-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all w-full" name='confirmPassword' value={formValues.confirmPassword} onChange={handleChange} />
                                <p className='text-sm text-red-500 mt-1 font-semibold'>{formErrors.confirmPassword}</p>
                            </div>

                            <div className="mt-4 flex items-start gap-2">
                                <input type="checkbox" className="mt-1 border border-neutral-700 rounded accent-yellow-400 cursor-pointer" required />
                                <span className="text-xs text-gray-300">I accept the <a href="/#" className="text-yellow-400 font-semibold hover:underline">Terms of Use</a> & <a href="/#" className="text-yellow-400 font-semibold hover:underline">Privacy Policy</a></span>
                            </div>

                            <div className="mt-6">
                                <button type='submit' className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-extrabold py-2.5 rounded-md shadow-lg shadow-yellow-400/10 hover:shadow-yellow-400/20 transform hover:-translate-y-0.5 transition-all duration-200">
                                    REGISTER NOW
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div className="relative z-10 w-full">
                <UserFooter />
            </div>
        </div>
    )
}

export default JoinUs
    ;