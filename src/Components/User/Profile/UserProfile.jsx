import React, { useEffect, useState } from 'react'
import { AiOutlinePlusCircle, AiOutlinePlusSquare } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import Axios from 'axios'
import { userApi } from '../../../config/api'
import Navbar from '../Navbar/Navbar'
import { toast } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { addUser } from '../../../utils/userSlice'
import UserRideHistory from '../RideHistory/UserRideHistory'
import UserFooter from '../Footer/UserFooter'

function UserProfile() {
    const dispatch = useDispatch()
    const [userDetails, setUserDetails] = useState({})
    const [modalStatus, setModalStatus] = useState(false)
    const [editData, setEditData] = useState({})
    const [profileImg, setProfileImg] = useState(null)
    const [profileUrl, setProfileUrl] = useState(null)
    const [proof, setProof] = useState({ licenseFrontSide: null, licenseBackSide: null })
    const [lFrontSideUrl, setLFrontSideUrl] = useState(userDetails.licenseFrontSide)
    const [lBackSideUrl, setLBackSideUrl] = useState(userDetails.licenseBackSide)
    const [rideHistory, setRideHistory] = useState(false)


    const user = useSelector((store) => store.user.userD)
    const token = user.token

    const retriveUser = async () => {
        try {

            const response = await Axios.post(`${userApi}userProfile`, null, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success) {
                console.log("user data updated", response.data.data);
                setUserDetails(response.data.data)
                setEditData(response.data.data)

            }
        } catch (error) {
            console.log(error.message);
        }
    }
    useEffect(() => {
        retriveUser()
    }, [])

    const handleChange = (e) => {
        const { value, name } = e.target
        const newvalue = value.trim()
        setEditData({ ...editData, [name]: newvalue, })

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
            if (key === "mobile" || key === "fname" || key === "lname") {
                formData.append(key, value)
            }
        }

        const response = await Axios.post(`${userApi}editUserProfile`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (response.data.success) {
            setUserDetails(response.data.data);
            dispatch(addUser({ token: token, username: response.data.data.fname + " " + response.data.data.lname }));
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
        let url = URL.createObjectURL(file)
        if (name === "licenseFrontSide") {
            setLFrontSideUrl(url)
        } else {
            setLBackSideUrl(url)
        }
    }


    const handleProofUpload = async () => {
        try {
            if (proof.licenseFrontSide && proof.licenseBackSide) {
                const formData = new FormData()
                formData.append('licenseFrontSide', proof.licenseFrontSide)
                formData.append('licenseBackSide', proof.licenseBackSide)
                const response = await Axios.post(`${userApi}uploadProof`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (response.data.success) {
                    setUserDetails(response.data.data)
                    setLBackSideUrl(null)
                    setLFrontSideUrl(null)
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

    return (
        <div className='flex flex-col max-w[1600px] h-full'>

            <Navbar />

            <div className='bg-yellow-200  flex justify-center flex-col md:flex-row  p-5 h-full mt-20'>

                <div className=' w-full md:w-[30%] '>
                    <div className="flex items-center justify-center">

                        <div className="w-full pb-5 md:pr-5">
                            <div className="bg-yellow-100 w-full shadow-xl rounded-lg py-3">
                                <div className="photo-wrapper p-2 flex justify-center items-center ">



                                    <img className="w-32 h-32 rounded-full mx-auto" src={userDetails.image ? userDetails.image : "https://mir-s3-cdn-cf.behance.net/project_modules/disp/ea7a3c32163929.567197ac70bda.png"} alt="John Doe" />

                                </div>
                                <div className="p-2">
                                    <h3 className="text-center text-xl text-gray-900 font-medium leading-8">{userDetails.fname} {userDetails.lname}</h3>
                                    <div className="text-center text-gray-400 text-xs font-semibold">
                                        <p>rev-on user</p>
                                    </div>
                                    <table className="text-xs my-3">
                                        <tbody>
                                            <tr>
                                                <td className="px-2 py-2 text-gray-500 font-semibold">Phone</td>
                                                <td className="px-2 py-2">{userDetails.mobile ? userDetails.mobile : "update your mobile number"}</td>
                                            </tr>
                                            <tr>
                                                <td className="px-2 py-2 text-gray-500 font-semibold">Email</td>
                                                <td className="px-2 py-2">{userDetails.email}</td>
                                            </tr>

                                        </tbody></table>

                                    <div className="flex justify-center my-3">
                                        <button className="block text-white bg-gray-900 hover:bg-black  font-medium rounded-lg text-sm px-3 py-2 text-center " type="button" onClick={() => setModalStatus(true)}>Edit Profile</button>
                                    </div>
                                    <div className='bg-black rounded-xl cursor-pointer hover:bg-slate-900' onClick={() => setRideHistory(!rideHistory)}>
                                        <h3 className='text-center text-yellow-300 p-2'>MY RIDES</h3>

                                    </div>

                                    <div className={`flex justify-center items-center fixed top-0 left-0 right-0 z-50 ${modalStatus ? 'block' : 'hidden'} w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full`}>
                                        <div className="relative w-full max-w-md max-h-full">

                                            <div className="relative bg-yellow-200 rounded-lg shadow mt-5 ">
                                                <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent border-2 border-black hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="authentication-modal"
                                                    onClick={() => {
                                                        setEditData(userDetails)
                                                        setModalStatus(false)
                                                    }}>
                                                    X
                                                    <span className="sr-only">Close modal</span>
                                                </button>
                                                <div className="px-6 py-6 lg:px-8">
                                                    <h3 className="text-center mb-4 text-xl font-medium text-black">Edit Profile</h3>
                                                    <form className="space-y-6 bg-white p-6 rounded-xl shadow-lg">
                                                        <div className="photo-wrapper p-2 flex flex-col justify-center items-center">
                                                            <label htmlFor="profileFile" className="relative cursor-pointer group">
                                                                <AiOutlinePlusCircle size={24} className="text-gray-400 group-hover:text-gray-700" />
                                                                <input type="file" name="image" onChange={handleProfileImg} className="hidden" id="profileFile" />
                                                            </label>
                                                            {profileImg ? (
                                                                <img className="w-24 h-24 rounded-full mt-3 object-cover" src={profileUrl} alt="Profile Preview" />
                                                            ) : (
                                                                <img className="w-24 h-24 rounded-full mt-3 object-cover" src={editData.image ? editData.image : "https://mir-s3-cdn-cf.behance.net/project_modules/disp/ea7a3c32163929.567197ac70bda.png"} alt="Default Profile" />
                                                            )}
                                                            <p className="text-xs text-gray-500 mt-1">{profileImg ? profileImg.name : ""}</p>
                                                        </div>

                                                        <div>
                                                            <label className="block mb-2 text-sm font-semibold text-gray-700">Firstname</label>
                                                            <input
                                                                type="text"
                                                                name="fname"
                                                                value={editData.fname}
                                                                onChange={handleChange}
                                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                                placeholder="Enter your firstname"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block mb-2 text-sm font-semibold text-gray-700">Lastname</label>
                                                            <input
                                                                type="text"
                                                                name="lname"
                                                                value={editData.lname}
                                                                onChange={handleChange}
                                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                                placeholder="Enter your lastname"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block mb-2 text-sm font-semibold text-gray-700">Mobile</label>
                                                            <input
                                                                type="number"
                                                                name="mobile"
                                                                value={editData.mobile}
                                                                onChange={handleChange}
                                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                                placeholder="Enter your mobile number"
                                                            />
                                                        </div>

                                                        <button
                                                            type="submit"
                                                            onClick={handleSubmit}
                                                            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 rounded-lg transition duration-300"
                                                        >
                                                            Save Changes
                                                        </button>
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

                {rideHistory ? <UserRideHistory /> :
                    <div className='bg-yellow-100 rounded-lg h-screen  w-full md:w-[65%]'>

                        <div className='mb-3'>
                            <p className='text-sm font-semibold text-center mt-4'>ID PROOF</p>
                            <div className='flex md:flex-row flex-col justify-center items-center md:justify-evenly'>
                                <div className='flex justify-center flex-col  md:w-[35%] w-[70%] p-3'>
                                    <p className='text-gray-800 font-semibold text-sm mb-2'>License Front Side :</p>
                                    <label className='absolute text-transparent hover:text-black pt-6  ' htmlFor="lfs"> <AiOutlinePlusSquare size={100} /></label>
                                    <input type="file" className='invisible hidden' onChange={handleProofImage} n name='licenseFrontSide' id='lfs' />
                                    {!lFrontSideUrl && userDetails.licenseFrontSide ? <img className="w-full h-40 rounded-md  mx-auto" src={userDetails.licenseFrontSide} alt="John Doe" /> : <img className="w-full h-40 rounded-md  mx-auto" src={`${lFrontSideUrl ? lFrontSideUrl : "https://aadhaarcard.co.in/wp-content/uploads/2023/04/aadhaar-card-800x445.webp"}`} alt="John Doe" />}
                                </div>
                                <div className='flex justify-center flex-col md:w-[35%] w-[70%] p-3'>
                                    <p className='text-gray-800 font-semibold text-sm mb-2'>License Back Side :</p>
                                    <label className='absolute text-transparent hover:text-black pt-6   ' htmlFor="lbs"> <AiOutlinePlusSquare size={100} /></label>
                                    <input type="file" className='invisible hidden' onChange={handleProofImage} name='licenseBackSide' id='lbs' />
                                    {!lBackSideUrl && userDetails.licenseBackSide ? <img className="w-full h-40 rounded-md  mx-auto" src={userDetails.licenseBackSide} alt="John Doe" /> : <img className="w-full h-40 rounded-md  mx-auto" src={`${lBackSideUrl ? lBackSideUrl : "https://aadhaarcard.co.in/wp-content/uploads/2023/04/aadhaar-card-800x445.webp"}`} alt="John Doe" />}
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-center'>
                            <button className='bg-black text-white px-2 py-1 rounded-md' onClick={handleProofUpload}>upload</button>
                        </div>
                        <div className='pt-2 flex flex-col '>
                            <p className='text-md text-start font-semibold pl-3'>Guidelines to Follow</p>
                            <div className='flex flex-col justify-start pl-3 mt-2'>
                                <p>* Upload both sides of the DL in appropriate fields.</p>
                                <p>* Please upload the picture of the original DL </p>
                                <p>* Please ensure that the uploaded images of the documents are clear and visible for faster approval.</p>
                                <p>* Learner License, Photocopy, Color Xerox, Screenshots, Scanned Copies are not Applicable.</p>
                                <p>* Please carry the Original documents for verification at the time of pickup.</p>
                                <p>* Vehicle will be issued only as per the Driving license eligibility.</p>
                            </div>
                        </div>
                    </div>
                }
            </div>

            <div>
                <UserFooter />
            </div>
        </div>
    )
}

export default UserProfile