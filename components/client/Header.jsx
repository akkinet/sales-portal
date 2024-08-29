import React, { useState } from 'react';
import { FaGlobe } from 'react-icons/fa';
import { signOut } from "next-auth/react"; // Import signOut from next-auth

export const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("U.S.A");

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

  return (
    <>
      <div className="header h-14 flex bg-[#e9216a]">
        <div className="left w-[50%]">  
          <img
            className='lg:h-14 max-w-sm:h-9 lg:py-2 pl-4'
            src='https://res.cloudinary.com/dduiqwdtr/image/upload/v1723030426/Hexerve%20website%20assets/iqopb1mzpupllfhijzvq.png'
            alt='Logo'
          />
        </div>
        <div className="right w-[50%] flex items-center justify-end pr-6">  
          <div className="relative w-[20%] bg-[#1183a5] p-2 rounded-lg">
            <span 
              className="flex items-center cursor-pointer text-white" 
              onClick={toggleDropdown}
            >
              <FaGlobe className="mr-2" size={22} filter='invert(0)' />
              {selectedCurrency}
            </span>
            {isDropdownOpen && (
              <div className="absolute z-50 mt-6 right-0 bg-[#1183a5] text-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto">
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
          <div className=" w-1/6 flex items-center justify-center">
            <button className=" p-2 px-4 text-md  bg-[#1183a5] text-white hover:text-white hover:bg-black rounded-md" onClick={handleLogout}>
              Log Out
            </button>
          </div>  
        </div>
      </div>
    </>
  );
};
