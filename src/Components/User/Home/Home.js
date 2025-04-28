import React, { useState, useEffect } from 'react'
import Navbar from '../Navbar/Navbar'
import UserFooter from '../Footer/UserFooter'
import bikeImg from '../../../images/HusqvarnaVitpilen701.jpeg'
import { TbMessageChatbot } from 'react-icons/tb'
import { CgCloseO } from 'react-icons/cg'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import axios from 'axios'
import { userApi } from '../../../config/api'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import { socketApi } from '../../../config/api'
import { motion, AnimatePresence } from 'framer-motion'

function Home() {
  const Socket = io.connect(socketApi)

  const [chatOpen, setchatOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [userChats, setUserChats] = useState([])
  const [obj, setObj] = useState([])
  const [loadingFleet, setLoadingFleet] = useState(false)
  const [loadingChat, setLoadingChat] = useState(false)

  const navigate = useNavigate()
  const user = useSelector((store) => store.user.userD)

  const handleChange = (e) => {
    setMessage(e.target.value)
  }

  const fetchChat = async (token) => {
    try {
      setLoadingChat(true)
      const response = await axios.get(`${userApi}fetchIndividualChat`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data.success) {
        setUserChats(response.data.data)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error("Failed to fetch chat")
    } finally {
      setLoadingChat(false)
    }
  }

  const findBikes = async () => {
    try {
      setLoadingFleet(true)
      const response = await axios.get(`${userApi}ourFleet`)
      if (response.data.success) {
        setObj(response.data.data)
      } else {
        toast.error("Couldn't fetch bikes")
      }
    } catch (error) {
      toast.error("Something went wrong while fetching bikes")
    } finally {
      setLoadingFleet(false)
    }
  }

  const handleClick = async () => {
    if (user?.token) {
      if (message.trim() !== '') {
        const newMessage = {
          user: user?.id,
          text: message,
          sender: "User",
        }
        await Socket.emit('send_message', newMessage)
        setMessage('')
        toast.success("Message sent!")
      } else {
        toast.error("Message can't be empty")
      }
    } else {
      navigate('/login')
    }
  }

  useEffect(() => {
    Socket.on('receive_message', (data) => {
      setUserChats((prev) => [...prev, data])
    })
    return () => {
      Socket.disconnect()
    }
  }, [])

  useEffect(() => {
    const token = user?.token
    token && fetchChat(token)
    findBikes()
  }, [user])

  return (
    <div className='flex flex-col max-w-[1600px]'>
      <Navbar />

      <div className='md:justify-start bg-cover bg-no-repeat bg-center h-[600px] w-full'
        style={{ backgroundImage: `url(${bikeImg})` }}>
        <h1 className='text-yellow-400 mt-[12rem] ml-6 drop-shadow-lg text-[3rem] font-bold font-rubik-vinyl'>
          Plan Your Next Ride Now
        </h1>
        <div className='w-[83%] flex md:pl-[18%] pl-[35%]'>
          <button onClick={() => navigate('/viewBikes')} className='bg-black font-bold text-[1rem] px-4 py-3 cursor-pointer hover:border border-yellow-400 rounded-sm text-white'>
            BOOK NOW
          </button>
        </div>
      </div>

      <div className='bg-black'>
        <p className='text-center font-bold text-white text-[2.2rem] mt-10 font-passion tracking-wider'>OUR FLEET</p>

        {loadingFleet ? (
          <div className='flex justify-center py-10'>
            <AiOutlineLoading3Quarters className='animate-spin text-yellow-400 text-3xl' />
          </div>
        ) : (
          <div className='grid py-5 md:py-8 grid-cols-1 px-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-[1500px]'>
            {obj.map((bike, i) => (
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
                <div className='block rounded-lg bg-gray-500'>
                  <div className='relative overflow-hidden bg-cover bg-no-repeat'>
                    <img className='rounded-t-lg' src={bike.image[0]} alt="bike" />
                  </div>
                  <div className='px-2 text-white font-semibold'>
                    <p>Amount {bike.rentPerHour} Per Hour</p>
                    <p>Engine {bike.engineCC} CC</p>
                  </div>
                  <div className='p-1'>
                    <button onClick={() => navigate('/viewBikes')} className='w-full rounded font-bold py-1 hover:bg-black hover:text-yellow-400 bg-yellow-400'>BOOK NOW</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Popup */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className='w-[20rem] h-[24rem] fixed end-2 rounded-lg bottom-10 bg-gray-100'
          >
            <div className='w-full flex justify-between pt-2 px-2'>
              <p className='text-xl text-yellow-400 font-bold'>CHAT WITH US</p>
              <CgCloseO onClick={() => setchatOpen(false)} size={24} className='text-black cursor-pointer' />
            </div>

            <div className='h-[19rem] w-[20rem] bg-gray-200 px-1 py-2 overflow-y-scroll'>
              {loadingChat ? (
                <div className='flex justify-center items-center h-full'>
                  <AiOutlineLoading3Quarters className='animate-spin text-yellow-500 text-xl' />
                </div>
              ) : (
                userChats.map((msg, i) => (
                  <div key={i} className={`w-full flex ${msg.sender === "User" ? 'justify-end' : 'justify-start'} pt-1`}>
                    <div className={`ml-2 min-w-[5rem] bg-slate-300 px-2 py-1 flex flex-col ${msg.sender === 'Admin' ? 'rounded-r-md rounded-bl-md' : 'rounded-l-md rounded-br-md'}`}>
                      <p className='text-start text-[15px]'>{msg.text}</p>
                      <div className='flex justify-end w-full'>
                        <p className='text-[8px] font-semibold italic'>10:00 am {msg.sender === "User" && <span className='pl-1 text-blue-800'>&#10003;&#10003;</span>}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className='flex items-center justify-center'>
              <input onChange={handleChange} value={message} className='w-[75%] text-sm focus:outline-none border border-slate-300 px-3 py-2 rounded-l-lg' type="text" placeholder='Ask Something ?' />
              <button onClick={handleClick} className='w-[20%] bg-black flex justify-center text-yellow-300 font-bold py-2 rounded-r-lg'>Send</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Icon */}
      {!chatOpen && (
        <motion.div
          whileHover={{ scale: 1.1 }}
          className='w-20 fixed end-5 bottom-5 h-20 flex justify-center items-center bg-gray-700 rounded-full cursor-pointer'
          onClick={() => user?.token ? setchatOpen(true) : navigate('/login')}
        >
          <TbMessageChatbot size={40} className='text-yellow-400' />
        </motion.div>
      )}

      <UserFooter />
    </div>
  )
}

export default Home
