import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { removeAdmin } from '../../../utils/adminSlice'
import { GiHamburgerMenu } from 'react-icons/gi';
import { AiOutlineClose } from 'react-icons/ai';
import {
  MdDashboard,
  MdPeople,
  MdGroupAdd,
  MdVerified,
  MdLocalOffer,
  MdChat,
  MdLogout
} from 'react-icons/md';

function SideBar(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const path = window.location.pathname;

  useEffect(() => {
    localStorage.setItem('adminSidebarOpen', String(props.isOpen));
  }, [props.isOpen]);

  const handleAdminLogout = () => {
    dispatch(removeAdmin())
    localStorage.removeItem('adminToken')
  }

  const isSelected = (route) => {
    if (route === '/admin') {
      return path === '/admin' || path === '/admin/';
    }
    return path.startsWith(route);
  };

  const menuItems = [
    { name: 'Dashboard', route: '/admin', icon: MdDashboard },
    { name: 'Users', route: '/admin/users', icon: MdPeople },
    { name: 'Partner Requests', route: '/admin/partnerRequests', icon: MdGroupAdd },
    { name: 'Partners', route: '/admin/partnerVerifiedList', icon: MdVerified },
    { name: 'Coupons', route: '/admin/coupons', icon: MdLocalOffer },
    { name: 'Chats', route: '/admin/chats', icon: MdChat },
  ];

  return (
    <div className={`fixed top-0 left-0 h-screen z-20 bg-[#0B132B] border-r border-[#1C2541] transition-all duration-300 ${props.isOpen ? 'w-[240px]' : 'w-[72px]'} pt-6 pb-8 flex flex-col justify-between shadow-xl`}>
      <div className="flex flex-col gap-1 w-full">
        <div className="relative flex items-center mb-6 h-12 border-b border-[#1C2541]/50 w-full overflow-hidden px-4 whitespace-nowrap">
          <h1 className={`text-white font-extrabold text-lg tracking-wider uppercase font-passion transition-all duration-300 ease-in-out origin-left ${props.isOpen ? 'opacity-100 max-w-[150px]' : 'opacity-0 max-w-0 pointer-events-none'}`}>
            Rev-On-Rentals
          </h1>
          <div
            className={`absolute cursor-pointer text-slate-350 hover:text-white flex items-center justify-center transition-all duration-300 ${props.isOpen ? 'right-4' : 'left-1/2 -translate-x-1/2'}`}
            onClick={() => props.setIsOpen(!props.isOpen)}
          >
            {props.isOpen ? <AiOutlineClose size={32} /> : <GiHamburgerMenu size={32} />}
          </div>
        </div>
        {menuItems.map((item) => {
          const Selected = isSelected(item.route);
          const Icon = item.icon;
          return (
            <div
              key={item.route}
              onClick={() => navigate(item.route)}
              className={`flex items-center cursor-pointer w-full transition-all duration-300 font-medium text-sm relative px-6 py-3 gap-4 justify-start ${Selected
                ? 'bg-[#1C2541]/80 text-sky-400 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-[#1C2541]/40'
                }`}
            >
              {Selected && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-400 rounded-r" />
              )}
              <Icon size={20} className={`${Selected ? 'text-sky-400' : 'text-slate-400 hover:text-white transition-colors duration-150'} flex-shrink-0`} />
              <span className={`transition-all duration-300 ease-in-out truncate origin-left ${props.isOpen ? 'opacity-100 max-w-[150px] translate-x-0' : 'opacity-0 max-w-0 -translate-x-4 pointer-events-none'}`}>
                {item.name}
              </span>
            </div>
          );
        })}
      </div>

      <div className="w-full">
        <div
          onClick={handleAdminLogout}
          className="flex items-center cursor-pointer w-full transition-all duration-300 font-semibold text-sm relative text-rose-400 hover:text-rose-200 hover:bg-rose-950/20 px-6 py-3 gap-4 justify-start"
        >
          <MdLogout size={20} className="flex-shrink-0 text-rose-400 hover:text-rose-200" />
          <span className={`transition-all duration-300 ease-in-out truncate origin-left ${props.isOpen ? 'opacity-100 max-w-[150px] translate-x-0' : 'opacity-0 max-w-0 -translate-x-4 pointer-events-none'}`}>
            Logout
          </span>
        </div>
      </div>
    </div>
  );
}

export default SideBar;