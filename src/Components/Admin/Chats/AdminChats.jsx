import React, { useState, useEffect } from 'react'
import SideBar from '../AdminSideBar/Sidebar'
import AdminLoader from '../AdminSideBar/AdminLoader'
import Axios from 'axios'
import { adminApi } from '../../../config/api'
import { toast } from 'react-hot-toast'
import { io } from 'socket.io-client'
import { socketApi } from '../../../config/api'
import { GrSend } from 'react-icons/gr'

function AdminChats() {
  const Socket = io.connect(socketApi)
  const [isOpen, setIsOpen] = useState(() => localStorage.getItem('adminSidebarOpen') === 'true')
  const [loading, setLoading] = useState(true)

  const toggleSidebar = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    localStorage.setItem('adminSidebarOpen', String(nextState));
  };
  const [chats, setChats] = useState([])
  const [individualChat, setIndividualChat] = useState([])
  const [textToSent, setTextToSent] = useState('')

  const fetchChats = async () => {
    try {
      const response = await Axios.get(`${adminApi}/fetchChat`)
      if (response.data.success) {
        setChats(response.data.data)
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false)
    }
  }


  const fetchIndividualChat = async (id) => {
    try {
      const response = await Axios.get(`${adminApi}/fetchIndividualChat?id=${id}`)
      if (response.data.success) {
        setIndividualChat(response.data.data)
      } else {
        console.log(response);
      }

    } catch (error) {
      console.log(error.message);
    }
  }

  const handleOnChange = (e) => {
    const { value } = e.target
    setTextToSent(value)
  }

  const sendMessage = async () => {

    if (textToSent !== '') {
      const userId = individualChat[0]?.user
      console.log(userId, "user id admin side");
      const newMessage = {
        user: userId,
        text: textToSent,
        sender: "Admin",
      };
      await Socket.emit('send_message', newMessage);
      setTextToSent('')
    } else {
      toast.success("message box can't be null")
    }


  }
  useEffect(() => {
    fetchChats()
  }, [])

  useEffect(() => {

    Socket.on('receive_message', (data) => {

      setIndividualChat((prevMessages) => [...prevMessages, data]);
    });
    return () => {
      Socket.disconnect()
    }

  }, [individualChat, Socket]);





  return (
    <div className="mx-auto flex w-full min-h-screen bg-[#0A0F1D] text-slate-100">
      <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={`text-4xl text-center ${!isOpen ? 'pl-[72px]' : 'pl-[240px]'} w-full transition-all duration-350`}>
        <div className='w-full'>
          <h1 className='p-4 text-2xl font-bold bg-[#0F172A] border-b border-slate-800 text-left pl-14 text-slate-100'>Chats</h1>

          <div className='p-6 min-h-[calc(100vh-4rem)] bg-[#0B132B]/50'>
            {loading ? (
              <AdminLoader />
            ) : (
              <div className='overflow-hidden rounded-xl shadow-lg border border-slate-800 bg-[#111C3A] flex h-[34rem] w-full'>
                <div className='w-[30%] bg-[#0F172A] h-full overflow-y-auto border-r border-[#1C2541]'>
                  {chats && chats.map((chat) => (
                    <div key={chat.userDetails._id} onClick={() => { fetchIndividualChat(chat.userDetails._id) }} className='w-full flex bg-[#111C3A] hover:bg-[#1E2E5D]/30 items-center px-4 py-3 border-b border-[#1C2541]/50 cursor-pointer transition-colors duration-150'>
                      <div className='flex-shrink-0'>
                        <img className='w-12 h-12 rounded-full object-cover border border-slate-800' src={`${chat.userDetails.image}`} alt="" />
                      </div>
                      <div className='flex flex-col w-[80%] pl-3'>
                        <div className='flex flex-row justify-between w-full items-baseline'>
                          <p className='text-sm font-semibold text-slate-200 truncate'>{chat.userDetails.fname} {chat.userDetails.lname}</p>
                          <p className='text-[9px] text-slate-500 font-medium whitespace-nowrap'>{chat.time}</p>
                        </div>
                        <div className='flex justify-start w-full mt-1'>
                          <p className='text-xs text-slate-400 text-start truncate w-full'>{chat.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className='w-[70%] bg-[#111C3A] h-full flex flex-col'>
                  <div className='flex-1 bg-[#0A0F1D]/40 px-6 py-6 overflow-y-auto space-y-4'>
                    {individualChat && individualChat.map((message) =>
                    (
                      <div key={message._id || Math.random()} className={`w-full flex ${message.sender === "Admin" ? 'justify-end' : 'justify-start'}`}>
                        <div className={`${message.sender === 'Admin' ? 'bg-sky-600 text-white rounded-2xl rounded-tr-none' : 'bg-[#0B132B] border border-slate-800 text-slate-205 rounded-2xl rounded-tl-none'} h-auto px-4 py-2.5 max-w-[70%] shadow-md`}>
                          <p className='text-start text-sm font-medium leading-relaxed'>{message.text}</p>

                          <div className='flex justify-end w-full mt-1'>
                            <p className='text-[8px] text-slate-440 font-medium'>{message.time}</p>
                          </div>

                        </div>
                      </div>
                    )
                    )}
                  </div>
                  <div className='p-3 bg-[#0F172A] border-t border-[#1C2541] flex items-center justify-between'>
                    <div className='flex flex-row items-center w-full gap-3'>
                      <input onChange={handleOnChange} value={textToSent} className='w-full bg-[#0B132B] border border-slate-800 text-sm rounded-lg py-2.5 px-4 text-slate-200 placeholder-slate-500 outline-none focus:border-sky-505 transition-colors duration-150' type="text" placeholder='Type a message' />
                      <button onClick={sendMessage} className='bg-sky-600 hover:bg-sky-700 text-white p-2.5 rounded-lg font-semibold shadow-md transition-colors duration-150 flex items-center justify-center'><GrSend size={18} /></button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
export default AdminChats