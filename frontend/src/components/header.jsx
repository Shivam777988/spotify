import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginModal from '../pages/LoginPage';
import { useSecret } from '../UserContext';
function Header() {
  const [showSearch, setShowSearch] = useState(false);
  const {userData, setUserData}=useSecret();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const handlesearch=()=>{
    
  }
  return (
    <div className="bg-black h-20 w-full text-white text-2xl flex items-center justify-between px-6 relative">
      
      {/* Left Icons */}
      <div className="flex items-center gap-6">
        {/* Dots */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>

        {/* Arrows */}
        <div className="flex gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </div>

        {/* Home */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 
            .621.504 1.125 1.125 1.125H9.75v-4.875c0 
            -.621.504-1.125 1.125-1.125h2.25c.621 
            0 1.125.504 1.125 1.125V21h4.125c.621 
            0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>

        {/* Search */}
        <svg onClick={() => setShowSearch(!showSearch)} xmlns="http://www.w3.org/2000/svg"
          fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
          stroke="currentColor" className="w-8 h-8 cursor-pointer">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 
            0A7.5 7.5 0 1 0 5.196 5.196a7.5 
            7.5 0 0 0 10.607 10.607Z" />
        </svg>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search for songs..."
          onChange={handlesearch}
          className={`absolute left-150 w-150 top-1/2 transform -translate-y-1/2 spotify-sebg text-white px-4 py-2 rounded-full transition-all duration-300 ease-in-out
            ${showSearch ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
        />
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-6">
        {/* Bell */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24" strokeWidth={1.5}
          stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 
            0 0 0 5.454-1.31A8.967 8.967 0 0 
            1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 
            8.967 0 0 1-2.312 6.022c1.733.64 
            3.56 1.085 5.455 1.31m5.714 
            0a24.255 24.255 0 0 1-5.714 
            0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>

        {/* User Icon with Link to Register */}
        <button onClick={() => setShowLoginModal(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24" strokeWidth={1.5}
            stroke="currentColor" className="w-8 h-8 cursor-pointer">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M17.982 18.725A7.488 7.488 
              0 0 0 12 15.75a7.488 7.488 0 0 
              0-5.982 2.975m11.963 0a9 9 0 
              1 0-11.963 0m11.963 0A8.966 
              8.966 0 0 1 12 21a8.966 
              8.966 0 0 1-5.982-2.275M15 
              9.75a3 3 0 1 1-6 0 3 3 0 0 
              1 6 0Z" />
          </svg>
        <h1>{userData?.name}</h1> {/* 👈 Safe check */}
        </button>
        
        {/* Login Button */}
      
      </div>

      {/* Conditionally render Login Modal */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      </div>
 
  );
}

export default Header;
