import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useSecret } from '../UserContext';

export default function LoginModal({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();  // 👈 For redirection
const{isAdmin,setIsadmin}=useSecret();
  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/login", {
        email,
        password
      }, { withCredentials: true }); // ✅ send cookies for token

      const role = res.data.role;

      alert("Login successful");

      setEmail('');
      setPassword('');
      onClose(); // ✅ close modal

      // ✅ Navigate based on role
      if (role === 'admin') {
        setIsadmin(true)
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }

    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 rounded-2xl">
      <div className="spot text-white p-8 rounded-4xl relative h-2/3 w-1/3 ">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-xl hover:text-red-500"
        >❌</button>
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label>Email</label>
            <input
              type="email"
              className="w-full text-white border px-3 py-2 rounded"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label>Password</label>
            <input
              type="password"
              className="w-full text-white border px-3 py-2 rounded"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 py-2 rounded hover:bg-green-700"
          >Login</button>

          <div className='text-center mt-4'>
            <h1 className='mb-2'>Not having an account yet?</h1>
            <Link className="text-blue-500 hover:underline" to={'/register'}>Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
