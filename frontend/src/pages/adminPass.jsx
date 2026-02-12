import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSecret } from '../UserContext'; // context

export default function Secret() {
  const [secret, setSecret] = useState('');
  const { setIsSecretVerified,userData, setUserData } = useSecret();

  const navigate = useNavigate();
  useEffect(() => {
    if (userData && userData.role === 'admin') {
      navigate('/admin/dashboard');
    }
  }, [userData, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/check-admin-secret', { secret });

      if (response.data.success) {
        setIsSecretVerified(true);           // 🔐 set context
        navigate('/admin/register');         // ✅ redirect to secure route
      } else {
        alert('Invalid Secret Key');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter Admin Secret"
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
