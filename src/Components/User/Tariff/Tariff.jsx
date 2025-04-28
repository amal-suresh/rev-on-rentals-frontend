import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar/Navbar'
import UserFooter from '../Footer/UserFooter'
import axios from 'axios'
import { userApi } from '../../../config/api'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

function Tariff() {
  const navigate = useNavigate()
  const [tariff, setTariff] = useState([])
  const [loadingTariff, setLoadingTariff] = useState(false)

  const findBikes = async () => {
    try {
      setLoadingTariff(true)
      const response = await axios.get(`${userApi}getTariff`)
      if (response.data.success) {
        setTariff(response.data.data)
      }
    } catch (error) {
      console.log(error.message)
    } finally {
      setLoadingTariff(false)
    }
  }

  useEffect(() => {
    findBikes()
  }, [])

  return (
    <div className='-z-0 bg-black'>
      <Navbar />
      <div className='w-full flex justify-center  mt-20'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-[1500px]'>
          {loadingTariff ? (
            <div className='flex justify-center items-center w-full h-[300px]'>
              <AiOutlineLoading3Quarters className='animate-spin text-yellow-400 text-3xl' />
            </div>
          ) : (
            tariff?.map((bike, i) => (
              <motion.div
                key={bike._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className='p-1 m-1 rounded-xl border-2 border-gray-900 bg-yellow-300'
              >
                <div className='flex w-full justify-center'>
                  <p className='font-semibold'>{bike.name}</p>
                </div>

                <div className="block rounded-lg bg-gray-500">
                  <div className="relative overflow-hidden bg-cover bg-no-repeat">
                    <img className="rounded-t-lg -z-0 relative" src={bike.image[0]} alt="bike" />
                  </div>
                  <div className='px-2 py-2 text-white font-semibold'>
                    <p>Amount {bike.rentPerHour} Per Hour</p>
                    <p>Engine {bike.engineCC} CC</p>
                  </div>
                  <div className='p-1'>
                    <button onClick={() => navigate('/viewBikes')} className='w-full rounded font-bold py-1 hover:bg-black hover:text-yellow-400 bg-yellow-400'>
                      BOOK NOW
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
      <UserFooter />
    </div>
  )
}

export default Tariff
