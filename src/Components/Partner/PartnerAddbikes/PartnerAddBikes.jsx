import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SideBarPartner from '../PartnerSideBar/SideBarPartner'
import Axios from 'axios'
import { partnerApi } from '../../../config/api'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { FiChevronLeft, FiFolderPlus, FiUpload } from 'react-icons/fi'

function PartnerAddBikes() {
    const partner = useSelector((store) => store.partner.partnerD)
    const token = partner.token
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(() => localStorage.getItem('partnerSidebarOpen') === 'true')
    const [isVerified, setIsVerified] = useState(true)
    const [checkingStatus, setCheckingStatus] = useState(true)

    const initialValues = { name: "", brand: "", category: "", makeYear: "", rentPerHour: "", engineCC: "", plateNumber: "" }
    const [formValues, setFormValues] = useState(initialValues)
    const [formErrors, setFormErrors] = useState({})
    const [files, setFiles] = useState([])
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const checkVerification = async () => {
            try {
                const response = await Axios.post(`${partnerApi}/partnerProfile`, null, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.data.success) {
                    setIsVerified(response.data.data.verificationStatus === "approved");
                }
            } catch (err) {
                console.error(err);
            } finally {
                setCheckingStatus(false);
            }
        };
        if (token) {
            checkVerification();
        } else {
            setCheckingStatus(false);
        }
    }, [token]);

    const handleChange = (e) => {
        const { value, name } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleImage = (e) => {
        const selectedFiles = Array.from(e.target.files)
        const validImageTypes = ["image/gif", "image/jpeg", "image/png", "image/webp"];

        let newFiles = [];
        for (let i = 0; i < selectedFiles.length; i++) {
            const fileType = selectedFiles[i].type;
            if (validImageTypes.includes(fileType)) {
                newFiles.push(selectedFiles[i]);
            } else {
                toast.error(`Invalid image type for "${selectedFiles[i].name}". Only PNG, JPG, or WEBP allowed.`);
            }
        }

        setFiles((prevFiles) => {
            const updated = [...prevFiles, ...newFiles];
            if (updated.length > 3) {
                toast.error("You can upload a maximum of 3 images. Extra files have been truncated.");
                return updated.slice(0, 3);
            }
            return updated;
        });
    };

    const removeFile = (index) => {
        setFiles((prevFiles) => prevFiles.filter((_, idx) => idx !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        const errors = validate(formValues)
        setFormErrors(errors)

        if (Object.keys(errors).length > 0) {
            return;
        }

        if (files.length === 0) {
            toast.error("Please upload at least one image of the bike")
            return;
        }

        if (files.length > 3) {
            toast.error("You can upload a maximum of 3 images of the bike")
            return;
        }

        setSaving(true)
        let formData = new FormData()
        for (const [key, value] of Object.entries(formValues)) {
            formData.append(key, value.trim())
        }

        for (let j = 0; j < files.length; j++) {
            formData.append('image', files[j])
        }

        try {
            const response = await Axios.post(`${partnerApi}/addBikes`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })
            if (response.data.success) {
                toast.success(response.data.message)
                navigate('/partner/bikes')
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error("Failed to add bike. Please check your data.")
        } finally {
            setSaving(false)
        }
    }

    const validate = (values) => {
        const errors = {}
        if (!values.name.trim()) errors.name = "Bike model name is required"
        if (!values.brand.trim()) errors.brand = "Brand name is required"
        if (!values.category) errors.category = "Please select a category"
        if (!values.makeYear.trim()) errors.makeYear = "Manufacture year is required"
        if (!values.engineCC.trim()) errors.engineCC = "Engine displacement (CC) is required"
        if (!values.plateNumber.trim()) errors.plateNumber = "License plate number is required"
        if (!values.rentPerHour.trim()) errors.rentPerHour = "Hourly rent fee is required"
        return errors
    }

    if (checkingStatus) {
        return (
            <div className="bg-[#0A0F1D] min-h-screen text-slate-100 flex w-full font-sans items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-yellow-400"></div>
            </div>
        );
    }

    if (!isVerified) {
        return (
            <div className='bg-[#0A0F1D] min-h-screen text-slate-100 flex w-full font-sans animate-fadeIn'>
                <SideBarPartner isOpen={isOpen} setIsOpen={setIsOpen} />
                <div className={`transition-all duration-300 w-full flex flex-col ${!isOpen ? 'pl-[72px]' : 'pl-[240px]'}`}>
                    <div className='w-full bg-[#111C3A]/40 border-b border-[#1E293B]/70 py-4 px-6 sm:px-10 flex items-center justify-between'>
                        <h1 className='text-xl sm:text-2xl font-bold uppercase tracking-wider font-passion text-white'>
                            Access Restricted
                        </h1>
                    </div>
                    <div className="p-6 sm:p-10 flex-grow flex justify-center items-center">
                        <div className="w-full max-w-lg bg-[#111C3A]/40 border border-yellow-450/20 rounded-2xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
                            <div className="mx-auto w-16 h-16 bg-yellow-400/10 border border-yellow-405/20 rounded-full flex items-center justify-center text-yellow-400 animate-pulse">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Verification Under Progress</h2>
                            <p className="text-sm text-slate-300 leading-relaxed font-sans">
                                Verification under progress. Please update your profile details and wait for a response from the Rev-on Rentals team.
                            </p>
                            <div className="pt-4">
                                <button
                                    onClick={() => navigate('/partner/profile')}
                                    className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 font-extrabold text-xs text-black uppercase tracking-widest rounded-lg shadow-md transition-all cursor-pointer"
                                >
                                    Update Profile Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='bg-[#0A0F1D] min-h-screen text-slate-100 flex w-full font-sans animate-fadeIn'>
            <SideBarPartner isOpen={isOpen} setIsOpen={setIsOpen} />

            <div className={`transition-all duration-300 w-full flex flex-col ${!isOpen ? 'pl-[72px]' : 'pl-[240px]'}`}>

                {/* Header ribbon */}
                <div className='w-full bg-[#111C3A]/40 border-b border-[#1E293B]/70 py-4 px-6 sm:px-10 flex items-center justify-between'>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/partner/bikes')}
                            className="p-2 hover:bg-[#1E293B] rounded-lg transition-colors text-gray-400 hover:text-white"
                        >
                            <FiChevronLeft size={20} />
                        </button>
                        <h1 className='text-xl sm:text-2xl font-bold uppercase tracking-wider font-passion text-white'>
                            Add Bike
                        </h1>
                    </div>
                </div>

                {/* Form Wrapper */}
                <div className="p-6 sm:p-10 flex-grow flex justify-center items-start">
                    <div className="w-full max-w-2xl bg-[#111C3A]/30 border border-[#1E293B]/50 rounded-2xl p-6 sm:p-8 shadow-2xl">

                        <h2 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-[#1E293B]/55 pb-3">
                            <FiFolderPlus className="text-yellow-400" /> Vehicle Specification details
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Model Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Scrambler 400x"
                                        className="bg-[#0B132B] border border-[#1E293B] rounded-lg px-4 py-2.5 w-full text-slate-100 focus:outline-none focus:border-yellow-400 transition-colors text-sm"
                                        value={formValues.name}
                                        onChange={handleChange}
                                        name="name"
                                    />
                                    {formErrors.name && <p className='text-xs text-rose-500 mt-1.5 font-semibold'>{formErrors.name}</p>}
                                </div>
                                <div>
                                    <label className="block mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Brand / Make</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Triumph"
                                        className="bg-[#0B132B] border border-[#1E293B] rounded-lg px-4 py-2.5 w-full text-slate-100 focus:outline-none focus:border-yellow-400 transition-colors text-sm"
                                        value={formValues.brand}
                                        onChange={handleChange}
                                        name="brand"
                                    />
                                    {formErrors.brand && <p className='text-xs text-rose-500 mt-1.5 font-semibold'>{formErrors.brand}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Upload Motorcycle Images</label>
                                <div className="border border-dashed border-[#1E293B] rounded-lg p-5 text-center bg-[#0B132B]/50 hover:bg-[#0B132B]/85 transition-colors cursor-pointer relative group">
                                    <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={handleImage}
                                        name="image"
                                        multiple
                                    />
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <FiUpload size={24} className="text-gray-400 group-hover:text-yellow-400 transition-colors" />
                                        <span className="text-xs text-gray-300 font-semibold">Click to upload files</span>
                                        <span className="text-[10px] text-gray-500">Supports PNG, JPG, WEBP (multiple selections allowed)</span>
                                    </div>
                                </div>
                                {files.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {files.map((file, i) => (
                                            <div key={i} className="text-[11px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-1 rounded flex items-center gap-1.5">
                                                <span className="truncate max-w-[12rem]">{file.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(i)}
                                                    className="w-3.5 h-3.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-305 rounded-full flex items-center justify-center font-bold text-[9px] cursor-pointer transition-colors"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Classification Category</label>
                                    <select
                                        name='category'
                                        className="bg-[#0B132B] border border-[#1E293B] rounded-lg px-4 py-2.5 w-full text-slate-100 focus:outline-none focus:border-yellow-400 transition-colors text-sm"
                                        value={formValues.category}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select a Category</option>
                                        <option value="Commuters & Minis">Commuters/Minis</option>
                                        <option value="Scooters">Scooters</option>
                                        <option value="Modern Classics">Modern Classics</option>
                                        <option value="Sport Touring">Sport Touring</option>
                                        <option value="Touring">Touring</option>
                                        <option value="Electric ">Electric</option>
                                        <option value="Standard & Naked">Street/naked</option>
                                        <option value="Sportbikes">Sportsbike</option>
                                        <option value="Cruisers">Cruisers</option>
                                        <option value="Adventure">Adventure</option>
                                        <option value="Scrambler">Scrambler </option>
                                    </select>
                                    {formErrors.category && <p className='text-xs text-rose-500 mt-1.5 font-semibold'>{formErrors.category}</p>}
                                </div>
                                <div>
                                    <label className="block mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Release / Make Year</label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 2024"
                                        className="bg-[#0B132B] border border-[#1E293B] rounded-lg px-4 py-2.5 w-full text-slate-100 focus:outline-none focus:border-yellow-400 transition-colors text-sm"
                                        value={formValues.makeYear}
                                        onChange={handleChange}
                                        name="makeYear"
                                    />
                                    {formErrors.makeYear && <p className='text-xs text-rose-500 mt-1.5 font-semibold'>{formErrors.makeYear}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                <div>
                                    <label className="block mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Engine Power (CC)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 398"
                                        className="bg-[#0B132B] border border-[#1E293B] rounded-lg px-4 py-2.5 w-full text-slate-100 focus:outline-none focus:border-yellow-400 transition-colors text-sm"
                                        name='engineCC'
                                        value={formValues.engineCC}
                                        onChange={handleChange}
                                    />
                                    {formErrors.engineCC && <p className='text-xs text-rose-500 mt-1.5 font-semibold'>{formErrors.engineCC}</p>}
                                </div>
                                <div>
                                    <label className="block mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Plate Register Number</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. MH12AB1234"
                                        className="bg-[#0B132B] border border-[#1E293B] rounded-lg px-4 py-2.5 w-full text-slate-100 focus:outline-none focus:border-yellow-400 transition-colors text-sm uppercase"
                                        name='plateNumber'
                                        value={formValues.plateNumber}
                                        onChange={handleChange}
                                    />
                                    {formErrors.plateNumber && <p className='text-xs text-rose-500 mt-1.5 font-semibold'>{formErrors.plateNumber}</p>}
                                </div>
                                <div>
                                    <label className="block mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Rent Fee (₹ / hr)</label>
                                    <input
                                        type="number"
                                        name="rentPerHour"
                                        placeholder="e.g. 150"
                                        className="bg-[#0B132B] border border-[#1E293B] rounded-lg px-4 py-2.5 w-full text-slate-100 focus:outline-none focus:border-yellow-400 transition-colors text-sm"
                                        value={formValues.rentPerHour}
                                        onChange={handleChange}
                                    />
                                    {formErrors.rentPerHour && <p className='text-xs text-rose-500 mt-1.5 font-semibold'>{formErrors.rentPerHour}</p>}
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-yellow-400/10 disabled:opacity-50"
                                >
                                    {saving ? "Registering Vehicle..." : "Register Product Bike"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default PartnerAddBikes