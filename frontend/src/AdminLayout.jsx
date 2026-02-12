import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useSecret } from './UserContext';

export default function AdminLayout() {
  const { isAdmin } = useSecret();

  if (!isAdmin) {
    return <div className="p-8 text-red-500 text-xl">⛔ Unauthorized Access</div>;
  }

  return (
    <div className="p-4 spot min-h-screen  ">
      <h1 className="text-2xl text-amber-50 font-bold mb-4 ">🎧 Admin Panel</h1>

      {/* ✅ Absolute path to avoid nesting loop */}
      <Link to="/admin/uploads" className="text-blue-600  ">Upload</Link>

      <Outlet />
    </div>
  );
}
