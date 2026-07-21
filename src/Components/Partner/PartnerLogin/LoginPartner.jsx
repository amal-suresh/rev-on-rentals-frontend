import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import bckimage from '../../../images/loginBackground.png'
import Axios from 'axios'
import { partnerApi } from '../../../config/api'
import { useDispatch } from 'react-redux'
import { addPartner } from '../../../utils/partnerSlice'
import { toast } from 'react-hot-toast'
import Navbar from '../../User/Navbar/Navbar'
import UserFooter from '../../User/Footer/UserFooter'


function LoginPartner() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const initialValues = { email: "", password: "" }
    const [formValues, setFormValues] = useState(initialValues)
    const [formErrors, setFormErrors] = useState({})
    const [isSubmit, setIsSubmit] = useState(false)


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
                    const response = await Axios.post(`${partnerApi}/login`, formValues)
                    if (response.data.success) {
                        localStorage.setItem('partnerToken', JSON.stringify(response.data.data.token));
                        dispatch(addPartner({ token: response.data.data.token, username: response.data.data.username }))
                        toast.success(response.data.message);
                        navigate('/partner')
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
                    alt="Login Background"
                />
                <div className='absolute inset-0 bg-black opacity-75'></div>
            </div>

            {/* Partner Login Card */}
            <div className="relative z-10 flex-grow flex items-center justify-center py-20 mt-20">
                <div className="container mx-auto flex flex-col items-center">
                    <div className="flex flex-col bg-[#0B132B]/85 border border-[#1E293B] shadow-2xl backdrop-blur-md rounded-2xl w-[21rem] sm:w-[24rem] px-6 py-8">
                        <h2 className="text-3xl text-center font-bold mb-6 text-white tracking-wider font-passion">PARTNER LOGIN</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Email"
                                    className="bg-[#111C3A]/50 border border-neutral-700/60 rounded-md px-3 py-2 w-full text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
                                    value={formValues.email}
                                    onChange={handleChange}
                                    name="email"
                                />
                                <p className='text-sm text-red-500 mt-1 font-semibold'>{formErrors.email}</p>
                            </div>

                            <div className="mb-4">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="bg-[#111C3A]/50 border border-neutral-700/60 rounded-md px-3 py-2 w-full text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 transition-all"
                                    value={formValues.password}
                                    onChange={handleChange}
                                    name="password"
                                />
                                <p className='text-sm text-red-500 mt-1 font-semibold'>{formErrors.password}</p>
                            </div>

                            <div className="flex justify-end mb-6">
                                <p
                                    className='text-sm font-semibold text-yellow-400 hover:text-yellow-300 cursor-pointer transition-colors duration-200'
                                    onClick={() => navigate('/partner/forgotpass')}
                                >
                                    Forgot password?
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-extrabold py-2.5 rounded-md shadow-lg shadow-yellow-400/10 hover:shadow-yellow-400/20 transform hover:-translate-y-0.5 transition-all duration-200"
                            >
                                LOGIN
                            </button>
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

export default LoginPartner