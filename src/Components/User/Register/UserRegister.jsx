import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import bckimage from '../../../images/loginBackground.png'
import { toast } from 'react-hot-toast'
import { checkEmialBeforeRegister } from '../../../config/clientEndPoints'
import Navbar from '../Navbar/Navbar'
import UserFooter from '../Footer/UserFooter'

function UserRegister() {

    const initialValues = { fname: "", email: "", password: "", lname: "", confirmPassword: "", mobile: "" }
    const [formValues, setFormValues] = useState(initialValues)
    const [formErrors, setFormErrors] = useState({})
    const [isSubmit, setIsSubmit] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { value, name } = e.target;
        const newvalue = value.trim()
        setFormValues({ ...formValues, [name]: newvalue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validate(formValues);
        setFormErrors(errors);
        setLoading(true)
        try {
            if (Object.keys(errors).length === 0) {
                const response = await checkEmialBeforeRegister(formValues.email)
                if (response.data.success) {
                    toast.success(response.data.message)
                    setIsSubmit(true);
                } else {
                    toast.error(response.data.message)
                }
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            navigate('/otp', { state: { formValues } })
        }
    }, [formErrors, isSubmit]);


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
        if (!values.mobile) {
            errors.mobile = "mobile number is required!"
        } else if (values.mobile.length !== 10) {
            errors.mobile = "enter 10 digits"
        }
        return errors;
    }

    return (
        <div className='w-full min-h-screen bg-black flex flex-col justify-between relative'>
            <Navbar />

            {/* Background Image and overlay underneath the card */}
            <div className='absolute inset-0 w-full h-full z-0'>
                <img
                    src={bckimage}
                    className='w-full h-full object-cover'
                    alt="Register Background"
                />
                <div className='absolute inset-0 bg-black opacity-75'></div>
            </div>

            {/* Register Card */}
            <div className="relative z-10 flex-grow flex items-center justify-center py-20 mt-20">
                <div className="container mx-auto flex flex-col items-center">
                    <div className="flex flex-col bg-[#0B132B]/85 border border-[#1E293B] shadow-2xl backdrop-blur-md rounded-2xl w-[21rem] sm:w-[24rem] px-6 py-8">
                        <h2 className="text-3xl text-center font-bold mb-6 text-white tracking-wider font-passion">USER REGISTER</h2>
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
                            <input type="number" placeholder="Mobile Number" className="bg-[#111C3A]/50 border border-neutral-700/60 rounded-md py-1.5 px-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" value={formValues.mobile} onChange={handleChange} name="mobile" />
                            <p className='text-sm text-red-500 mt-1 font-semibold'>{formErrors.mobile}</p>
                        </div>
                        <div className="mt-4">
                            <input type="password" placeholder="Password" className="bg-[#111C3A]/50 border border-neutral-700/60 rounded-md py-1.5 px-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all w-full" value={formValues.password} onChange={handleChange} name="password" />
                            <p className='text-sm text-red-500 mt-1 font-semibold'>{formErrors.password}</p>
                        </div>
                        <div className="mt-4">
                            <input type="password" placeholder="Confirm Password" className="bg-[#111C3A]/50 border border-neutral-700/60 rounded-md py-1.5 px-3 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all w-full" value={formValues.confirmPassword} onChange={handleChange} name="confirmPassword" />
                            <p className='text-sm text-red-500 mt-1 font-semibold'>{formErrors.confirmPassword}</p>
                        </div>
                        <div className="mt-6">
                            <button type='submit' disabled={loading} onClick={handleSubmit} className={`w-full py-2.5 text-center font-extrabold text-md rounded-md shadow-lg transition-all duration-200 ${loading ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500 text-black shadow-yellow-400/10 hover:shadow-yellow-400/20 transform hover:-translate-y-0.5'}`}>
                                {loading ? 'Registering...' : 'REGISTER'}
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <p className='text-gray-300 text-sm font-medium'>
                            Already Have Account?
                            <span
                                onClick={() => navigate('/login')}
                                className='text-yellow-400 hover:text-yellow-300 font-semibold cursor-pointer ml-2 underline transition-colors duration-200'
                            >
                                Login Now
                            </span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="relative z-10 w-full">
                <UserFooter />
            </div>
        </div>
    )
}

export default UserRegister;
