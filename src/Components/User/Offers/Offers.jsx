import React, { useState, useEffect } from 'react'
import bikeImg from '../../../images/offers.jpg'
import Navbar from '../Navbar/Navbar'
import UserFooter from '../Footer/UserFooter'
import axios from 'axios'
import { userApi } from '../../../config/api'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const Offers = () => {
  const [coupons, setCoupons] = useState([])

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(`${userApi}getCoupons`)
      console.log(response.data.data)
      if (response.data.success) {
        setCoupons(response.data.data)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  return (
    <div>
      <Navbar />
      <h1 className='md:block hidden font-bold absolute text-[2rem] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-400 drop-shadow-lg font-rubik-vinyl [word-spacing:15px]'>
        REV-ON Offers Check it out
      </h1>
      <p className='md:hidden block font-bold absolute top-[9rem] left-[6rem] text-[10px] text-yellow-400 drop-shadow-lg font-rubik-vinyl [word-spacing:15px]'>
        REV-ON Offers Check it out
      </p>

      <img src={bikeImg} alt="bike img" />

      <div className='bg-black'>
        <div className='grid py-5 md:py-8 grid-cols-1 px- sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 max-w-[1500px]'>
          {coupons && coupons.map((coupon, i) => (
            <motion.div
              key={coupon._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className='p-1 m-1 rounded-xl border-2 border-gray-900 bg-yellow-300'
            >
              <div className='flex w-full justify-center'>
                <p className='font-semibold'>{coupon.couponName}</p>
              </div>
              <div className="block rounded-lg bg-gray-500">
                <div className="relative overflow-hidden bg-cover bg-no-repeat">
                  <img className='w-100 h-100' src={coupon.image} alt='' />
                </div>
                <div className='px-2 text-white font-semibold'>
                  {/* (You can add more details about the coupon here if you want) */}
                </div>
                <div className="p-1">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(coupon.couponCode)
                      toast.success("Code Copied")
                    }}
                    className="w-full rounded font-bold py-1 hover:bg-black hover:text-yellow-400 border-2 border-black hover:border-white bg-yellow-400"
                  >
                    COPY CODE
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <UserFooter />
    </div>
  )
}

export default Offers
