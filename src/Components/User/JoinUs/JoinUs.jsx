import React, { useState } from 'react'
import Navbar from '../Navbar/Navbar'
import bikeImg from '../../../images/HusqvarnaVitpilen701.jpeg'
import  toast  from 'react-hot-toast'
import { registerPartnerRequest } from '../../../config/partnerEndPoints'
import UserFooter from '../Footer/UserFooter'

function JoinUs() {

    const initialValues = { fname: "", email: "", password: "", lname: "",confirmPassword:"" }
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
        setFormErrors(validate(formValues))
        setIsSubmit(true)
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            const submitForm = async(formValues)=>{
                try {
                    const response =await registerPartnerRequest(formValues)
               if(response.data.success){
                    toast.success(response.data.message)
               }else{
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
        if (!values.password) {
            errors.password = "password is required!"
        } else if (!hasUppercase.test(values.password)) {
            errors.password = "At least one uppercase letter"
        }else if(!hasLowercase.test(values.password)){
            errors.password ="At least one lowercase letter"
        }else if(!hasNumber.test(values.password)){
            errors.password="At least one number"
        }else if(values.password.length<=8){
            errors.password="length should be 8"
        }
        if(!values.confirmPassword){
            errors.confirmPassword="confirm your password"
        }else if(values.confirmPassword!==values.password){
            errors.confirmPassword="password mismatch"
        }

        return errors;

    }


    return (
        <div className='max-w-[1600px]'>
            <Navbar />
            <div className=' flex justify-center items-center md:justify-start bg-cover bg-no-repeat bg-center h-[700px] w-full ' style={{ backgroundImage: `url(${bikeImg})` }}>
                <div className=' '>
                    <div className="container mx-auto pt-10 ">
                        <div className="flex flex-col lg:flex-row w-10/12 lg:w-8/12 bg-white rounded-xl mx-auto shadow-lg overflow-hidden   ">
                            <div className="w-full  py-6 px-12" >
                                <h2 className="text-2xl text-center font-semibold mb-4">Register as Partner</h2>
                                <p className="mb-4 font-light text-md text-gray-900">Create your account its free and only take one minute</p>
                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-2 gap-5">
                                        <input type="text" placeholder="First Name" className="border border-gray-400 py-1 px-2 rounded-lg" value={formValues.fname} onChange={handleChange} name="fname" />
                                        <input type="text" placeholder="Last Name" className="border border-gray-400 py-1 px-2  rounded-lg" value={formValues.lname} onChange={handleChange} name="lname" />
                                    </div>
                                    <div className='flex justify-between'><p className='text-sm text-red-600'>{formErrors.fname}</p><p className='text-sm text-red-600'>{formErrors.lname}</p></div>
                                    <div className="mt-5">
                                        <input type="text" placeholder="Email" className="border border-gray-400 py-1 px-2 w-full  rounded-lg" value={formValues.email} onChange={handleChange} name="email" />
                                    </div>
                                    <p className='text-sm text-red-600'>{formErrors.email}</p>
                                    <div className="mt-5">
                                        <input type="password" placeholder="Password" className="border border-gray-400 py-1 px-2 w-full  rounded-lg" value={formValues.password} onChange={handleChange} name="password" />
                                    </div>
                                    <p className='text-sm text-red-600'>{formErrors.password}</p>
                                    <div className="mt-5">
                                        <input type="password" placeholder="Confirm Password" className="border border-gray-400 py-1 px-2 w-full  rounded-lg" name='confirmPassword' value={formValues.confirmPassword} onChange={handleChange} />
                                    </div>
                                    <p className='text-sm text-red-600'>{formErrors.confirmPassword}</p>
                                    <div className="mt-5">
                                        <input type="checkbox" className="border border-gray-400" />
                                        <span>I accept the <a href="/#" className="text-yellow-400 font-semibold">Terms of Use</a> & <a href="/#" className="text-yellow-400 font-semibold ">Privacy Policy</a></span>
                                    </div>
                                    <div className="mt-5">
                                        <button className="w-full bg-yellow-400 py-3 text-center  rounded-xl hover:bg-black  text-white ">Register Now</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <UserFooter/>
        </div>
    )
}

export default JoinUs;