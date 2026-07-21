import React, { useState, useEffect } from 'react'
import SideBarPartner from '../PartnerSideBar/SideBarPartner'
import Axios from 'axios'
import { partnerApi } from '../../../config/api'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { FiUser, FiCalendar, FiClock, FiMapPin, FiCheckCircle } from 'react-icons/fi'

function BookingsByUser() {
  const partner = useSelector((store) => store.partner.partnerD)
  const token = partner.token
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(() => localStorage.getItem('partnerSidebarOpen') === 'true')
  const [bookings, setBookings] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const [isVerified, setIsVerified] = useState(true)
  const [checkingStatus, setCheckingStatus] = useState(true)

  const handleClick = (index) => {
    setPage(index + 1)
  }

  const findBookings = async () => {
    try {
      const response = await Axios.get(`${partnerApi}/findBookings?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      })
      if (response.data.success) {
        setBookings(response.data.data)
        setPage(response.data.page)
        setTotalPages(response.data.totalPages)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  const handleStatus = async (id, e) => {
    try {
      const value = e.target.value
      const data = {
        value,
        id: id
      }

      const response = await Axios.post(`${partnerApi}/changeBookingStatus`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response.data.success) {
        const updatedBookings = bookings.map((booking) => {
          if (booking._id === id) {
            return {
              ...booking,
              status: value,
            };
          }
          return booking;
        });
        setBookings(updatedBookings);
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error.message)
    }
  }

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

  useEffect(() => {
    if (token && isVerified) {
      findBookings()
    }
  }, [page, token, isVerified])

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
      case 'cancelled': return 'bg-red-500/10 text-red-405 border border-red-500/20'
      case 'booked': return 'bg-yellow-405/10 text-yellow-405 border border-yellow-405/20'
      default: return 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
    }
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
    <div className='bg-[#0A0F1D] min-h-screen text-slate-100 flex w-full font-sans'>
      <SideBarPartner isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className={`transition-all duration-300 w-full flex flex-col ${!isOpen ? 'pl-[72px]' : 'pl-[240px]'}`}>

        {/* Header Ribbon */}
        <div className='w-full bg-[#111C3A]/40 border-b border-[#1E293B]/70 py-4 px-6 sm:px-10 flex items-center justify-between'>
          <h1 className='text-xl sm:text-2xl font-bold uppercase tracking-wider font-passion text-white'>
            Partner Bookings
          </h1>
        </div>

        <div className='p-6 sm:p-10 flex-grow'>
          <div className="bg-[#111C3A]/20 border border-[#1E293B]/50 rounded-xl overflow-hidden shadow-xl">

            {bookings && bookings.length > 0 ? (
              <div className='w-full overflow-x-auto'>
                <table className='w-full border-collapse'>
                  <thead>
                    <tr className='bg-[#111C3A]/60 border-b border-[#1E293B]/70 text-gray-300 text-xs font-bold uppercase tracking-wider'>
                      <th className='p-4.5 text-left font-semibold'>User Details</th>
                      <th className='p-4.5 text-left font-semibold'>Bike Details</th>
                      <th className='p-4.5 text-left font-semibold'>Pick Up info</th>
                      <th className='p-4.5 text-left font-semibold'>Drop Off info</th>
                      <th className='p-4.5 text-left font-semibold'>Total Amount</th>
                      <th className='p-4.5 text-center font-semibold'>Status</th>
                      <th className='p-4.5 text-center font-semibold'>Action</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-[#1E293B]/50 text-slate-300 text-sm'>
                    {bookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-[#111C3A]/25 transition-colors duration-150">

                        {/* User Details */}
                        <td className='p-4.5 whitespace-nowrap'>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-white">{booking?.user?.fname} {booking?.user?.lname}</span>
                            <span className="text-[11px] text-gray-400 font-medium font-sans">{booking?.user?.mobile}</span>
                          </div>
                        </td>

                        {/* Bike Details */}
                        <td className='p-4.5 whitespace-nowrap'>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-white">{booking?.bike?.name}</span>
                            <span className="text-[11px] text-gray-400">{booking?.bike?.brand}</span>
                            <span className="text-[10px] text-yellow-400 font-mono tracking-wider uppercase">{booking?.bike?.plateNumber}</span>
                          </div>
                        </td>

                        {/* Pickup Info */}
                        <td className='p-4.5 whitespace-nowrap text-xs'>
                          <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-1 text-slate-200"><FiCalendar /> {booking?.pickUpDate ? new Date(booking.pickUpDate).toISOString().split('T')[0] : 'N/A'}</span>
                            <span className="flex items-center gap-1 text-slate-400"><FiClock /> {booking?.pickUpTime}</span>
                            <span className="flex items-center gap-1 text-slate-400"><FiMapPin className="text-yellow-405" /> {booking?.pickUpPoint}</span>
                          </div>
                        </td>

                        {/* Drop Info */}
                        <td className='p-4.5 whitespace-nowrap text-xs'>
                          <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-1 text-slate-200"><FiCalendar /> {booking?.dropDate ? new Date(booking.dropDate).toISOString().split('T')[0] : 'N/A'}</span>
                            <span className="flex items-center gap-1 text-slate-400"><FiClock /> {booking?.dropTime}</span>
                            <span className="flex items-center gap-1 text-slate-400"><FiMapPin className="text-yellow-405" /> {booking?.dropPoint}</span>
                          </div>
                        </td>

                        {/* Total Amount */}
                        <td className='p-4.5 whitespace-nowrap font-bold text-white text-base'>
                          ₹{booking.totalAmount}
                        </td>

                        {/* Status badge */}
                        <td className='p-4.5 text-center whitespace-nowrap'>
                          <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${getStatusClass(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>

                        {/* Action status changes */}
                        <td className='p-4.5 text-center whitespace-nowrap'>
                          <select
                            value={booking.status}
                            onChange={(e) => handleStatus(booking._id, e)}
                            disabled={booking.status === 'cancelled' || booking.status === 'completed'}
                            className='bg-[#0B132B] border border-[#1E293B] text-slate-250 text-xs font-bold uppercase rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-yellow-400 transition-colors inline-block w-40'
                          >
                            <option value="" disabled>Change Status (No Action)</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                          </select>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <p className="text-gray-400 text-sm">No reservations requested yet.</p>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className='bg-[#111C3A]/30 border-t border-[#1E293B]/70 py-4 px-6 flex justify-center items-center gap-1.5'>
                {[...Array(totalPages)].map((val, index) => (
                  <button
                    className={`h-9 w-9 rounded-lg text-xs font-bold transition-all duration-150 ${page === index + 1
                      ? 'bg-yellow-400 text-black'
                      : 'bg-[#1e293b]/60 text-slate-400 hover:text-white hover:bg-slate-700/60'
                      }`}
                    key={index}
                    onClick={() => handleClick(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}

export default BookingsByUser