import React, { useState, useEffect } from 'react'
import SideBar from '../AdminSideBar/Sidebar'
import AdminLoader from '../AdminSideBar/AdminLoader'
import { FiInbox } from 'react-icons/fi'
import Axios from 'axios'
import { adminApi } from '../../../config/api'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import Swal from 'sweetalert2'


function PartnerRequest() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(() => localStorage.getItem('adminSidebarOpen') === 'true')
  const [loading, setLoading] = useState(true)

  const toggleSidebar = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    localStorage.setItem('adminSidebarOpen', String(nextState));
  };

  const [requests, setRequests] = useState([])

  const findRequest = async () => {
    try {
      const response = await Axios.get(`${adminApi}/partnerRequests`)
      if (response.data.success) {
        setRequests(response.data.data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const rejectPartner = async (email) => {
    const response = await Axios.get(`${adminApi}/rejectPartner?email=${email}`)
    if (response.data.success) {

      setRequests(requests.filter((request) => request.email !== email))

    }
  }

  const sendMailPartner = async (email) => {
    const response = await Axios.get(`${adminApi}/sendMailToPartner?email=${email}`)
    if (response.data.success) {
      setRequests(response.data.data)
      toast.success(response.data.message)
    } else {
      toast.error(response.data.message)


    }

  }


  const handleStatus = async (id) => {
    try {
      const response = await Axios.put(`${adminApi}/changeStatus?id=${id}`)
      if (response.data.success) {
        const updatedRequest = response.data.updatedrequest
        const updatedDocumentIdString = updatedRequest._id.toString();
        const updatedIndex = requests.findIndex(request => request._id.toString() === updatedDocumentIdString)
        const updatedDocuments = [...requests]
        updatedDocuments[updatedIndex] = updatedRequest
        setRequests(updatedDocuments)
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
    }
  }

  const viewPartner = (data) => {

    navigate('/admin/partnerSingleView', { state: { data } })

    // const response = await Axios.get(`${adminApi}/viewPartner?id=${id}`)
    // if(response.data.success){
    //   alert("success")
    // }
  }
  useEffect(() => {
    findRequest()
  }, [])

  const rejectAlert = (email) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#32CD32',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Reject Request'
    }).then((result) => {
      if (result.isConfirmed) {
        rejectPartner(email)
      }
    })

  }



  const acceptAlert = (partner) => {
    const isAadhaarMissing = !partner.documents?.aadhaar && !partner.aadhaar;
    const isPanMissing = !partner.documents?.pan && !partner.pan;
    const isGstMissing = !partner.documents?.gstNo && !partner.gstNo;
    const bank = partner.bankDetails;
    const isBankMissing = !bank ||
      !(bank.accountHolderName || bank.accHolderName) ||
      !(bank.accountNumber || bank.accNumber) ||
      !bank.bankName ||
      !bank.branchName ||
      !bank.ifscCode;

    if (isAadhaarMissing || isPanMissing || isGstMissing || isBankMissing) {
      let missingFields = [];
      if (isAadhaarMissing) missingFields.push("Aadhaar Card");
      if (isPanMissing) missingFields.push("PAN Card");
      if (isGstMissing) missingFields.push("GST Number");
      if (isBankMissing) missingFields.push("Complete Bank Details (Holder Name, Account No, Bank, Branch, IFSC)");

      Swal.fire({
        title: 'Cannot Verify Partner',
        html: `<div class="text-left text-xs space-y-2 mt-2 leading-relaxed">
                 <p class="font-bold text-rose-400">The partner has not submitted all required details:</p>
                 <ul class="list-disc list-inside text-slate-300 pl-2">
                   ${missingFields.map(field => `<li>${field}</li>`).join('')}
                 </ul>
                 <p class="pt-2 text-slate-400">Please view their detail page or notify the partner to complete their profile.</p>
               </div>`,
        icon: 'error',
        confirmButtonColor: '#FACC15',
        confirmButtonText: 'Close'
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#32CD32',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Accept!'
    }).then((result) => {
      if (result.isConfirmed) {
        sendMailPartner(partner.email)
      }
    })
  }

  return (
    <div className="mx-auto flex w-full min-h-screen bg-[#0A0F1D] text-slate-100">
      <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={`text-4xl text-center ${!isOpen ? 'pl-[72px]' : 'pl-[240px]'} w-full transition-all duration-300`}>
        <div className='w-full'>
          <h1 className='p-4 text-2xl font-bold bg-[#0F172A] border-b border-slate-800 text-left pl-14 text-slate-100'>Partner Requests</h1>

          <div className='p-6 min-h-[calc(100vh-4rem)] bg-[#0B132B]/50'>

            {loading ? (
              <AdminLoader />
            ) : (
              requests && (
                requests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-4 bg-[#111C3A] rounded-xl border border-slate-800 text-center shadow-lg w-full">
                    <FiInbox size={48} className="text-slate-500 mb-3 animate-pulse" />
                    <p className="text-slate-305 text-base font-bold">No data yet</p>
                    <p className="text-slate-505 text-xs mt-1">There are currently no partner requests to display.</p>
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
                          <th className='p-4 text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 text-left'>Reject</th>
                          <th className='p-4 text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 text-left'>Accept</th>
                          <th className='p-4 text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 text-left'>View</th>

                        </tr>
                      </thead>
                      <tbody className='divide-y divide-slate-800 bg-[#111C3A]/50'>
                        {requests.map((partner) => {
                          return (
                            <tr key={partner._id} className='hover:bg-[#1C2541]/40 transition-colors duration-150'>
                              <td className='p-4 whitespace-nowrap text-sm text-slate-200 text-left'>{partner.fname}</td>
                              <td className='p-4 whitespace-nowrap text-sm text-slate-200 text-left'>{partner.lname}</td>
                              <td className='p-4 whitespace-nowrap text-sm text-slate-200 text-left'>{partner.email}</td>
                              <td className='p-4 whitespace-nowrap text-sm text-slate-200 text-left'>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                  {partner.verificationStatus}
                                </span>
                              </td>
                              <td className='p-4 whitespace-nowrap text-sm text-slate-200 text-left'><button onClick={() => rejectAlert(partner.email)} className='bg-rose-600 hover:bg-rose-700 px-3 py-1.5 rounded-lg text-white text-xs font-semibold shadow-md transition-all duration-150'>Reject</button></td>
                              <td className='p-4 whitespace-nowrap text-sm text-slate-200 text-left'><button onClick={() => acceptAlert(partner)} className='bg-emerald-600 hover:bg-emerald-700 text-white shadow-md px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150'>Accept</button></td>
                              <td className='p-4 whitespace-nowrap text-sm text-slate-200 text-left'><button onClick={() => viewPartner(partner)} className='bg-sky-600 hover:bg-sky-700 px-3 py-1.5 rounded-lg text-white text-xs font-semibold shadow-md transition-all duration-150'>View</button></td>

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

export default PartnerRequest