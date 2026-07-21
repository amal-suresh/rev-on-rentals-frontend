import React, { useState, useEffect } from 'react'
import SideBarPartner from '../PartnerSideBar/SideBarPartner'
import { FaMapLocationDot } from 'react-icons/fa6'
import { partnerApi } from '../../../config/api'
import { toast } from 'react-hot-toast'
import Axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { addPartner } from '../../../utils/partnerSlice'
import { AiOutlinePlusCircle, AiOutlinePlusSquare, AiOutlineCheckCircle, AiOutlineClockCircle, AiOutlineInfoCircle } from 'react-icons/ai'
import { FiUser, FiFileText, FiCreditCard, FiTrash2, FiMapPin, FiCamera } from 'react-icons/fi'

// Aadhaar Card Mockup
const AadhaarMockup = () => (
    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-4 flex flex-col justify-between relative overflow-hidden shadow-inner text-left">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
            <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-[10px] font-extrabold uppercase tracking-wide text-emerald-400">AADHAAR CARD</span>
            </div>
            <span className="text-[8px] font-sans font-bold text-gray-500 uppercase tracking-widest">GOVERNMENT OF INDIA</span>
        </div>
        {/* Body Content */}
        <div className="flex gap-4.5 my-3 items-center">
            {/* Photo Placeholder */}
            <div className="w-14 h-18 bg-slate-950/60 rounded border border-slate-700/60 flex flex-col items-center justify-center text-slate-600 shrink-0">
                <FiUser size={24} className="text-slate-600" />
                <span className="text-[7px] text-gray-500 font-bold uppercase mt-1">PHOTO</span>
            </div>
            {/* Personal Info Lines */}
            <div className="flex-1 space-y-2">
                <div className="h-2.5 bg-slate-700/60 rounded w-4/5"></div>
                <div className="h-2 bg-slate-800 rounded w-2/3"></div>
                <div className="h-2 bg-slate-800 rounded w-1/2"></div>

                {/* Mock Aadhaar number */}
                <div className="pt-2 flex gap-1">
                    <span className="text-[10px] font-mono tracking-widest text-slate-450 font-bold">XXXX XXXX XXXX</span>
                </div>
            </div>
        </div>
        {/* Bottom Bar */}
        <div className="bg-emerald-500/10 border-t border-emerald-500/20 px-3 py-1 flex items-center justify-between -mx-4 -mb-4">
            <span className="text-[9px] font-sans text-emerald-400 font-bold uppercase tracking-wider">MEMBER CARD SKELETON</span>
            <div className="flex gap-0.5">
                <div className="w-3 h-2 bg-slate-700 rounded-sm"></div>
                <div className="w-4 h-2 bg-slate-700 rounded-sm"></div>
            </div>
        </div>
    </div>
);

// PAN Card Mockup
const PanMockup = () => (
    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-4 flex flex-col justify-between relative overflow-hidden shadow-inner text-left">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
            <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-[10px] font-extrabold uppercase tracking-wide text-blue-400 whitespace-nowrap">PAN</span>
            </div>
            <span className="text-[8px] font-sans font-bold text-gray-500 uppercase tracking-widest">INCOME TAX DEPT</span>
        </div>
        {/* Body Content */}
        <div className="flex gap-4.5 my-3 items-center">
            {/* Photo Placeholder */}
            <div className="w-14 h-18 bg-slate-950/60 rounded border border-slate-700/60 flex flex-col items-center justify-center text-slate-600 shrink-0">
                <FiUser size={24} className="text-slate-600" />
                <span className="text-[7px] text-gray-500 font-bold uppercase mt-1">PHOTO</span>
            </div>
            {/* Personal Info Lines */}
            <div className="flex-1 space-y-2">
                <div className="h-2.5 bg-slate-700/60 rounded w-3/4"></div>
                <div className="h-2 bg-slate-800 rounded w-1/2"></div>
                <div className="h-2 bg-slate-800 rounded w-3/5"></div>

                {/* Mock PAN ID */}
                <div className="pt-2">
                    <span className="text-[10px] font-mono tracking-wider text-slate-450 font-bold">ABCDE1234F</span>
                </div>
            </div>
        </div>
        {/* Bottom Bar */}
        <div className="bg-blue-500/10 border-t border-blue-500/20 px-3 py-1 flex items-center justify-between -mx-4 -mb-4">
            <span className="text-[9px] font-sans text-blue-400 font-bold uppercase tracking-wider">TAX REFERENCE CARD</span>
            <div className="flex gap-0.5">
                <div className="w-4 h-2 bg-slate-700 rounded-sm"></div>
                <div className="w-3 h-2 bg-slate-700 rounded-sm"></div>
            </div>
        </div>
    </div>
);

function PartnerProfile() {
    const dispatch = useDispatch()
    const [isOpen, setIsOpen] = useState(() => localStorage.getItem('partnerSidebarOpen') === 'true')
    const [activeTab, setActiveTab] = useState('overview') // 'overview', 'verification', 'bank'

    const [partnerDetails, setPartnerDetails] = useState({})
    const [editData, setEditData] = useState({ fname: "", lname: "", mobile: "", city: "", gstNo: "" })

    // Bank details state
    const [bankData, setBankData] = useState({
        accountHolderName: "",
        accountNumber: "",
        ifscCode: "",
        bankName: "",
        branchName: "",
        accountType: "savings",
        upiId: ""
    })

    const [profileImg, setProfileImg] = useState(null)
    const [profileUrl, setProfileUrl] = useState(null)
    const [proof, setProof] = useState({ aadhaar: null, pan: null })
    const [aadhaarUrl, setAadhaarUrl] = useState(null)
    const [panUrl, setPanUrl] = useState(null)
    const [point, setPoint] = useState('')
    const [saving, setSaving] = useState(false)

    const partner = useSelector((store) => store.partner.partnerD)
    const token = partner.token

    const isPdfFile = (urlOrFile) => {
        if (!urlOrFile) return false;
        if (typeof urlOrFile === 'string') {
            return urlOrFile.toLowerCase().endsWith('.pdf') || urlOrFile.includes('/raw/upload/') || urlOrFile.includes('.pdf?');
        }
        return urlOrFile.type === 'application/pdf';
    };

    const renderDocPreview = (docUrl, docFile, docName, fallbackMockup) => {
        if (docFile) {
            if (docFile.type === 'application/pdf') {
                return (
                    <div className="w-full h-full bg-slate-900 border border-slate-700/60 rounded-lg p-5 flex flex-col items-center justify-center text-center">
                        <FiFileText size={48} className="text-red-400 mb-2" />
                        <span className="text-[11px] text-gray-300 font-bold block max-w-full truncate px-3">{docFile.name}</span>
                        <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mt-1">Ready to upload</span>
                    </div>
                );
            } else {
                return <img className="w-full h-full object-cover" src={docUrl} alt={docName} />;
            }
        }

        const savedUrl = partnerDetails.documents?.[docName.toLowerCase()] || partnerDetails[docName.toLowerCase()];
        if (savedUrl) {
            if (isPdfFile(savedUrl)) {
                return (
                    <div className="w-full h-full bg-slate-900 border border-slate-700/60 rounded-lg p-5 flex flex-col items-center justify-center text-center">
                        <FiFileText size={48} className="text-red-500 mb-2" />
                        <span className="text-[11px] text-gray-300 font-bold block max-w-full truncate px-3">{docName} (PDF)</span>
                        <button
                            type="button"
                            onClick={() => window.open(savedUrl, '_blank')}
                            className="mt-3 px-4 py-1.5 bg-[#111C3A] hover:bg-yellow-405 hover:text-black rounded text-[10px] uppercase font-extrabold tracking-wider text-yellow-400 border border-yellow-400/20 transition-all cursor-pointer"
                        >
                            View Document
                        </button>
                    </div>
                );
            } else {
                return (
                    <div className="relative w-full h-full group">
                        <img className="w-full h-full object-cover" src={savedUrl} alt={docName} />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                type="button"
                                onClick={() => window.open(savedUrl, '_blank')}
                                className="px-4 py-1.5 bg-yellow-405 text-black rounded text-[10px] uppercase font-extrabold tracking-wider transition-all cursor-pointer"
                            >
                                View Image
                            </button>
                        </div>
                    </div>
                );
            }
        }

        return fallbackMockup;
    };

    const retrievePartner = async () => {
        try {
            const response = await Axios.post(`${partnerApi}/partnerProfile`, null, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success) {
                const data = response.data.data;
                setPartnerDetails(data)
                setEditData({
                    fname: data.fname || "",
                    lname: data.lname || "",
                    mobile: data.phone || data.mobile || "",
                    city: data.city || "",
                    gstNo: data.documents?.gstNo || data.gstNo || ""
                })
                setBankData({
                    accountHolderName: data.bankDetails?.accountHolderName || "",
                    accountNumber: data.bankDetails?.accountNumber || "",
                    ifscCode: data.bankDetails?.ifscCode || "",
                    bankName: data.bankDetails?.bankName || "",
                    branchName: data.bankDetails?.branchName || "",
                    accountType: data.bankDetails?.accountType ? data.bankDetails.accountType.toLowerCase() : "savings",
                    upiId: data.bankDetails?.upiId || ""
                })
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    useEffect(() => {
        if (token) {
            retrievePartner()
        }
    }, [token])

    const isProfileUnchanged = () => {
        const hasImgChange = !!profileImg;
        const hasFnameChange = editData.fname !== (partnerDetails.fname || "");
        const hasLnameChange = editData.lname !== (partnerDetails.lname || "");
        const hasPhoneChange = editData.mobile !== (partnerDetails.phone || partnerDetails.mobile || "");
        const hasCityChange = editData.city !== (partnerDetails.city || "");
        return !hasImgChange && !hasFnameChange && !hasLnameChange && !hasPhoneChange && !hasCityChange;
    }

    const isGstUnchanged = () => {
        return editData.gstNo === (partnerDetails.documents?.gstNo || partnerDetails.gstNo || "");
    }

    const isBankUnchanged = () => {
        const originalType = partnerDetails.bankDetails?.accountType ? partnerDetails.bankDetails.accountType.toLowerCase() : "savings";
        return (
            bankData.accountHolderName === (partnerDetails.bankDetails?.accountHolderName || "") &&
            bankData.accountNumber === (partnerDetails.bankDetails?.accountNumber || "") &&
            bankData.ifscCode === (partnerDetails.bankDetails?.ifscCode || "") &&
            bankData.bankName === (partnerDetails.bankDetails?.bankName || "") &&
            bankData.branchName === (partnerDetails.bankDetails?.branchName || "") &&
            bankData.accountType === originalType &&
            bankData.upiId === (partnerDetails.bankDetails?.upiId || "")
        );
    }

    const handleProfileChange = (e) => {
        const { value, name } = e.target
        setEditData({ ...editData, [name]: value })
    }

    const handleBankChange = (e) => {
        const { value, name } = e.target
        setBankData({ ...bankData, [name]: value })
    }

    const handleProfileImg = (e) => {
        const file = e.target.files[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setProfileUrl(url)
            setProfileImg(file)
        }
    }

    const handleSaveProfile = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const formData = new FormData()
            if (profileImg) {
                formData.append("image", profileImg)
            }
            formData.append("fname", editData.fname)
            formData.append("lname", editData.lname)
            formData.append("mobile", editData.mobile)
            formData.append("city", editData.city)
            formData.append("gstNo", editData.gstNo)

            const response = await Axios.post(`${partnerApi}/editPartnerProfile`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.data.success) {
                setPartnerDetails(response.data.data);
                dispatch(addPartner({ token: token, username: response.data.data.fname + " " + response.data.data.lname }));
                setProfileImg(null);
                toast.success("Profile saved successfully");
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            toast.error("Error updating profile");
        } finally {
            setSaving(false)
        }
    }

    const handleSaveBank = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const response = await Axios.post(`${partnerApi}/editPartnerProfile`, {
                fname: editData.fname,
                lname: editData.lname,
                ...bankData
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.data.success) {
                setPartnerDetails(response.data.data);
                toast.success("Bank details saved successfully");
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            toast.error("Error updating bank details");
        } finally {
            setSaving(false)
        }
    }

    const handleProofImage = (e) => {
        const file = e.target.files[0]
        const name = e.target.name
        if (file) {
            setProof(prev => ({ ...prev, [name]: file }))
            const url = URL.createObjectURL(file)
            if (name === "aadhaar") {
                setAadhaarUrl(url)
            } else {
                setPanUrl(url)
            }
        }
    }

    const handleProofUpload = async () => {
        try {
            if (proof.aadhaar || proof.pan) {
                setSaving(true)
                const formData = new FormData()
                if (proof.aadhaar) {
                    formData.append('aadhaar', proof.aadhaar)
                }
                if (proof.pan) {
                    formData.append('pan', proof.pan)
                }
                const response = await Axios.post(`${partnerApi}/uploadProof`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (response.data.success) {
                    setPartnerDetails(response.data.data)
                    setAadhaarUrl(null)
                    setPanUrl(null)
                    setProof({ aadhaar: null, pan: null })
                    toast.success("Documents uploaded successfully")
                } else {
                    toast.error(response.data.message)
                }
            } else {
                toast.error("Please select at least one document to upload")
            }
        } catch (error) {
            toast.error("Error uploading proofs");
        } finally {
            setSaving(false)
        }
    }

    const handleAddPoint = async () => {
        try {
            if (point.trim()) {
                const response = await Axios.post(`${partnerApi}/uploadLocationPoints`, { pointName: point.trim() }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (response.data.success) {
                    setPartnerDetails(response.data.data)
                    setPoint('')
                    toast.success("Point added successfully")
                } else {
                    toast.error(response.data.message)
                }
            } else {
                toast.error("Please enter a point name")
            }
        } catch (error) {
            console.error(error);
        }
    }

    const renderStatusBadge = () => {
        const status = partnerDetails.verificationStatus;

        if (status === 'approved') {
            return (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs uppercase tracking-wide">
                    <AiOutlineCheckCircle size={16} /> Verified Partner
                </div>
            )
        }
        if (status === 'pending') {
            return (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-yellow-405/10 border border-yellow-405/20 text-yellow-405 font-bold text-xs uppercase tracking-wide">
                    <AiOutlineClockCircle size={16} /> Verification Pending
                </div>
            )
        }
        return (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-455 font-bold text-xs uppercase tracking-wide">
                <AiOutlineInfoCircle size={16} /> Unverified / Action Required
            </div>
        )
    }

    return (
        <div className='bg-[#0A0F1D] min-h-screen text-slate-100 flex w-full font-sans animate-fadeIn'>
            <SideBarPartner isOpen={isOpen} setIsOpen={setIsOpen} />

            <div className={`transition-all duration-300 w-full flex flex-col ${!isOpen ? 'pl-[72px]' : 'pl-[240px]'}`}>

                {/* Header ribbon */}
                <div className='w-full bg-[#111C3A]/40 border-b border-[#1E293B]/70 py-4 px-6 sm:px-10 flex items-center justify-between'>
                    <h1 className='text-xl sm:text-2xl font-bold uppercase tracking-wider font-passion text-white'>
                        Partner Profile
                    </h1>
                    {renderStatusBadge()}
                </div>

                <div className="p-6 sm:p-10 flex-grow max-w-6xl w-full mx-auto">

                    {/* Navigation tabs */}
                    <div className="flex border-b border-[#1E293B] mb-8 gap-1">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'overview'
                                ? 'border-yellow-400 text-yellow-400'
                                : 'border-transparent text-gray-400 hover:text-white'
                                }`}
                        >
                            <FiUser size={16} /> Basic Profile
                        </button>
                        <button
                            onClick={() => setActiveTab('verification')}
                            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'verification'
                                ? 'border-yellow-400 text-yellow-400'
                                : 'border-transparent text-gray-400 hover:text-white'
                                }`}
                        >
                            <FiFileText size={16} /> Documents Info
                        </button>
                        <button
                            onClick={() => setActiveTab('bank')}
                            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'bank'
                                ? 'border-yellow-400 text-yellow-400'
                                : 'border-transparent text-gray-400 hover:text-white'
                                }`}
                        >
                            <FiCreditCard size={16} /> Bank Details
                        </button>
                    </div>

                    {/* Tab panels */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Profile Card Side panel */}
                        <div className="lg:col-span-1 bg-[#111C3A]/50 border border-[#1E293B]/70 rounded-2xl p-6 sm:p-8 flex flex-col items-center h-fit text-center shadow-xl">
                            <div className="relative group mb-4">
                                {profileUrl ? (
                                    <img
                                        className="w-32 h-32 rounded-full object-cover border-2 border-yellow-400/30"
                                        src={profileUrl}
                                        alt="Profile"
                                    />
                                ) : partnerDetails.image ? (
                                    <img
                                        className="w-32 h-32 rounded-full object-cover border-2 border-yellow-400/30"
                                        src={partnerDetails.image}
                                        alt="Profile"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-slate-800 border-2 border-yellow-450/30 flex items-center justify-center text-slate-400 hover:text-white transition-colors duration-200">
                                        <FiUser size={64} className="text-yellow-400/80" />
                                    </div>
                                )}
                                <label
                                    htmlFor="profile-upload"
                                    className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-yellow-400 border border-yellow-400/20"
                                >
                                    <FiCamera size={20} />
                                </label>
                                <input
                                    type="file"
                                    id="profile-upload"
                                    accept="image/*"
                                    onChange={handleProfileImg}
                                    className="hidden"
                                />
                            </div>

                            <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                                {partnerDetails.fname} {partnerDetails.lname}
                            </h3>
                            <span className="text-[11px] text-gray-400 uppercase tracking-widest font-bold mt-1">
                                Rev-On Rentals Partner
                            </span>

                            <div className="w-full border-t border-[#1E293B]/70 mt-6 pt-5 text-left space-y-4 text-xs text-gray-300">
                                <div className="flex justify-between">
                                    <span className="text-gray-400 uppercase font-semibold">Registered Email</span>
                                    <span className="font-medium text-slate-100">{partnerDetails.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400 uppercase font-semibold">Phone Contact</span>
                                    <span className="font-medium text-slate-100">{partnerDetails.phone || partnerDetails.mobile || 'Not set'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400 uppercase font-semibold">Base City</span>
                                    <span className="font-medium text-slate-100 capitalize">{partnerDetails.city || 'Not set'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Editable Form Side panels */}
                        <div className="lg:col-span-2">

                            {/* OVERVIEW PANEL */}
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    <form onSubmit={handleSaveProfile} className="bg-[#111C3A]/30 border border-[#1E293B]/50 rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl space-y-5">
                                        <h3 className="text-md font-bold uppercase tracking-wider border-l-4 border-yellow-400 pl-3 text-white mb-6">
                                            Edit General Information
                                        </h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">First Name</label>
                                                <input
                                                    type="text"
                                                    name="fname"
                                                    value={editData.fname}
                                                    onChange={handleProfileChange}
                                                    className="bg-[#0B132B] border border-[#1E293B] rounded-lg px-4 py-2.5 w-full text-slate-100 focus:outline-none focus:border-yellow-400 transition-colors text-sm"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Last Name</label>
                                                <input
                                                    type="text"
                                                    name="lname"
                                                    value={editData.lname}
                                                    onChange={handleProfileChange}
                                                    className="bg-[#0B132B] border border-[#1E293B] rounded-lg px-4 py-2.5 w-full text-slate-100 focus:outline-none focus:border-yellow-400 transition-colors text-sm"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Mobile Number</label>
                                                <input
                                                    type="tel"
                                                    name="mobile"
                                                    value={editData.mobile}
                                                    onChange={handleProfileChange}
                                                    className="bg-[#0B132B] border border-[#1E293B] rounded-lg px-4 py-2.5 w-full text-slate-100 focus:outline-none focus:border-yellow-400 transition-colors text-sm"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Operational City</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    value={editData.city}
                                                    onChange={handleProfileChange}
                                                    className="bg-[#0B132B] border border-[#1E293B] rounded-lg px-4 py-2.5 w-full text-slate-100 focus:outline-none focus:border-yellow-400 transition-colors text-sm"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="flex md:justify-end mt-6">
                                            <button
                                                type="submit"
                                                disabled={saving || isProfileUnchanged()}
                                                className="w-full sm:w-auto px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 font-extrabold text-xs text-black uppercase tracking-widest rounded-lg shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {saving ? "Saving Changes..." : "Save Profile Details"}
                                            </button>
                                        </div>
                                    </form>

                                    {/* Pickup Locations Widget */}
                                    <div className="bg-[#111C3A]/30 border border-[#1E293B]/50 rounded-2xl p-6 sm:p-8 shadow-xl">
                                        <h3 className="text-md font-bold uppercase tracking-wider border-l-4 border-yellow-400 pl-3 text-white mb-4">
                                            Location Pickup Points
                                        </h3>

                                        <div className="flex gap-2 mb-6">
                                            <input
                                                className="bg-[#0B132B] border border-[#1E293B] rounded-lg px-4 py-2.5 w-full text-slate-100 focus:outline-none focus:border-yellow-400 transition-colors text-sm"
                                                type="text"
                                                value={point}
                                                onChange={(e) => setPoint(e.target.value)}
                                                placeholder="Enter Pickup Point (e.g. MG Road Hub)"
                                            />
                                            <button
                                                onClick={handleAddPoint}
                                                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-xs font-bold uppercase tracking-wider rounded-lg text-white transition-all cursor-pointer"
                                            >
                                                Add
                                            </button>
                                        </div>

                                        <div className="space-y-2">
                                            {partnerDetails.locations && partnerDetails.locations.map((loc) => (
                                                <div key={loc._id} className="flex items-center justify-between p-3.5 bg-[#111C3A]/45 border border-[#1E293B]/40 rounded-xl hover:border-yellow-400/20 transition-all font-sans text-xs">
                                                    <div className="flex items-center gap-2.5 text-slate-200">
                                                        <FiMapPin size={16} className="text-yellow-400" />
                                                        <span className="font-semibold">{loc.name}</span>
                                                    </div>
                                                    <button className="text-rose-500 hover:text-rose-455 font-bold uppercase text-[10px] tracking-wider transition-colors">
                                                        Delete
                                                    </button>
                                                </div>
                                            ))}
                                            {(!partnerDetails.locations || partnerDetails.locations.length === 0) && (
                                                <p className="text-center text-xs text-gray-400 py-4">No pickup points added yet.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* VERIFICATION DOCUMENTS PANEL */}
                            {activeTab === 'verification' && (
                                <div className="space-y-6">
                                    <div className="bg-[#111C3A]/30 border border-[#1E293B]/50 rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl space-y-6">
                                        <h3 className="text-md font-bold uppercase tracking-wider border-l-4 border-yellow-400 pl-3 text-white">
                                            Verification Documents
                                        </h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                                            {/* Aadhaar upload */}
                                            <div className="flex flex-col bg-[#0B132B]/50  rounded-xl p-4.5 relative text-left">
                                                <label className="block mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Aadhaar Card</label>
                                                <input
                                                    type="file"
                                                    name="aadhaar"
                                                    id="aadhaar-file"
                                                    accept="image/*,application/pdf"
                                                    onChange={handleProofImage}
                                                    className="hidden"
                                                />
                                                <div className="relative w-full h-42 bg-slate-900/60 rounded-lg overflow-hidden border border-dashed border-[#1E293B]/70 group shadow-inner">
                                                    {renderDocPreview(aadhaarUrl, proof.aadhaar, "Aadhaar", <AadhaarMockup />)}
                                                    <label
                                                        htmlFor="aadhaar-file"
                                                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-yellow-400 text-xs font-bold uppercase tracking-wider"
                                                    >
                                                        Change Document
                                                    </label>
                                                </div>
                                            </div>

                                            {/* PAN upload */}
                                            <div className="flex flex-col bg-[#0B132B]/50  rounded-xl p-4.5 relative text-left">
                                                <label className="block mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">PAN Card</label>
                                                <input
                                                    type="file"
                                                    name="pan"
                                                    id="pan-file"
                                                    accept="image/*,application/pdf"
                                                    onChange={handleProofImage}
                                                    className="hidden"
                                                />
                                                <div className="relative w-full h-42 bg-slate-900/60 rounded-lg overflow-hidden border border-dashed border-[#1E293B]/70 group shadow-inner">
                                                    {renderDocPreview(panUrl, proof.pan, "Pan", <PanMockup />)}
                                                    <label
                                                        htmlFor="pan-file"
                                                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-yellow-400 text-xs font-bold uppercase tracking-wider"
                                                    >
                                                        Change Document
                                                    </label>
                                                </div>
                                            </div>

                                        </div>

                                        {(aadhaarUrl || panUrl) && (
                                            <div className="flex justify-center mt-6">
                                                <button
                                                    onClick={handleProofUpload}
                                                    disabled={saving}
                                                    className="px-8 py-2.5 bg-yellow-400 hover:bg-yellow-500 font-extrabold text-xs text-black uppercase tracking-widest rounded-lg shadow-md cursor-pointer disabled:opacity-50"
                                                >
                                                    {saving ? "Uploading Documents..." : "Upload Proofs"}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Tax Invoice details info */}
                                    <div className="bg-[#111C3A]/30 border border-[#1E293B]/50 rounded-2xl p-6 sm:p-8 shadow-xl space-y-5">
                                        <h3 className="text-md font-bold uppercase tracking-wider border-l-4 border-yellow-400 pl-3 text-white mb-6">
                                            Tax GST Reference
                                        </h3>
                                        <div>
                                            <label className="block mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">GST Validation Number (Optional)</label>
                                            <input
                                                type="text"
                                                name="gstNo"
                                                value={editData.gstNo}
                                                onChange={handleProfileChange}
                                                className="bg-[#0B132B] border border-[#1E293B] rounded-lg px-4 py-2.5 w-full text-slate-100 focus:outline-none focus:border-yellow-400 transition-colors text-sm"
                                                placeholder="Enter 15-digit GSTIN (e.g. 22AAAAA0000A1Z5)"
                                            />
                                        </div>
                                        <div className="flex md:justify-end mt-4">
                                            <button
                                                onClick={handleSaveProfile}
                                                disabled={saving || isGstUnchanged()}
                                                className="w-full sm:w-auto px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 font-extrabold text-xs text-black uppercase tracking-widest rounded-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Update GSTIN
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* BANK DETAILS PANEL */}
                            {activeTab === 'bank' && (
                                <form onSubmit={handleSaveBank} className="bg-[#111C3A]/30 border border-[#1E293B]/50 rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl space-y-5">
                                    <h3 className="text-md font-bold uppercase tracking-wider border-l-4 border-yellow-400 pl-3 text-white mb-6">
                                        Payout Account Credentials
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Bank Name</label>
                                            <input
                                                type="text"
                                                name="bankName"
                                                value={bankData.bankName}
                                                onChange={handleBankChange}
                                                className="bg-[#0B132B] border border-[#1E293B] rounded-lg px-4 py-2.5 w-full text-slate-100 focus:outline-none focus:border-yellow-400 transition-colors text-sm"
                                                placeholder="e.g. State Bank of India"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Branch Location</label>
                                            <input
                                                type="text"
                                                name="branchName"
                                                value={bankData.branchName}
                                                onChange={handleBankChange}
                                                className="bg-[#0B132B] border border-[#1E293B] rounded-lg px-4 py-2.5 w-full text-slate-100 focus:outline-none focus:border-yellow-400 transition-colors text-sm"
                                                placeholder="e.g. MG Road Branch"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Account holder Name</label>
                                            <input
                                                type="text"
                                                name="accountHolderName"
                                                value={bankData.accountHolderName}
                                                onChange={handleBankChange}
                                                className="bg-[#0B132B] border border-[#1E293B] rounded-lg px-4 py-2.5 w-full text-slate-100 focus:outline-none focus:border-yellow-400 transition-colors text-sm"
                                                placeholder="Name matching passbook"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Account Type</label>
                                            <select
                                                name="accountType"
                                                value={bankData.accountType}
                                                onChange={handleBankChange}
                                                className="bg-[#0B132B] border border-[#1E293B] rounded-lg px-4 py-2.5 w-full text-slate-100 focus:outline-none focus:border-yellow-400 transition-colors text-sm"
                                            >
                                                <option value="savings">Savings Account</option>
                                                <option value="current">Current Account</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Account Number</label>
                                            <input
                                                type="text"
                                                name="accountNumber"
                                                value={bankData.accountNumber}
                                                onChange={handleBankChange}
                                                className="bg-[#0B132B] border border-[#1E293B] rounded-lg px-4 py-2.5 w-full text-slate-100 focus:outline-none focus:border-yellow-400 transition-colors text-sm"
                                                placeholder="Enter bank Account Number"
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Bank IFSC Code</label>
                                            <input
                                                type="text"
                                                name="ifscCode"
                                                value={bankData.ifscCode}
                                                onChange={handleBankChange}
                                                className="bg-[#0B132B] border border-[#1E293B] rounded-lg px-4 py-2.5 w-full text-slate-100 focus:outline-none focus:border-yellow-400 transition-colors text-sm"
                                                placeholder="e.g. SBIN0001234"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">UPI Identifier (e.g. user@okaxis)</label>
                                        <input
                                            type="text"
                                            name="upiId"
                                            value={bankData.upiId}
                                            onChange={handleBankChange}
                                            className="bg-[#0B132B] border border-[#1E293B] rounded-lg px-4 py-2.5 w-full text-slate-100 focus:outline-none focus:border-yellow-400 transition-colors text-sm"
                                            placeholder="Direct UPI virtual payment address"
                                        />
                                    </div>

                                    <div className="flex md:justify-end mt-6">
                                        <button
                                            type="submit"
                                            disabled={saving || isBankUnchanged()}
                                            className="w-full sm:w-auto px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 font-extrabold text-xs text-black uppercase tracking-widest rounded-lg shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {saving ? "Saving Payout Details..." : "Save Bank Settings"}
                                        </button>
                                    </div>
                                </form>
                            )}

                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default PartnerProfile