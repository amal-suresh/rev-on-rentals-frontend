import React, { useState, useEffect } from 'react'
import SideBarPartner from '../PartnerSideBar/SideBarPartner'
import { GiHamburgerMenu } from 'react-icons/gi'
import { AiOutlineClose, AiOutlinePlusCircle, AiOutlinePlusSquare } from 'react-icons/ai'
import { FaMapLocationDot } from 'react-icons/fa6'
import { partnerApi } from '../../../config/api'
import { toast } from 'react-hot-toast'
import Axios from 'axios'
import { useSelector ,useDispatch} from 'react-redux'
import { addPartner } from '../../../utils/partnerSlice'

function PartnerProfile() {
    const dispatch=useDispatch()
    const [isOpen, setIsOpen] = useState(false)
    const [partnerDetails, setPartnerDetails] = useState({})
    const [modalStatus, setModalStatus] = useState(false)
    const [editData, setEditData] = useState({})
    const [profileImg, setProfileImg] = useState(null)
    const [profileUrl, setProfileUrl] = useState(null)
    const [proof, setProof] = useState({ aadhaar: null, pan: null })
    const [aadhaar, setAadhaarUrl] = useState(partnerDetails.aadhaar)
    const [pan, setPanUrl] = useState(partnerDetails.pan)
    const [point, setPoint] = useState('')



    const partner = useSelector((store) => store.partner.partnerD)
    const token = partner.token

    const retrivePartner = async () => {
        try {
            const response = await Axios.post(`${partnerApi}/partnerProfile`, null, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success) {
                setPartnerDetails(response.data.data)
                setEditData(response.data.data)
            }
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        retrivePartner()
    }, [])

    const handleChange = (e) => {
        const { value, name } = e.target
        setEditData({ ...editData, [name]: value, })
    }

    const handleProfileImg = (e) => {
        const file = e.target.files[0]
        const url = URL.createObjectURL(file)
        setProfileUrl(url)
        setProfileImg(file)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append("image", profileImg)
        for (const [key, value] of Object.entries(editData)) {
            if (key === "mobile" || key === "fname" || key === "lname" || key === "gstNo" || key === "city") {
                formData.append(key, value)
            }
        }

        const response = await Axios.post(`${partnerApi}/editPartnerProfile`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (response.data.success) {
            setPartnerDetails(response.data.data);
             dispatch(addPartner({ token:token, username: response.data.data.fname +" "+ response.data.data.lname }));

             setModalStatus(false)
            
            toast.success(response.data.message);
        } else {
            toast.error(response.data.message);
        }
    }

    const handleProofImage = (e) => {
        e.preventDefault()
        const file = e.target.files[0]
        const name = e.target.name
        setProof({ ...proof, [name]: file })
        const url = URL.createObjectURL(file)
        if (name === "aadhaar") {
            setAadhaarUrl(url)
        } else {
            setPanUrl(url)
        }
    }


    const handleProofUpload = async () => {
        try {
            if (proof.aadhaar && proof.pan) {
                const formData = new FormData()
                formData.append('aadhaar', proof.aadhaar)
                formData.append('pan', proof.pan)
                const response = await Axios.post(`${partnerApi}/uploadProof`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (response.data.success) {
                    setPartnerDetails(response.data.data)
                    setAadhaarUrl(null)
                    setPanUrl(null)
                    toast.success(response.data.message)
                } else {
                    toast.error(response.data.message)
                }
            } else {
                toast.error("select both files")
            }

        } catch (error) {
            console.log(error.message);
        }
    }

    const handlePoint = (e) => {
        setPoint(e.target.value)
    }

    const handleAddPoint = async () => {
        try {
            if (point) {
                const response = await Axios.post(`${partnerApi}/uploadLocationPoints`, { pointName: point }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (response.data.success) {
                    setPartnerDetails(response.data.data)
                    toast.success(response.data.message)
                } else {
                    toast.error(response.data.message)
                }



            } else {
                toast.error("please enter point name")

            }
        } catch (error) {

        }

    }


    return (
        <div className=''>
            <div className={`mx-auto flex w-full ${!isOpen ? 'justify-start' : 'justify-between'} `}>
                <div className={`${!isOpen ? 'none' : 'block'}`}>
                    <SideBarPartner isOpen={isOpen} />
                </div>
                <div className={`absolute flex ${!isOpen ? 'justify-start' : 'justify-end'}z-1 w-[220px]`}>
                    {!isOpen ? <GiHamburgerMenu size={35} onClick={() => setIsOpen(!isOpen)} /> : <AiOutlineClose size={35} onClick={() => setIsOpen(!isOpen)} />}
                </div>
                <div className={`text-4xl text-center ${!isOpen ? 'w-full' : 'w-[83%]'} bg-red-800 `}>
                    <div className='w-full bg-yellow-300 '>
                        <h1 className='py-2 text-3xl font-semibold'>Partner Profile</h1>
                    </div>

                    <div className='bg-yellow-200  flex justify-center flex-col md:flex-row  p-5'>

                        <div className=' w-full md:w-[30%] '>
                            <div className="flex items-center justify-center">

                                <div className="w-full pb-5 md:pr-5">
                                    <div className="bg-yellow-100 w-full shadow-xl rounded-lg py-3">
                                        <div className="photo-wrapper p-2 flex justify-center items-center ">



                                            <img className="w-32 h-32 rounded-full mx-auto" src={partnerDetails.image ? partnerDetails.image : "https://mir-s3-cdn-cf.behance.net/project_modules/disp/ea7a3c32163929.567197ac70bda.png"} alt="John Doe" />

                                        </div>
                                        <div className="p-2">
                                            <h3 className="text-center text-xl text-gray-900 font-medium leading-8">{partnerDetails.fname} {partnerDetails.lname}</h3>
                                            <div className="text-center text-gray-400 text-xs font-semibold">
                                                <p>rev-on user</p>
                                            </div>
                                            <table className="text-xs my-3">
                                                <tbody>
                                                    <tr>
                                                        <td className="px-2 py-2 text-gray-500 font-semibold">Phone</td>
                                                        <td className="px-2 py-2">{partnerDetails.mobile ? partnerDetails.mobile : "update your mobile number"}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-2 py-2 text-gray-500 font-semibold">Email</td>
                                                        <td className="px-2 py-2">{partnerDetails.email}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-2 py-2 text-gray-500 font-semibold">city</td>
                                                        <td className="px-2 py-2">{partnerDetails.city ? partnerDetails.city : "add your city"}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-2 py-2 text-gray-500 font-semibold">GST no</td>
                                                        <td className="px-2 py-2">{partnerDetails.gstNo ? partnerDetails.gstNo : "add your GST number"}</td>
                                                    </tr>

                                                </tbody></table>

                                            <div className="flex justify-center my-3">
                                                <button className="block text-white bg-gray-900 hover:bg-black  font-medium rounded-lg text-sm px-3 py-2 text-center " type="button" onClick={() => setModalStatus(true)}>Edit Profile</button>
                                            </div>

                                            <div className={`flex justify-center items-center fixed top-0 left-0 right-0 z-50 ${modalStatus ? 'block' : 'hidden'} w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full`}>
                                                <div className="relative w-full max-w-md max-h-full">

                                                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                                        <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal"
                                                            onClick={() => {
                                                                setEditData(partnerDetails)
                                                                setModalStatus(false)
                                                            }}>
                                                            X
                                                            <span className="sr-only">Close modal</span>
                                                        </button>
                                                        <div className="px-6 py-6 lg:px-8">
                                                            <h3 className="text-center mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit Profile</h3>
                                                            <form className="space-y-6">
                                                                <div className="photo-wrapper p-2 flex flex-col justify-center items-center ">
                                                                    <label className='absolute text-transparent hover:text-black ' htmlFor="profileFile"> <AiOutlinePlusCircle size={22} /></label>
                                                                    <input type="file" name='image' onChange={handleProfileImg} className='invisible hidden' id='profileFile' />
                                                                    {profileImg ? <img className="w-20 h-20 rounded-full mx-auto" src={profileUrl} alt="John Doe" /> : <img className="w-20 h-20 rounded-full mx-auto" src={editData.image ? editData.image : "https://mir-s3-cdn-cf.behance.net/project_modules/disp/ea7a3c32163929.567197ac70bda.png"} alt="John Doe" />}
                                                                    <p className='text-sm'>{profileImg ? profileImg.name : ""}</p>
                                                                </div>
                                                                <div className='flex flex-col justify-start items-start'>
                                                                    <label className="block  pl-2 mb-2 text-sm font-medium text-gray-900 dark:text-white">Firstname</label>
                                                                    <input type="text" name="fname" value={editData.fname} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Enter your firstname" required />
                                                                </div>
                                                                <div className='flex flex-col justify-start items-start'>
                                                                    <label className="block  pl-2 mb-2 text-sm font-medium text-gray-900 dark:text-white">Lastname</label>
                                                                    <input type="text" name="lname" value={editData.lname} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Enter your lastname" required />
                                                                </div>
                                                                <div className='flex flex-col justify-start items-start'>
                                                                    <label className="block mb-2  pl-2 text-sm font-medium text-gray-900 dark:text-white">Mobile</label>
                                                                    <input type="number" name="mobile" value={editData.mobile} onChange={handleChange} placeholder="Enter your mobile number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                                                                </div>
                                                                <div className='flex flex-col justify-start items-start'>
                                                                    <label className="block  pl-2 mb-2 text-sm font-medium text-gray-900 dark:text-white">City</label>
                                                                    <input type="text" name="city" value={editData.city} onChange={handleChange} placeholder="Enter your city" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                                                                </div>
                                                                <div className='flex flex-col justify-start items-start'>
                                                                    <label className="block mb-2 pl-2 text-sm font-medium text-gray-900 dark:text-white">GST no</label>
                                                                    <input type="text" name="gstNo" value={editData.gstNo} onChange={handleChange} placeholder="Enter your GST number" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                                                                </div>

                                                                <button onClick={handleSubmit} className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save Changes</button>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className='bg-yellow-100 rounded-lg h-screen w-full md:w-[65%]'>

                            <div className='mb-3'>
                                <p className='text-sm font-semibold text-center mt-4'>ID PROOF</p>
                                <div className='flex md:flex-row flex-col justify-center items-center md:justify-evenly'>
                                    <div className='flex justify-center flex-col  md:w-[35%] w-[70%] p-3'>
                                        <p className='text-gray-800 font-semibold text-sm mb-2'>Aadhaar card :</p>
                                        <label className='absolute text-transparent hover:text-black pt-6  ' htmlFor="lfs"> <AiOutlinePlusSquare size={100} /></label>
                                        <input type="file" className='invisible hidden' onChange={handleProofImage} n name='aadhaar' id='lfs' />
                                        {!aadhaar && partnerDetails.aadhaar ? <img className="w-full h-40 rounded-md  mx-auto" src={partnerDetails.aadhaar} alt="John Doe" /> : <img className="w-full h-40 rounded-md  mx-auto" src={`${aadhaar ? aadhaar : "https://aadhaarcard.co.in/wp-content/uploads/2023/04/aadhaar-card-800x445.webp"}`} alt="John Doe" />}
                                    </div>
                                    <div className='flex justify-center flex-col md:w-[35%] w-[70%] p-3'>
                                        <p className='text-gray-800 font-semibold text-sm mb-2'>Pan Card :</p>
                                        <label className='absolute text-transparent hover:text-black pt-6   ' htmlFor="lbs"> <AiOutlinePlusSquare size={100} /></label>
                                        <input type="file" className='invisible hidden' onChange={handleProofImage} name='pan' id='lbs' />
                                        {!pan && partnerDetails.pan ? <img className="w-full h-40 rounded-md  mx-auto" src={partnerDetails.pan} alt="John Doe" /> : <img className="w-full h-40 rounded-md  mx-auto" src={`${pan ? pan : "https://aadhaarcard.co.in/wp-content/uploads/2023/04/aadhaar-card-800x445.webp"}`} alt="John Doe" />}
                                    </div>
                                </div>
                            </div>

                            <div className='flex justify-center'>
                                <button className='bg-black text-white px-2 py-1 rounded-md' onClick={handleProofUpload}>upload</button>
                            </div>
                            <div className='pt-2 flex flex-col justify-center items-center'>
                                <p className='text-sm font-semibold'>Add PickUP & Drop Points </p>
                                <div className='py-2 md:px-2 w-[90%] md:w-[67%]  '>
                                    <input className='w-[70%] md:w-[88%] bg-yellow-300 text-black placeholder:text-black h-[40px] text-sm pl-4 outline-none rounded-l-lg' type="text" name='point' value={point} onChange={handlePoint} placeholder='Enter Point Name' />
                                    <button onClick={handleAddPoint} className='px-3 h-[40px] text-sm font-semibold rounded-r-lg hover:bg-green-600 hover:text-white bg-green-500'>Add</button>
                                </div>
                                <div className='w-[90%] md:w-[67%] px-3'>
                                    {partnerDetails.locations && partnerDetails.locations.map((location) => {
                                        return (
                                            <div key={location._id} className='h-[40px] flex items-center justify-evenly pl-2   bg-yellow-300 rounded-lg my-1'>
                                                <FaMapLocationDot size={16} />
                                                <p className='text-[12px] md:text-sm '>{location.name}</p>
                                                <p className='text-[10px] md:text-sm font-bold text-red-600 cursor-pointer hover:text-red-700 '>Delete</p>
                                                <p className='text-[10px] md:text-sm font-bold text-blue-600 cursor-pointer  hover:text-blue-700'>Edit</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </div>

        </div>
    )
}

export default PartnerProfile