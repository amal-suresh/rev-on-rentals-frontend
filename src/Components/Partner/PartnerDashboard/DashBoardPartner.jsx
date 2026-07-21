import React, { useState, useEffect } from 'react'
import SideBarPartner from '../PartnerSideBar/SideBarPartner'
import Chart from '../PartnerDashboard/Chart'
import PieChart from '../PartnerDashboard/PieChart'
import axios from 'axios'
import { partnerApi } from '../../../config/api'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiTrendingUp, FiLayers, FiEyeOff, FiDollarSign } from 'react-icons/fi'

function DashBoardPartner() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(() => localStorage.getItem('partnerSidebarOpen') === 'true')
  const [weekly, setWeekly] = useState('')
  const [dashDetails, setDashDetails] = useState({})
  const [monthly, setMonthly] = useState('')
  const [loading, setLoading] = useState(true)
  const [isVerified, setIsVerified] = useState(true)
  const [checkingStatus, setCheckingStatus] = useState(true)

  const partner = useSelector((store) => store.partner.partnerD)
  const token = partner.token

  const bookingBikesRevenuCount = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${partnerApi}/fetchBookingBikesRevenu`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response.data.success) {
        let datas = response.data.currentWeek
        setWeekly({
          labels: datas.map((data) => data.dayName),
          datasets: [{
            label: "bookings",
            data: datas.map((data) => data.count),
            backgroundColor: ['#FACC15']
          }]
        })
        setDashDetails(response.data.data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const monthlySalesRatio = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${partnerApi}/monthlySalesRatio`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response.data.success) {
        let values = response.data.data
        setMonthly({
          labels: ['cancelled', 'completed'],
          datasets: [{
            label: "bookings",
            data: [values.cancelled, values.completed],
            backgroundColor: ['#ef4444', '#10b981']
          }]
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const response = await axios.post(`${partnerApi}/partnerProfile`, null, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.success) {
          const approved = response.data.data.verificationStatus === "approved";
          setIsVerified(approved);
          if (approved) {
            setLoading(true)
            await Promise.all([bookingBikesRevenuCount(), monthlySalesRatio()])
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setCheckingStatus(false);
        setLoading(false);
      }
    };
    if (token) {
      checkVerification();
    } else {
      setCheckingStatus(false);
      setLoading(false);
    }
  }, [token]);

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
    <div className='bg-[#0A0F1D] min-h-screen text-slate-100 flex w-full font-sans'>
      <SideBarPartner isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className={`transition-all duration-300 w-full flex flex-col ${!isOpen ? 'pl-[72px]' : 'pl-[240px]'}`}>

        {/* Header Ribbon */}
        <div className='w-full bg-[#111C3A]/40 border-b border-[#1E293B]/70 py-4 px-6 sm:px-10 flex items-center justify-between'>
          <h1 className='text-xl sm:text-2xl font-bold uppercase tracking-wider font-passion text-white'>
            Partner Dashboard
          </h1>
          <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider bg-[#1E293B]/50 px-3 py-1.5 rounded-md border border-[#1E293B]">
            Welcome, {partner.name || 'Partner'}
          </div>
        </div>

        {loading ? (
          <div className="flex-grow flex items-center justify-center py-20">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-4 border-yellow-400/20"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-yellow-400 animate-spin"></div>
            </div>
          </div>
        ) : (
          <div className="p-6 sm:p-10 flex-grow">

            {/* Stats Dashboard Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>

              <div className='p-6 bg-[#111C3A]/50 border border-[#1E293B]/70 rounded-xl hover:border-yellow-450/40 transition-all duration-200 text-left flex items-center justify-between shadow-lg'>
                <div>
                  <p className='text-xs text-gray-400 font-bold uppercase tracking-wider'>Total Bookings</p>
                  <p className='font-extrabold text-2xl text-white mt-1.5'>{dashDetails.totalBookingCount || 0}</p>
                </div>
                <div className="p-3 bg-yellow-400/10 text-yellow-400 rounded-lg">
                  <FiTrendingUp size={22} />
                </div>
              </div>

              <div className='p-6 bg-[#111C3A]/50 border border-[#1E293B]/70 rounded-xl hover:border-yellow-450/40 transition-all duration-200 text-left flex items-center justify-between shadow-lg'>
                <div>
                  <p className='text-xs text-gray-400 font-bold uppercase tracking-wider'>Active Bikes</p>
                  <p className='font-extrabold text-2xl text-white mt-1.5'>{dashDetails.allBikesCount || 0}</p>
                </div>
                <div className="p-3 bg-yellow-400/10 text-yellow-400 rounded-lg">
                  <FiLayers size={22} />
                </div>
              </div>

              <div className='p-6 bg-[#111C3A]/50 border border-[#1E293B]/70 rounded-xl hover:border-yellow-450/40 transition-all duration-200 text-left flex items-center justify-between shadow-lg'>
                <div>
                  <p className='text-xs text-gray-400 font-bold uppercase tracking-wider'>Hidden Bikes</p>
                  <p className='font-extrabold text-2xl text-white mt-1.5'>{dashDetails.bikeHided || 0}</p>
                </div>
                <div className="p-3 bg-yellow-400/10 text-yellow-400 rounded-lg">
                  <FiEyeOff size={22} />
                </div>
              </div>

              <div className='p-6 bg-[#111C3A]/50 border border-[#1E293B]/70 rounded-xl hover:border-yellow-450/40 transition-all duration-200 text-left flex items-center justify-between shadow-lg'>
                <div>
                  <p className='text-xs text-gray-400 font-bold uppercase tracking-wider'>Total Revenue</p>
                  <p className='font-extrabold text-2xl text-white mt-1.5'>₹{dashDetails.totalRevenu || 0}</p>
                </div>
                <div className="p-3 bg-yellow-400/10 text-yellow-400 rounded-lg">
                  <FiDollarSign size={22} />
                </div>
              </div>

            </div>

            {/* Charts Visualizer Blocks */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>

              <div className='bg-[#111C3A]/30 border border-[#1E293B]/50 rounded-xl p-6 shadow-md'>
                <p className='text-slate-200 font-bold text-md mb-6 uppercase tracking-wider border-l-4 border-yellow-400 pl-3'>
                  Weekly Rentals Count
                </p>
                <div className='w-full'>
                  {weekly && <Chart chartData={weekly} />}
                </div>
              </div>

              <div className='bg-[#111C3A]/30 border border-[#1E293B]/50 rounded-xl p-6 shadow-md flex flex-col items-center'>
                <p className='text-slate-200 font-bold text-md mb-6 uppercase tracking-wider border-l-4 border-yellow-400 pl-3 w-full text-left'>
                  Booking Status Ratio
                </p>
                <div className='w-full flex justify-center max-h-[16rem] items-center'>
                  {monthly && <PieChart chartData={monthly} />}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  )
}

export default DashBoardPartner