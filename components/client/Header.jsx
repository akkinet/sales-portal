import React, { useState } from 'react';
import { FaGlobe, FaBars, FaTimes } from 'react-icons/fa';
import { signOut } from "next-auth/react"; // Import signOut from next-auth

export const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("U.S.A");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/api/auth/signOut" });
    sessionStorage.clear();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const goBack = () => {
    setIsMenuOpen(false);
    // Add logic here to navigate back if needed
  };

  return (
    <>
      <div className="header h-14 flex bg-[#e9216a] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="left flex items-center">
          <img
            className='h-10 lg:h-14 max-w-sm'
            src='https://res.cloudinary.com/dduiqwdtr/image/upload/v1723030426/Hexerve%20website%20assets/iqopb1mzpupllfhijzvq.png'
            alt='Logo'
          />
        </div>
        <div className="right hidden lg:flex items-center space-x-4 lg:space-x-6">
          <div className="relative bg-[#1183a5] p-2 rounded-lg">
            <span 
              className="flex items-center cursor-pointer text-white" 
              onClick={toggleDropdown}
            >
              <FaGlobe className="mr-2" size={22} />
              {selectedCurrency}
            </span>
            {isDropdownOpen && (
              <div className="absolute z-50 mt-2 right-0 bg-[#1183a5] text-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto w-40">
                <div className="cursor-pointer p-2 hover:bg-[#e9216a] text-md" onClick={() => handleCurrencyChange('U.S.A')}>
                  U.S.A
                </div>
                <div className="cursor-pointer p-2 hover:bg-[#e9216a] text-md" onClick={() => handleCurrencyChange('U.K.')}>
                  U.K
                </div>
                <div className="cursor-pointer p-2 hover:bg-[#e9216a] text-md" onClick={() => handleCurrencyChange('INDIA')}>
                  I.N
                </div>
              </div>
            )}
          </div>
          <button 
            className="px-4 py-2 text-md bg-[#1183a5] text-white hover:text-white hover:bg-black rounded-md"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
        <button 
          className="lg:hidden text-white"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`lg:hidden fixed inset-0 bg-[#e9216a] text-white z-40 ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="flex flex-col p-4 space-y-4">
          <button 
            className="mb-4 text-white"
            onClick={goBack}
          >
            <FaTimes size={24} />
          </button>
          <div className="relative bg-[#1183a5] p-2 rounded-lg">
            <span 
              className="flex items-center cursor-pointer" 
              onClick={toggleDropdown}
            >
              <FaGlobe className="mr-2" size={22} />
              {selectedCurrency}
            </span>
            {isDropdownOpen && (
              <div className="absolute z-50 mt-2 right-0 bg-[#1183a5] text-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto w-40">
                <div className="cursor-pointer p-2 hover:bg-[#e9216a] text-md" onClick={() => handleCurrencyChange('U.S.A')}>
                  U.S.A
                </div>
                <div className="cursor-pointer p-2 hover:bg-[#e9216a] text-md" onClick={() => handleCurrencyChange('U.K.')}>
                  U.K
                </div>
                <div className="cursor-pointer p-2 hover:bg-[#e9216a] text-md" onClick={() => handleCurrencyChange('INDIA')}>
                  I.N
                </div>
              </div>
            )}
          </div>
          <button 
            className="px-4 py-2 text-md bg-[#1183a5] text-white hover:text-white hover:bg-black rounded-md"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      </div>
    </>
  );
};
