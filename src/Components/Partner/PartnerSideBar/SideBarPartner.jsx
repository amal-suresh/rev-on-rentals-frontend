import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removePartner } from '../../../utils/partnerSlice'
import { GiHamburgerMenu } from 'react-icons/gi';
import { AiOutlineClose } from 'react-icons/ai';
import {
  MdDashboard,
  MdPerson,
  MdDirectionsBike,
  MdReceipt,
  MdLogout
} from 'react-icons/md';

function SideBarPartner(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const path = window.location.pathname;

  useEffect(() => {
    localStorage.setItem('partnerSidebarOpen', String(props.isOpen));
  }, [props.isOpen]);

  const handlePartnerLogout = () => {
    dispatch(removePartner())
    localStorage.removeItem('partnerToken')
    navigate('/partner/login')
  }

  const isSelected = (route) => {
    if (route === '/partner') {
      return path === '/partner' || path === '/partner/';
    }
    return path.startsWith(route);
  };

  const menuItems = [
    { name: 'Dashboard', route: '/partner', icon: MdDashboard },
    { name: 'Profile', route: '/partner/profile', icon: MdPerson },
    { name: 'Bikes', route: '/partner/bikes', icon: MdDirectionsBike },
    { name: 'Bookings', route: '/partner/bookings', icon: MdReceipt },
  ];

  return (
    <div className={`fixed top-0 left-0 h-screen z-20 bg-[#0A0F1D] border-r border-[#1E293B]/70 transition-all duration-300 ${props.isOpen ? 'w-[240px]' : 'w-[72px]'} pt-6 pb-8 flex flex-col justify-between shadow-xl`}>
      <div className="flex flex-col gap-1 w-full font-sans">

        {/* Sidebar Brand Header */}
        <div className="relative flex items-center mb-6 h-12 border-b border-[#1E293B]/50 w-full overflow-hidden px-4 whitespace-nowrap">
          <h1 className={`text-yellow-400 font-extrabold text-sm tracking-wider uppercase font-passion transition-all duration-300 ease-in-out origin-left ${props.isOpen ? 'opacity-100 max-w-[150px]' : 'opacity-0 max-w-0 pointer-events-none'}`}>
            REV-ON PARTNER
          </h1>
          <div
            className={`absolute cursor-pointer text-gray-400 hover:text-yellow-400 flex items-center justify-center transition-all duration-350 ${props.isOpen ? 'right-4' : 'left-1/2 -translate-x-1/2'}`}
            onClick={() => props.setIsOpen(!props.isOpen)}
          >
            {props.isOpen ? <AiOutlineClose size={26} /> : <GiHamburgerMenu size={26} />}
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex flex-col gap-1 px-2.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const selected = isSelected(item.route);
            return (
              <div
                key={item.name}
                onClick={() => navigate(item.route)}
                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group relative ${selected
                    ? 'bg-yellow-400 text-black font-bold shadow-md shadow-yellow-400/20'
                    : 'text-gray-400 hover:text-white hover:bg-slate-800/60'
                  }`}
              >
                <div className={`flex items-center justify-center transition-transform duration-250 ${!props.isOpen && 'mx-auto'}`}>
                  <Icon size={20} />
                </div>

                <span className={`text-[12.5px] tracking-wide uppercase transition-all duration-300 ${props.isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden pointer-events-none'}`}>
                  {item.name}
                </span>

                {/* Tooltip for collapsed state */}
                {!props.isOpen && (
                  <div className="absolute left-16 bg-slate-900 text-slate-100 text-xs px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap shadow-lg border border-slate-700/60 z-50">
                    {item.name}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Logout Action */}
      <div className="px-2.5">
        <div
          onClick={handlePartnerLogout}
          className="flex items-center gap-3.5 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 group relative text-rose-400 hover:text-white hover:bg-[#ef4444]/15"
        >
          <div className={`flex items-center justify-center ${!props.isOpen && 'mx-auto'}`}>
            <MdLogout size={20} />
          </div>
          <span className={`text-[12.5px] font-semibold tracking-wide uppercase transition-all duration-300 ${props.isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden pointer-events-none'}`}>
            Logout
          </span>

          {!props.isOpen && (
            <div className="absolute left-16 bg-rose-950 text-rose-200 text-xs px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap shadow-lg border border-rose-900/50 z-50">
              Logout
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SideBarPartner