import React, { useState, useEffect } from 'react'
import SideBar from '../AdminSideBar/Sidebar'
import AdminLoader from '../AdminSideBar/AdminLoader'
import Chart from '../../Partner/PartnerDashboard/Chart'
import PieChart from '../../Partner/PartnerDashboard/PieChart'
import axios from 'axios'
import { adminApi } from '../../../config/api'


function AdminDash() {
  const [isOpen, setIsOpen] = useState(() => localStorage.getItem('adminSidebarOpen') === 'true')
  const [dashDetails, setDashDetails] = useState({})
  const [weekly, setWeekly] = useState('')
  const [monthly, setMonthly] = useState('')
  const [loading, setLoading] = useState(true)

  const toggleSidebar = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    localStorage.setItem('adminSidebarOpen', String(nextState));
  };

  const bookingBikesRevenuCount = async () => {
    const response = await axios.get(`${adminApi}/fetchBookingBikesRevenu`)
    if (response.data.success) {
      let datas = response.data.currentWeek
      console.log(datas);
      setWeekly({
        labels: datas.map((data) => data.dayName),
        datasets: [{
          label: "bookings",
          data: datas.map((data) => data.count),
          backgroundColor: ['#0af5f5']
        }]

      })
      setDashDetails(response.data.data)
    }
  }

  const monthlySalesRatio = async () => {
    const response = await axios.get(`${adminApi}/monthlySalesRatio`)
    if (response.data.success) {
      let values = response.data.data
      setMonthly({
        labels: ['cancelled', 'completed'],
        datasets: [{
          label: "bookings",
          data: [values.cancelled, values.completed],
          backgroundColor: ['#f50a0a', '#0af53d']
        }]

      })

    }

  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([bookingBikesRevenuCount(), monthlySalesRatio()]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [])




  return (
    <div className="mx-auto flex w-full min-h-screen bg-[#0A0F1D] text-slate-100">
      <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={`text-4xl text-center ${!isOpen ? 'pl-[72px]' : 'pl-[240px]'} w-full transition-all duration-300`}>
        <div className='w-full'>
          <h1 className='p-4 text-2xl font-bold bg-[#0F172A] border-b border-slate-800 text-left pl-14 text-slate-100'>Admin Dashboard</h1>
          {loading ? (
            <AdminLoader />
          ) : (
            <>
              <div className='w-full flex justify-evenly p-5 py-8 border-b border-slate-850 bg-[#0B132B]/50 gap-4 flex-wrap'>

                <div className='p-5 w-[14rem] bg-[#111C3A] border border-[#1E2E5B]/60 rounded-xl shadow-lg hover:border-sky-500/50 transition-all duration-200 text-left'>
                  <p className='text-xs text-slate-400 font-bold uppercase tracking-wider'>Total bookings</p>
                  <p className='font-extrabold text-3xl text-white mt-1'>{dashDetails.totalBookingCount}</p>
                </div>

                <div className='p-5 w-[14rem] bg-[#111C3A] border border-[#1E2E5B]/60 rounded-xl shadow-lg hover:border-sky-500/50 transition-all duration-200 text-left'>
                  <p className='text-xs text-slate-400 font-bold uppercase tracking-wider'>Partner Count</p>
                  <p className='font-extrabold text-3xl text-white mt-1'>{dashDetails.totalPartners}</p>
                </div>

                <div className='p-5 w-[14rem] bg-[#111C3A] border border-[#1E2E5B]/60 rounded-xl shadow-lg hover:border-sky-500/50 transition-all duration-200 text-left'>
                  <p className='text-xs text-slate-400 font-bold uppercase tracking-wider'>User Count</p>
                  <p className='font-extrabold text-3xl text-white mt-1'>{dashDetails.totalUsers}</p>
                </div>

                <div className='p-5 w-[14rem] bg-[#111C3A] border border-[#1E2E5B]/60 rounded-xl shadow-lg hover:border-sky-500/50 transition-all duration-200 text-left'>
                  <p className='text-xs text-slate-400 font-bold uppercase tracking-wider'>Total Sales</p>
                  <p className='font-extrabold text-3xl text-white mt-1'>₹{dashDetails.totalRevenu}</p>
                </div>

              </div>
              <div className='w-full flex md:flex-row flex-col p-6 gap-6'>
                <div className='md:w-[50%] w-full bg-[#111C3A]/40 border border-[#1E2E5B]/30 rounded-xl p-6 shadow-md'>
                  <p className='text-slate-350 font-bold text-lg mb-4 text-left border-l-4 border-sky-400 pl-3'>Weekly Sales</p>
                  {weekly && <Chart chartData={weekly} />}
                </div>
                <div className='md:w-[50%] w-full bg-[#111C3A]/40 border border-[#1E2E5B]/30 rounded-xl p-6 shadow-md flex flex-col items-center'>
                  <p className='text-slate-350 font-bold text-lg mb-4 text-left w-full border-l-4 border-sky-400 pl-3'>Booking & Cancel Ratio</p>
                  <div className='w-full flex justify-center max-h-[18rem] items-center'>
                    {monthly && <PieChart chartData={monthly} />}
                  </div>
                </div>
              </div>
            </>
          )}


        </div>
      </div>
    </div>
  )
}

export default AdminDash