import React, { useEffect,useState } from 'react';
import axios from 'axios';
import {Link  } from "react-router-dom";
export default function RegisterPage() {

  const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    async function registerUser(e){
       e.preventDefault();
        await axios.post('http://localhost:4000/register', {
        name,
        email,
        password
      
    },
    setName(''),
    setEmail(''),
    setPassword(''),
);
    alert("registration successful now you can log in")
    }
  return (
  <div className="fixed inset-0 spotify-bg bg-opacity-60 flex items-center justify-center z-50 animate-fade-in">

      <div className="spot text-white rounded-lg p-8 shadow-lg w-150 h-3/4 relative border-rounded-4xl">
        {/* Close Button - optional: can go back to home */}
        <button
          onClick={() => window.history.back()} // Go back to previous page
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl"
        >
          ❌
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        <form onSubmit={registerUser}>
         <div className="mb-6">
            <label>Name</label>
            <input type="text" className="w-full text-white border px-3 py-2 rounded" value={name} onChange={e => setName(e.target.value)} />
          </div>

          <div className="mb-4">
            <label>Email</label>
            <input type="email" className="w-full text-white border px-3 py-2 rounded" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

        <div className="mb-6">
            <label>Password</label>
            <input type="password" className="w-full text-white border px-3 py-2 rounded" value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
          >
            Register
          </button>
          <h1 className='text-center'>for admins only</h1>
<Link to={'/secret'}>Admin</Link>
        </form>
      </div>
    </div>
  );
}
