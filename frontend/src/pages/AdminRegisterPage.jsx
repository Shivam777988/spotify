import React, { useState } from 'react';
import axios from 'axios';
import { SecretProvider,useSecret } from '../UserContext';
import { Navigate, useNavigate } from 'react-router';

export default function AdminRegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secret, setSecret] = useState(''); // optional secret key
  const {isAdmin,setIsadmin } = useSecret();
  const navigate=useNavigate();
  async function handleRegister(e) {
    e.preventDefault();
    try {
     const response= await axios.post("http://localhost:4000/admin/register", {
        name,
        email,
        password,
        secret // optional for security
      });

if(response.data.success){
  setIsadmin(true);
  navigate("/admin/dashboard")
}
      alert("Admin Registered Successfully");
    } catch (err) {
      console.error(err);
      alert("Admin registration failed");
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Register</h2>
      <form onSubmit={handleRegister}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="border w-full p-2 mb-2" />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border w-full p-2 mb-2" />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" className="border w-full p-2 mb-2" />
        <input value={secret} onChange={e => setSecret(e.target.value)} placeholder="Admin Secret" className="border w-full p-2 mb-2" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Register Admin</button>
      </form>
    </div>
  );
}
