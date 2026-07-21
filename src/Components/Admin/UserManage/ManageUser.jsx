import React, { useState, useEffect } from 'react'
import SideBar from '../AdminSideBar/Sidebar'
import AdminLoader from '../AdminSideBar/AdminLoader'
import { FiInbox } from 'react-icons/fi'
import Axios from 'axios'
import { adminApi } from '../../../config/api'
import { toast } from 'react-hot-toast'
import Swal from 'sweetalert2'


function ManageUser() {


  const [isOpen, setIsOpen] = useState(() => localStorage.getItem('adminSidebarOpen') === 'true')
  const [loading, setLoading] = useState(true)

  const toggleSidebar = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    localStorage.setItem('adminSidebarOpen', String(nextState));
  };

  const [userData, setUserData] = useState([])

  const findRequest = async () => {
    try {
      const response = await Axios.get(`${adminApi}/users`)
      if (response.data.success) {
        setUserData(response.data.user)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const statusAlert = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#32CD32',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Change Status'
    }).then((result) => {
      if (result.isConfirmed) {
        handleStatus(id)
      }
    })

  }


  const handleStatus = async (id) => {
    try {
      const response = await Axios.put(`${adminApi}/changeUserStatus?id=${id}`)
      if (response.data.success) {
        console.log(response.data.updatedUser, "////////////////////////");
        const updatedRequest = response.data.updatedUser
        const updatedDocumentIdString = updatedRequest._id.toString();
        const updatedIndex = userData.findIndex(request => request._id.toString() === updatedDocumentIdString)

        console.log(updatedIndex);
        const updatedDocuments = [...userData]
        updatedDocuments[updatedIndex] = updatedRequest
        setUserData(updatedDocuments)
        toast.success(response.data.message)
      } else {
        toast.success(response.data.message)
      }
    } catch (error) {
    }
  }


  useEffect(() => {
    findRequest()
  }, [])

  return (
    <div className="mx-auto flex w-full min-h-screen bg-[#0A0F1D] text-slate-100">
      <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={`text-4xl text-center ${!isOpen ? 'pl-[72px]' : 'pl-[240px]'} w-full transition-all duration-300`}>
        <div className='w-full'>
          <h1 className='p-4 text-2xl font-bold bg-[#0F172A] border-b border-slate-800 text-left pl-14 text-slate-100'>User Management</h1>

          <div className='p-6 min-h-[calc(100vh-4rem)] bg-[#0B132B]/50'>

            {loading ? (
              <AdminLoader />
            ) : (
              userData && (
                userData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#111C3A] rounded-xl border border-slate-800 text-center shadow-lg w-full">
                    <FiInbox size={48} className="text-slate-500 mb-3 animate-pulse" />
                    <p className="text-slate-300 text-base font-bold">No data yet</p>
                    <p className="text-slate-500 text-xs mt-1">There are currently no users registered in the system.</p>
                  </div>
                ) : (
                  <div className='overflow-auto rounded-xl shadow-lg border border-slate-800 bg-[#111C3A]'>
                    <table className='w-full'>
                      <thead className='bg-[#0F172A] border-b border-slate-850'>
                        <tr>
                          <th className='p-4 text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 text-left'>First Name</th>
                          <th className='p-4 text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 text-left'>Last Name</th>
                          <th className='p-4 text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 text-left'>Email</th>
                          <th className='p-4 text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 text-left'>Status</th>

                        </tr>
                      </thead>
                      <tbody className='divide-y divide-slate-800 bg-[#111C3A]/50'>
                        {userData.map((user) => {
                          return (
                            <tr key={user._id} className='hover:bg-[#1C2541]/40 transition-colors duration-150'>
                              <td className='p-4 whitespace-nowrap text-sm text-slate-200 text-left'>{user.fname}</td>
                              <td className='p-4 whitespace-nowrap text-sm text-slate-200 text-left'>{user.lname}</td>
                              <td className='p-4 whitespace-nowrap text-sm text-slate-200 text-left'>{user.email}</td>
                              {user.status ? <td className='p-4 whitespace-nowrap text-sm text-slate-200 text-left'><button onClick={() => statusAlert(user._id)} className='bg-rose-600 hover:bg-rose-700 px-3 py-1.5 rounded-lg text-white text-xs font-semibold shadow-md transition-all duration-150'>Block</button></td> : <td className='p-4 whitespace-nowrap text-sm text-slate-200 text-left'><button onClick={() => statusAlert(user._id)} className='bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg text-white text-xs font-semibold shadow-md transition-all duration-150'>Unblock</button></td>}

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
export default ManageUser