import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../images/new-logo-rev-on.png';
import { GrMenu, GrClose } from 'react-icons/gr';
import { useSelector, useDispatch } from 'react-redux';
import { BiLogOut } from 'react-icons/bi';
import { removeUser } from '../../../utils/userSlice';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(store => store.user.userD);

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(removeUser());
    localStorage.removeItem('token');
    navigate('/');
    setMenuOpen(false);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMenuOpen(false); // close mobile menu
  };

  return (
    <header className="bg-black w-full shadow-md fixed top-0 z-50">
      <nav className="max-w-[1500px] w-[92%] mx-auto flex justify-between items-center h-[5rem]">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <img
            src={logo}
            alt="logo"
            className="w-14 h-14 rounded-full cursor-pointer"
            onClick={() => handleNavigate('/')}
          />
          <h1 className="text-white font-bold text-2xl sm:text-3xl font-passion tracking-wider cursor-pointer hidden md:block">
            REV-ON-RENTALS
          </h1>
        </div>

        {/* Nav Links */}
        <ul
          className={`
            flex flex-col md:flex-row items-center md:static absolute left-0 w-full md:w-auto 
            bg-black md:bg-transparent text-yellow-300 font-semibold z-40 
            transition-all duration-300 ease-in-out 
            ${menuOpen ? 'top-[5rem] opacity-100' : 'top-[-500px] opacity-0 pointer-events-none'} 
            md:opacity-100 md:pointer-events-auto md:top-auto md:gap-8 md:p-0 p-6 gap-6
          `}
        >
          <li className="cursor-pointer hover:text-yellow-400" onClick={() => handleNavigate('/')}>Home</li>
          <li className="cursor-pointer hover:text-yellow-400" onClick={() => handleNavigate('/tariff')}>Tariff</li>
          <li className="cursor-pointer hover:text-yellow-400" onClick={() => handleNavigate('/join-us')}>Join us</li>
          <li className="cursor-pointer hover:text-yellow-400" onClick={() => handleNavigate('/offers')}>Offers</li>
          <li className="cursor-pointer hover:text-yellow-400" onClick={() => handleNavigate('/viewBikes')}>Bikes</li>
          {user.name && (
            <li
              className="cursor-pointer hover:text-yellow-400 flex items-center gap-1"
              onClick={handleLogout}
            >
              <BiLogOut size={20} /> Logout
            </li>
          )}
        </ul>

        {/* Right Side: Login/Profile & Hamburger */}
        <div className="flex items-center gap-4">
          {!user.name ? (
            <button
              onClick={() => handleNavigate('/login')}
              className="bg-yellow-400 text-black px-4 py-1.5 rounded-full hover:bg-white hover:text-yellow-500 transition"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => handleNavigate('/userProfile')}
              className="text-yellow-300 hover:text-yellow-400 font-semibold"
            >
              {user.name}
            </button>
          )}

          {/* Hamburger Menu */}
          <div className="md:hidden">
            {!menuOpen ? (
              <GrMenu
                onClick={() => setMenuOpen(true)}
                className="text-yellow-300 cursor-pointer"
                style={{ fontSize: '1.8rem' }}
              />
            ) : (
              <GrClose
                onClick={() => setMenuOpen(false)}
                className="text-yellow-300 cursor-pointer"
                style={{ fontSize: '1.8rem' }}
              />
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
