import React, { useState, useEffect } from 'react'
import SideBarPartner from '../PartnerSideBar/SideBarPartner'
import Axios from 'axios'
import { partnerApi } from '../../../config/api'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { TiDelete } from 'react-icons/ti'
import Swal from 'sweetalert2'
import { FiPlus, FiEye, FiEyeOff } from 'react-icons/fi'

function ViewBikesPartner() {
  const partner = useSelector((store) => store.partner.partnerD)
  const token = partner.token
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(() => localStorage.getItem('partnerSidebarOpen') === 'true')
  const [bikes, setbikes] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const [isVerified, setIsVerified] = useState(true)
  const [checkingStatus, setCheckingStatus] = useState(true)

  const findBikes = async () => {
    try {
      const response = await Axios.get(`${partnerApi}/viewBikes?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      })
      if (response.data.success) {
        setbikes(response.data.data.bikes)
        setPage(response.data.data.page)
        setTotalPages(response.data.data.totalPages)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  const handleStatus = async (id) => {
    try {
      const response = await Axios.get(`${partnerApi}/changeStatus?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (response.data.success) {
        const updatedRequest = response.data.updatedData
        const updatedDocumentIdString = updatedRequest._id.toString();
        const updatedIndex = bikes.findIndex(request => request._id.toString() === updatedDocumentIdString)
        const updatedDocuments = [...bikes]
        updatedDocuments[updatedIndex] = updatedRequest
        setbikes(updatedDocuments)
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  const handleClick = (index) => {
    setPage(index + 1)
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
      findBikes()
    }
  }, [page, token, isVerified])

  const alertDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#FACC15',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Delete Bike'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBike(id)
      }
    })
  }

  const alertHideUnhide = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Update status of this motorcycle?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#FACC15',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Change Status'
    }).then((result) => {
      if (result.isConfirmed) {
        handleStatus(id)
      }
    })
  }

  const deleteBike = async (id) => {
    try {
      const response = await Axios.delete(`${partnerApi}/deleteBike?id=${id}`)
      if (response.data.success) {
        const bikeIndexToDelete = bikes.findIndex((bike) => bike._id === id);
        if (bikeIndexToDelete !== -1) {
          const updatedBikes = [...bikes];
          updatedBikes.splice(bikeIndexToDelete, 1);
          setbikes(updatedBikes);
        }
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.error(error.message)
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

        {/* Header ribbon */}
        <div className='w-full bg-[#111C3A]/40 border-b border-[#1E293B]/70 py-4 px-6 sm:px-10 flex items-center justify-between'>
          <h1 className='text-xl sm:text-2xl font-bold uppercase tracking-wider font-passion text-white'>
            Partner Bikes
          </h1>
          <button
            onClick={() => { navigate("/partner/addBikes") }}
            className='flex items-center gap-1.5 px-4.5 py-2 bg-yellow-400 hover:bg-yellow-500 font-extrabold text-xs text-black uppercase tracking-wider rounded-lg shadow-md shadow-yellow-400/10 hover:shadow-yellow-400/20 transform hover:-translate-y-0.5 transition-all duration-150'
          >
            <FiPlus size={15} /> Add Bike
          </button>
        </div>

        <div className='p-6 sm:p-10 flex-grow'>
          <div className="bg-[#111C3A]/20 border border-[#1E293B]/50 rounded-xl overflow-hidden shadow-xl">

            {bikes && bikes.length > 0 ? (
              <div className='w-full overflow-x-auto'>
                <table className='w-full border-collapse'>
                  <thead>
                    <tr className='bg-[#111C3A]/60 border-b border-[#1E293B]/70 text-gray-300 text-xs font-bold uppercase tracking-wider'>
                      <th className='p-4.5 text-left font-semibold'>Image</th>
                      <th className='p-4.5 text-left font-semibold'>Name</th>
                      <th className='p-4.5 text-left font-semibold'>Brand</th>
                      <th className='p-4.5 text-left font-semibold'>Category</th>
                      <th className='p-4.5 text-left font-semibold'>Make Year</th>
                      <th className='p-4.5 text-left font-semibold'>Rent / hr</th>
                      <th className='p-4.5 text-left font-semibold'>Plate Number</th>
                      <th className='p-4.5 text-left font-semibold'>Engine CC</th>
                      <th className='p-4.5 text-center font-semibold'>Visibility</th>
                      <th className='p-4.5 text-center font-semibold'>Delete</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-[#1E293B]/50 text-slate-300 text-sm'>
                    {bikes.map((bike) => (
                      <tr key={bike._id} className="hover:bg-[#111C3A]/25 transition-colors duration-150">
                        <td className='p-4.5'>
                          <div className="w-16 h-10 rounded overflow-hidden bg-slate-800 flex items-center justify-center border border-slate-700">
                            <img src={bike.image[0]} className='object-cover w-full h-full' alt="bike" />
                          </div>
                        </td>
                        <td className='p-4.5 font-semibold text-white whitespace-nowrap'>{bike.name}</td>
                        <td className='p-4.5 whitespace-nowrap'>{bike.brand}</td>
                        <td className='p-4.5 whitespace-nowrap'>{bike.category}</td>
                        <td className='p-4.5 whitespace-nowrap'>{bike.makeYear}</td>
                        <td className='p-4.5 whitespace-nowrap font-bold text-yellow-400'>₹{bike.rentPerHour}</td>
                        <td className='p-4.5 whitespace-nowrap uppercase text-xs font-mono bg-slate-900/50 px-2 py-1.5 rounded border border-slate-800 w-fit'>{bike.plateNumber}</td>
                        <td className='p-4.5 whitespace-nowrap'>{bike.engineCC} cc</td>
                        <td className='p-4.5 text-center whitespace-nowrap'>
                          <button
                            onClick={() => alertHideUnhide(bike._id)}
                            className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider transition-all duration-150 ${bike.status
                              ? 'bg-rose-500/10 text-rose-455 border border-rose-500/20 hover:bg-rose-500/20'
                              : 'bg-emerald-500/10 text-emerald-455 border border-emerald-500/20 hover:bg-emerald-500/20'
                              }`}
                          >
                            {bike.status ? 'Hide' : 'Unhide'}
                          </button>
                        </td>
                        <td className='p-4.5 text-center'>
                          <button
                            onClick={() => alertDelete(bike._id)}
                            className="p-1.5 hover:bg-rose-500/10 rounded-lg text-rose-500 transition-colors cursor-pointer"
                          >
                            <TiDelete size={24} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <p className="text-gray-400 text-sm mb-4">No bikes uploaded yet.</p>
                <button
                  onClick={() => { navigate("/partner/addBikes") }}
                  className="px-4 py-2 border border-yellow-400/20 hover:border-yellow-400/55 rounded-lg text-yellow-400 text-xs font-extrabold uppercase tracking-widest transition-all"
                >
                  Add Your First Bike
                </button>
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

export default ViewBikesPartner