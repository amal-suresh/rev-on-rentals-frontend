import React, { useState, useEffect } from 'react'
import SideBar from '../AdminSideBar/Sidebar'
import AdminLoader from '../AdminSideBar/AdminLoader'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import { FiInbox } from 'react-icons/fi'
import Axios from 'axios'
import { adminApi } from '../../../config/api'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { TiDelete } from 'react-icons/ti'
import Swal from 'sweetalert2'
import axios from 'axios'


function ViewCoupons() {
  const [isOpen, setIsOpen] = useState(() => localStorage.getItem('adminSidebarOpen') === 'true')
  const [loading, setLoading] = useState(true)

  const toggleSidebar = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    localStorage.setItem('adminSidebarOpen', String(nextState));
  };
  const [modalStatus, setModalStatus] = useState(false)
  const initialValues = { couponCode: "", couponName: "", limit: "", expireDate: "", minPurchase: "", discountValue: "", maxDiscount: "" }
  const [imgUrl, setImgUrl] = useState(null)
  const [imgCoupon, setImgCoupon] = useState(null)
  const [formValues, setFormValues] = useState(initialValues)
  const [coupons, setCoupons] = useState([])

  const fetchData = async (req, res) => {
    try {
      const response = await axios.get(`${adminApi}/coupons`)
      console.log(response.data);
      if (response.data.success) {
        setCoupons(response.data.data)
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchData()

  }, [])



  const navigate = useNavigate()

  const handleChange = (e) => {
    const { value, name } = e.target;
    const newvalue = value.trim()
    setFormValues({ ...formValues, [name]: newvalue, });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!imgCoupon) {
      toast.error("select image")
    } else {
      const formData = new FormData()
      formData.append('image', imgCoupon)
      for (const [key, value] of Object.entries(formValues)) {
        formData.append(key, value)
      }
      const response = await axios.post(`${adminApi}/addCoupon`, formData)
      if (response.data.success) {
        setModalStatus(false)
        setImgCoupon(null)
        setImgUrl(null)
        fetchData()
        toast.success(response.data.message)
      }


    }


  }

  const handleImg = (e) => {
    const file = e.target.files[0]
    const url = URL.createObjectURL(file)
    setImgUrl(url)
    setImgCoupon(file)
  }

  const changestatus = async (id) => {
    try {

      const response = await axios.get(`${adminApi}/changeCouponStatus?id=${id}`)
      if (response.data.success) {
        toast.success(response.data.message)
        fetchData()
      }

    } catch (error) {
      console.log(error.message);

    }
  }
  const deleteCoupon = async (id) => {
    try {

      const response = await axios.get(`${adminApi}/deleteCoupon?id=${id}`)
      if (response.data.success) {
        toast.success(response.data.message)
        fetchData()
      }

    } catch (error) {
      console.log(error.message);

    }
  }




  return (
    <div className="mx-auto flex w-full min-h-screen bg-[#0A0F1D] text-slate-100">
      <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={`text-4xl text-center ${!isOpen ? 'pl-[72px]' : 'pl-[240px]'} w-full transition-all duration-300`}>
        <div className='w-full'>
          <h1 className='p-4 text-2xl font-bold bg-[#0F172A] border-b border-slate-800 text-left pl-14 text-slate-100'>Coupons</h1>

          <div className='p-6 min-h-[calc(100vh-4rem)] bg-[#0B132B]/50'>
            <div className="flex justify-end px-2 my-3">
              <button className="block text-white bg-sky-600 hover:bg-sky-700 font-semibold rounded-lg text-sm px-4 py-2.5 text-center shadow-lg transition-all duration-150" type="button" onClick={() => setModalStatus(true)}>ADD NEW COUPON</button>
            </div>

            <div className={`flex justify-center items-center fixed top-0 left-0 right-0 z-50 ${modalStatus ? 'block' : 'hidden'} w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-full backdrop-blur-sm bg-slate-950/60`}>
              <div className="relative w-full max-w-md max-h-full">
                <div className="relative bg-[#111C3A] border border-slate-800 rounded-xl shadow-2xl">
                  <button type="button" className="absolute top-3 right-3 text-slate-400 bg-transparent hover:bg-slate-800 hover:text-white rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center font-bold" data-modal-hide="authentication-modal"
                    onClick={() => {
                      setModalStatus(false)
                    }}>
                    ✕
                    <span className="sr-only">Close modal</span>
                  </button>
                  <div className="px-6 py-6 lg:px-8">
                    <h3 className="text-center mb-4 text-xl font-bold text-sky-400">Add Coupon</h3>
                    <form className="space-y-4">
                      <div className="photo-wrapper p-2 flex flex-col justify-center items-center ">
                        <div className='flex justify-start w-full'>
                          <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-slate-350">Coupon Image</label>
                        </div>
                        <label className='absolute text-transparent hover:text-white cursor-pointer z-10' htmlFor="profileFile"> <AiOutlinePlusCircle size={32} /></label>
                        <input onChange={handleImg} type="file" name='image' className='invisible hidden' id='profileFile' />
                        <img className="w-[15rem] h-24 rounded-lg mx-auto border border-slate-800 object-cover" src={imgUrl ? imgUrl : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyjIETUUbI4Zxo0mIbafwIS6P3gEfxazlf-21gorP2nH937_nWnGI9E7SpK9fHWDiGzXs&usqp=CAU"} alt='ss' />
                        <p className='text-sm text-slate-405 mt-2'>{imgCoupon ? imgCoupon.name : ""}</p>
                      </div>
                      <div>
                        <div className='flex justify-start'>
                          <label className="text-start mb-1 text-xs font-bold uppercase tracking-wider text-slate-300">Coupon Name</label>
                        </div>
                        <input onChange={handleChange} type="text" name="couponName" value={formValues.couponName} className="bg-[#0B132B] border border-slate-800 text-slate-202 text-sm rounded-lg focus:ring-sky-505 focus:border-sky-505 block w-full p-2.5 placeholder-slate-500" placeholder="Enter Coupon Name" required />
                      </div>
                      <div>
                        <div className='flex justify-start'>
                          <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-slate-300">Coupon Code</label>
                        </div>
                        <input onChange={handleChange} type="text" name="couponCode" value={formValues.couponCode} className="bg-[#0B132B] border border-slate-805 text-slate-202 text-sm rounded-lg focus:ring-sky-505 focus:border-sky-505 block w-full p-2.5 placeholder-slate-550" placeholder="Enter Coupon Code" required />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className='flex justify-start'>
                            <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-slate-300">Discount Value</label>
                          </div>
                          <input onChange={handleChange} type="number" value={formValues.discountValue} name="discountValue" placeholder="Value" className="bg-[#0B132B] border border-slate-800 text-slate-202 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 placeholder-slate-500" required />
                        </div>
                        <div>
                          <div className='flex justify-start'>
                            <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-slate-300">Min Purchase</label>
                          </div>
                          <input onChange={handleChange} type="number" value={formValues.minPurchase} name="minPurchase" placeholder="Min Spend" className="bg-[#0B132B] border border-slate-800 text-slate-202 text-sm rounded-lg focus:ring-sky-550 focus:border-sky-505 block w-full p-2.5 placeholder-slate-505" required />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className='flex justify-start'>
                            <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-slate-300">Max Discount</label>
                          </div>
                          <input onChange={handleChange} value={formValues.maxDiscount} type="number" name="maxDiscount" placeholder="Max" className="bg-[#0B132B] border border-slate-800 text-slate-202 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 placeholder-slate-505" required />
                        </div>
                        <div>
                          <div className='flex justify-start'>
                            <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-slate-300">Limit</label>
                          </div>
                          <input onChange={handleChange} value={formValues.limit} type="number" name="limit" placeholder="Limit" className="bg-[#0B132B] border border-slate-800 text-slate-202 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 placeholder-slate-500" required />
                        </div>
                      </div>

                      <div>
                        <div className='flex justify-start'>
                          <label className="block mb-1 text-xs font-bold uppercase tracking-wider text-slate-300">Expire Date</label>
                        </div>
                        <input onChange={handleChange} value={formValues.expireDate} type="date" name="expireDate" className="bg-[#0B132B] border border-slate-850 text-slate-250 text-sm rounded-lg focus:ring-sky-550 focus:border-sky-550 block w-full p-2.5" required />
                      </div>

                      <button onClick={handleSubmit} className="w-full text-white bg-emerald-650 hover:bg-emerald-700 font-semibold rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-150 mt-2">Save Coupon</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <AdminLoader />
            ) : (
              coupons && (
                coupons.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#111C3A] rounded-xl border border-slate-800 text-center shadow-lg w-full">
                    <FiInbox size={48} className="text-slate-500 mb-3 animate-pulse" />
                    <p className="text-slate-300 text-base font-bold">No data yet</p>
                    <p className="text-slate-500 text-xs mt-1">There are currently no coupons created yet.</p>
                  </div>
                ) : (
                  <div className='overflow-auto rounded-xl shadow-lg border border-slate-800 bg-[#111C3A]'>
                    <table className='w-full'>
                      <thead className='bg-[#0F172A] border-b border-slate-850'>
                        <tr>
                          <th className='p-4 text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 text-left'>Image</th>
                          <th className='p-4 text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 text-left'>C.Name</th>
                          <th className='p-4 text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 text-left'>C.Code</th>
                          <th className='p-4 text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 text-left'>Discount Value</th>
                          <th className='p-4 text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-805 text-left'>Min Purchase</th>
                          <th className='p-4 text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-805 text-left'>Max Discount</th>
                          <th className='p-4 text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-805 text-left'>Expire Date</th>
                          <th className='p-4 text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-805 text-left'>Limit</th>
                          <th className='p-4 text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-805 text-left'>Status</th>
                          <th className='p-4 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-805 text-left'>Delete</th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-slate-800 bg-[#111C3A]/50'>
                        {coupons.map((coupon) => {
                          return (
                            <tr key={coupon._id} className='hover:bg-[#1C2541]/40 transition-colors duration-150'>
                              <td className='p-4 whitespace-nowrap text-sm text-slate-200 text-left'><img className='w-20 h-12 object-cover rounded-md border border-slate-800' src={coupon.image} alt="img" /></td>
                              <td className='p-4 whitespace-nowrap text-sm text-slate-200 text-left font-semibold'>{coupon.couponName}</td>
                              <td className='p-4 whitespace-nowrap text-sm text-slate-200 text-left'><code className="bg-[#0B132B] text-sky-400 px-2 py-1 rounded border border-[#1E2E5D]/30">{coupon.couponCode}</code></td>
                              <td className='p-4 whitespace-nowrap text-sm text-slate-200 text-left'>₹{coupon.discountValue}</td>
                              <td className='p-4 whitespace-nowrap text-sm text-slate-202 text-left'>₹{coupon.minPurchase}</td>
                              <td className='p-4 whitespace-nowrap text-sm text-slate-202 text-left'>₹{coupon.maxDiscount}</td>
                              <td className='p-4 whitespace-nowrap text-sm text-slate-202 text-left'>{coupon.expireDate}</td>
                              <td className='p-4 whitespace-nowrap text-sm text-slate-202 text-left'>{coupon.limit}</td>
                              {coupon.status ? <td className='p-4 whitespace-nowrap text-sm text-slate-202 text-left'><button onClick={() => changestatus(coupon._id)} className='bg-rose-600 hover:bg-rose-700 px-3 py-1.5 rounded-lg text-white text-xs font-semibold shadow-md transition-all duration-150'>Deactivate</button></td> : <td className='p-4 whitespace-nowrap text-sm text-slate-202 text-left'><button onClick={() => changestatus(coupon._id)} className='bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg text-white text-xs font-semibold shadow-md transition-all duration-150'>Activate</button></td>}
                              <td className='p-4 whitespace-nowrap text-sm text-slate-202 text-left'><button onClick={() => deleteCoupon(coupon._id)} className='text-rose-500 hover:text-rose-400 font-extrabold text-sm ml-2'>✕</button></td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )
              )
            )}

          </div>
        </div>
      </div>
    </div>


  )
}

export default ViewCoupons