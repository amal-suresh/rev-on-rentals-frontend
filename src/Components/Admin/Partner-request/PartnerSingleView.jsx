import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import SideBar from '../AdminSideBar/Sidebar'
import Axios from 'axios'
import { adminApi } from '../../../config/api'
import { toast } from 'react-hot-toast'
import { FaMapLocationDot } from 'react-icons/fa6'
import { FiUser, FiFileText } from 'react-icons/fi'
import Swal from 'sweetalert2'

// Aadhaar Card Mockup
const AadhaarMockup = () => (
  <div className="w-full h-40 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col justify-between relative overflow-hidden shadow-inner text-left font-sans text-xs">
    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
    <div className="flex items-center justify-between border-b border-slate-800/60 pb-1">
      <div className="flex items-center gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
        <span className="text-[9px] font-extrabold uppercase tracking-wide text-emerald-400">AADHAAR</span>
      </div>
      <span className="text-[7px] font-bold text-gray-505 uppercase">GOVERNMENT OF INDIA</span>
    </div>
    <div className="flex gap-3 my-2 items-center">
      <div className="w-10 h-14 bg-slate-950/60 rounded border border-slate-800 flex items-center justify-center text-slate-700 shrink-0">
        <FiUser size={18} />
      </div>
      <div className="flex-1 space-y-1.5 font-sans">
        <div className="h-2 bg-slate-850 rounded w-4/5"></div>
        <div className="h-1.5 bg-slate-850 rounded w-2/3"></div>
        <div className="pt-1">
          <span className="text-[9px] font-mono tracking-widest text-slate-500 font-bold">XXXX XXXX XXXX</span>
        </div>
      </div>
    </div>
    <div className="text-[7px] text-gray-600 font-bold uppercase tracking-wider text-right">NOT UPLOADED</div>
  </div>
);

// PAN Card Mockup
const PanMockup = () => (
  <div className="w-full h-40 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-lg p-4 flex flex-col justify-between relative overflow-hidden shadow-inner text-left font-sans text-xs">
    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none"></div>
    <div className="flex items-center justify-between border-b border-slate-800/60 pb-1">
      <div className="flex items-center gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
        <span className="text-[9px] font-extrabold uppercase tracking-wide text-blue-400">PAN CARD</span>
      </div>
      <span className="text-[7px] font-bold text-gray-550 uppercase">INCOME TAX DEPT</span>
    </div>
    <div className="flex gap-3 my-2 items-center">
      <div className="w-10 h-14 bg-slate-950/60 rounded border border-slate-800 flex items-center justify-center text-slate-705 shrink-0">
        <FiUser size={18} />
      </div>
      <div className="flex-1 space-y-1.5 font-sans">
        <div className="h-2 bg-slate-850 rounded w-3/4"></div>
        <div className="h-1.5 bg-slate-850 rounded w-1/2"></div>
        <div className="pt-1 font-mono text-slate-500">
          <span className="text-[9px] font-mono tracking-wider font-bold">ABCDE1234F</span>
        </div>
      </div>
    </div>
    <div className="text-[7px] text-gray-600 font-bold uppercase tracking-wider text-right">NOT UPLOADED</div>
  </div>
);

const PartnerSingleView = () => {
  const [isOpen, setIsOpen] = useState(() => localStorage.getItem('adminSidebarOpen') === 'true')

  const toggleSidebar = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    localStorage.setItem('adminSidebarOpen', String(nextState));
  };
  const location = useLocation()
  const PartnerData = location?.state?.data
  const [partner, setPartner] = useState(PartnerData)

  const verifiyPartner = async (email) => {
    const response = await Axios.get(`${adminApi}/verifyPartner?email=${email}`)
    if (response.data.success) {
      setPartner((prevPartner) => ({
        ...prevPartner,
        verificationStatus: prevPartner.verificationStatus === 'approved' ? 'pending' : 'approved',
      }));
      toast.success(response.data.message)
    } else {
      toast.error(response.data.message)
    }
  }

  const statusAlert = (email) => {
    if (partner.verificationStatus !== "approved") {
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
        if (isAadhaarMissing) missingFields.push("Aadhaar Card Document");
        if (isPanMissing) missingFields.push("PAN Card Document");
        if (isGstMissing) missingFields.push("GST Number");
        if (isBankMissing) missingFields.push("Complete Bank Details (Holder Name, Account No, Bank, Branch, IFSC)");

        Swal.fire({
          title: 'Cannot Verify Partner',
          html: `<div class="text-left text-xs space-y-2 mt-2 leading-relaxed">
                   <p class="font-bold text-rose-400">The partner has not submitted all required details:</p>
                   <ul class="list-disc list-inside text-slate-300 pl-2">
                     ${missingFields.map(field => `<li>${field}</li>`).join('')}
                   </ul>
                   <p class="pt-2 text-slate-400">Please inform the partner to complete their profile before proceeding.</p>
                 </div>`,
          icon: 'error',
          confirmButtonColor: '#FACC15',
          confirmButtonText: 'Close'
        });
        return;
      }
    }

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
        verifiyPartner(email)
      }
    })
  }

  const isPdfFile = (url) => {
    if (!url) return false;
    return url.toLowerCase().endsWith('.pdf') || url.includes('/raw/upload/') || url.includes('.pdf?');
  };

  const renderAdminDoc = (docUrl, docName, fallbackMockup) => {
    if (!docUrl) return fallbackMockup;
    if (isPdfFile(docUrl)) {
      return (
        <div className="w-full h-40 bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col items-center justify-center text-center relative group">
          <FiFileText size={44} className="text-red-500 mb-1" />
          <span className="text-[11px] text-gray-305 font-bold block max-w-full truncate px-3">{docName} (PDF)</span>
          <button
            type="button"
            onClick={() => window.open(docUrl, '_blank')}
            className="mt-3 px-4 py-1.5 bg-[#0A0F1D] hover:bg-yellow-450 hover:text-black rounded text-[10px] uppercase font-bold tracking-wider text-yellow-400 border border-yellow-405/20 transition-all cursor-pointer"
          >
            View Document
          </button>
        </div>
      );
    }

    return (
      <div className="relative w-full h-40 group rounded-lg overflow-hidden border border-slate-700/60">
        <img className="w-full h-full object-cover" src={docUrl} alt={docName} />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            type="button"
            onClick={() => window.open(docUrl, '_blank')}
            className="px-4 py-1.5 bg-yellow-400 text-black rounded text-[10px] uppercase font-extrabold tracking-wider transition-all cursor-pointer"
          >
            View Image
          </button>
        </div>
      </div>
    );
  };

  const aadhaarUrl = partner.documents?.aadhaar || partner.aadhaar;
  const panUrl = partner.documents?.pan || partner.pan;

  return (
    <div className="mx-auto flex w-full min-h-screen bg-[#0A0F1D] text-slate-100 font-sans">
      <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={`text-4xl text-center ${!isOpen ? 'pl-[72px]' : 'pl-[240px]'} w-full transition-all duration-300`}>
        <div className='w-full '>
          <h1 className='p-4 text-2xl font-bold bg-[#0F172A] border-b border-slate-800 text-left pl-14 text-slate-100 font-passion tracking-wide uppercase'>
            Partner Single page
          </h1>

          <div className='bg-[#0B132B]/50 flex justify-center flex-col md:flex-row gap-6 p-6 min-h-[calc(100vh-4rem)]'>

            <div className=' w-full md:w-[30%] '>
              <div className="flex items-center justify-center">

                <div className="w-full pb-5 md:pr-5">
                  <div className="bg-[#111C3A] border border-slate-800/80 w-full shadow-xl rounded-xl py-6 px-4">
                    <div className="photo-wrapper p-2 flex justify-center items-center ">
                      <img className="w-24 h-24 rounded-full mx-auto border border-slate-800 object-cover" src={partner.image ? partner.image : "https://mir-s3-cdn-cf.behance.net/project_modules/disp/ea7a3c32163929.567197ac70bda.png"} alt={partner.fname} />
                    </div>
                    <div className="p-2">
                      <h3 className="text-center text-xl text-white font-bold leading-8">{partner.fname} {partner.lname}</h3>
                      <div className="text-center text-slate-400 text-xs font-semibold">
                        <p>rev-on partner</p>
                      </div>
                      <table className="text-xs my-3 w-full text-slate-350">
                        <tbody>
                          <tr className='border-b border-slate-800/50'>
                            <td className="px-2 py-2 text-slate-450 font-bold text-left">Phone</td>
                            <td className="px-2 py-2 text-left">{partner.mobile || partner.phone || "not found!"}</td>
                          </tr>
                          <tr className='border-b border-slate-800/50'>
                            <td className="px-2 py-2 text-slate-450 font-bold text-left">Email</td>
                            <td className="px-2 py-2 text-left truncate max-w-[12rem]">{partner.email}</td>
                          </tr>
                          <tr className='border-b border-slate-800/50'>
                            <td className="px-2 py-2 text-slate-450 font-bold text-left">City</td>
                            <td className="px-2 py-2 text-left">{partner.city || "not found!"}</td>
                          </tr>
                          <tr>
                            <td className="px-2 py-2 text-slate-450 font-bold text-left">GST no</td>
                            <td className="px-2 py-2 text-left">{partner.documents?.gstNo || partner.gstNo || "not found!"}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div className='flex justify-center mt-4'>
                        <div className='whitespace-nowrap font-semibold text-sm text-center w-full'>
                          {partner.verificationStatus !== "approved" ? (
                            <button onClick={() => statusAlert(partner.email)} className='w-full bg-rose-600 hover:bg-rose-700 py-2 rounded-lg text-white font-bold shadow-md transition-all duration-150 text-xs uppercase tracking-wider cursor-pointer'>Verify Partner</button>
                          ) : (
                            <button onClick={() => statusAlert(partner.email)} className='w-full bg-emerald-600 hover:bg-emerald-700 py-2 rounded-lg text-white font-bold shadow-md transition-all duration-150 text-xs uppercase tracking-wider cursor-pointer'>unverify</button>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className='bg-[#111C3A] border border-slate-800/80 rounded-xl p-6 w-full md:w-[65%] text-left'>

              <div className='mb-3'>
                <p className='text-sm font-bold text-slate-300 uppercase tracking-widest text-center mt-2 mb-4'>ID PROOF DOCUMENTS</p>
                <div className='flex md:flex-row flex-col justify-center items-center md:justify-evenly gap-4'>
                  <div className='flex justify-center flex-col md:w-[48%] w-full p-3 bg-[#0B132B]/40 rounded-xl border border-slate-800/50'>
                    <p className='text-slate-400 font-bold text-xs uppercase tracking-wider mb-2 ml-2'>Aadhaar card :</p>
                    {renderAdminDoc(aadhaarUrl, "Aadhaar", <AadhaarMockup />)}
                  </div>
                  <div className='flex justify-center flex-col md:w-[48%] w-full p-3 bg-[#0B132B]/40 rounded-xl border border-slate-800/50'>
                    <p className='text-slate-400 font-bold text-xs uppercase tracking-wider mb-2 ml-2'>Pan Card :</p>
                    {renderAdminDoc(panUrl, "Pan", <PanMockup />)}
                  </div>
                </div>
              </div>

              <div className='pt-6 border-t border-slate-800/80 mt-6'>
                <p className='text-sm font-bold text-slate-300 uppercase tracking-widest text-center mb-4'>BANK DETAILS</p>
                {partner.bankDetails && (partner.bankDetails.accountHolderName || partner.bankDetails.accHolderName || partner.bankDetails.accountNumber || partner.bankDetails.accNumber || partner.bankDetails.bankName || partner.bankDetails.upiId) ? (
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 bg-[#0B132B]/40 border border-slate-800/50 rounded-xl p-4 text-xs text-slate-300'>
                    <div className='flex justify-between items-center py-1.5 border-b border-slate-800/40'>
                      <span className='text-slate-400 font-bold uppercase tracking-wider'>Holder Name</span>
                      <span className='text-white font-semibold'>{partner.bankDetails.accountHolderName || partner.bankDetails.accHolderName || 'N/A'}</span>
                    </div>
                    <div className='flex justify-between items-center py-1.5 border-b border-slate-800/40'>
                      <span className='text-slate-400 font-bold uppercase tracking-wider'>Account No</span>
                      <span className='text-white font-semibold'>{partner.bankDetails.accountNumber || partner.bankDetails.accNumber || 'N/A'}</span>
                    </div>
                    <div className='flex justify-between items-center py-1.5 border-b border-slate-800/40 md:border-b-0'>
                      <span className='text-slate-400 font-bold uppercase tracking-wider'>Bank Name</span>
                      <span className='text-white font-semibold'>{partner.bankDetails.bankName || 'N/A'}</span>
                    </div>
                    <div className='flex justify-between items-center py-1.5 border-b border-slate-800/40 md:border-b-0'>
                      <span className='text-slate-400 font-bold uppercase tracking-wider'>Branch</span>
                      <span className='text-white font-semibold'>{partner.bankDetails.branchName || 'N/A'}</span>
                    </div>
                    <div className='flex justify-between items-center py-1.5 border-b border-slate-800/40 md:border-b-0'>
                      <span className='text-slate-400 font-bold uppercase tracking-wider'>IFSC Code</span>
                      <span className='text-white font-semibold'>{partner.bankDetails.ifscCode || 'N/A'}</span>
                    </div>
                    <div className='flex justify-between items-center py-1.5 border-b border-slate-800/30 md:border-b-0'>
                      <span className='text-slate-400 font-bold uppercase tracking-wider'>UPI ID</span>
                      <span className='text-white font-semibold'>{partner.bankDetails.upiId || 'N/A'}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-xs text-slate-500 py-4 bg-[#0B132B]/20 border border-slate-800 rounded-xl">No bank details provided.</p>
                )}
              </div>

              <div className='pt-6 flex flex-col justify-center items-center border-t border-slate-800/80 mt-6'>
                <p className='text-sm font-bold text-slate-350 uppercase tracking-widest mb-4'>PickUP & Drop Points </p>
                <div className='w-full px-3 grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[15rem] overflow-y-auto'>
                  {partner.locations && partner.locations.map((location) => {
                    return (
                      <div key={location._id} className='h-[48px] flex items-center justify-start gap-4 px-4 bg-[#0B132B] border border-slate-800 rounded-lg hover:border-yellow-405/20 transition-all duration-150'>
                        <FaMapLocationDot size={18} className="text-yellow-400 animate-pulse" />
                        <p className='text-xs md:text-sm text-slate-205'>{location.name}</p>
                      </div>
                    )
                  })}
                  {(!partner.locations || partner.locations.length === 0) && (
                    <p className="col-span-2 text-center text-xs text-gray-500 py-4">No pickup/drop points registered for this partner.</p>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default PartnerSingleView