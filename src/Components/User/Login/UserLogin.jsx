import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import bckimage from '../../../images/loginBackground.png'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { addUser } from '../../../utils/userSlice'
import { userLogin } from '../../../config/clientEndPoints'

function UserLogin() {
    const dispatch = useDispatch()

    const initialValues = { email: "", password: "" }
    const [formValues, setFormValues] = useState(initialValues)
    const [formErrors, setFormErrors] = useState({})
    const [isSubmit, setIsSubmit] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { value, name } = e.target;
        const newvalue = value.trim()
        setFormValues({ ...formValues, [name]: newvalue });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validate(formValues);
        setFormErrors(errors);
        setIsSubmit(true);
    }

    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            const submitForm = async (formValues) => {
                try {
                    const response = await userLogin(formValues)
                    if (response.data.success) {
                        localStorage.setItem('token', JSON.stringify(response.data.data.token));
                        dispatch(addUser({ token: response.data.data.token, username: response.data.data.username, id: response.data.data.id }))
                        toast.success(response.data.message);
                        navigate('/userProfile') // Optional: redirect on success
                    } else {
                        toast.error(response.data.message);
                    }
                } catch (error) {
                    toast.error('Something went wrong')
                }
            };
            submitForm(formValues);
        }
    }, [formErrors, isSubmit]);

    const validate = (values) => {
        const errors = {}
        const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const hasUppercase = /[A-Z]/;
        const hasLowercase = /[a-z]/;
        const hasNumber = /\d/;

        if (!values.email) {
            errors.email = "Email is required!"
        } else if (!regex.test(values.email)) {
            errors.email = "Invalid email"
        }

        if (!values.password) {
            errors.password = "Password is required!"
        } else if (!hasUppercase.test(values.password)) {
            errors.password = "At least one uppercase letter"
        } else if (!hasLowercase.test(values.password)) {
            errors.password = "At least one lowercase letter"
        } else if (!hasNumber.test(values.password)) {
            errors.password = "At least one number"
        } else if (values.password.length <= 8) {
            errors.password = "Minimum 8 characters"
        }

        return errors;
    }

    return (
        <div className='relative h-screen w-screen flex items-center justify-center bg-[#FFD93B] max-w-[1500px]'>
            {/* Background Image */}
            <img
                src={bckimage}
                className='absolute top-0 left-0 w-full h-full object-cover z-0'
                alt="Login Background"
            />
            {/* Black overlay */}
            <div className='absolute top-0 left-0 w-full h-full bg-black opacity-60 z-10'></div>

            {/* Login Card */}
            <div className="container mx-auto absolute z-20">
                <div className="flex flex-col bg-yellow-300 rounded-xl mx-auto shadow-xl overflow-hidden w-[21rem] sm:w-[24rem] px-5 py-6">
                    <h2 className="text-3xl text-center font-semibold mb-6 text-black">User Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Email"
                                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-black"
                                value={formValues.email}
                                onChange={handleChange}
                                name="email"
                            />
                            <p className='text-sm text-red-600 mt-1'>{formErrors.email}</p>
                        </div>

                        <div className="mb-4">
                            <input
                                type="password"
                                placeholder="Password"
                                className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-black"
                                value={formValues.password}
                                onChange={handleChange}
                                name="password"
                            />
                            <p className='text-sm text-red-600 mt-1'>{formErrors.password}</p>
                        </div>

                        <div className="flex justify-end mb-4">
                            <p
                                className='text-sm font-medium text-gray-600 hover:text-black cursor-pointer'
                                onClick={() => navigate('/forgotPassword')}
                            >
                                Forgot password?
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-black text-white font-bold py-2 rounded-md hover:bg-gray-900 transition-all hover:text-yellow-400"
                        >
                            Login
                        </button>
                    </form>
                </div>

                <div className="mt-4 text-center">
                    <p className='text-white'>Don't have an account?
                        <span
                            onClick={() => navigate('/register')}
                            className='text-gray-200 hover:text-yellow-300  cursor-pointer ml-2 underline'
                        >
                            Register Now
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default UserLogin
