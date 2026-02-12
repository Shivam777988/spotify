import React from 'react';

export default function Sidebar({ visible, setVisible }) {


  return (
    <div className="w-64 h-full  left-0 top-50 spotify-bg text-white p-4 flex flex-col gap-4 transition-all duration-300 z-10">
      {/* Close Button */}
      <button
        onClick={() => setVisible(false)}
        className="self-end text-white hover:text-red-500 text-xl"
      >
        ❌
      </button>

      <h1 className="text-2xl font-bold mb-4">🎵 Spotube</h1>

      {/* Navigation Links */}
      <div className="flex flex-col gap-2 text-lg">
        <div className="hover:text-green-400 cursor-pointer">🏠 Home</div>
        <div className="hover:text-green-400 cursor-pointer">🔍 Search</div>
        <div className="hover:text-green-400 cursor-pointer">📚 Library</div>
      </div>

      <hr className="border-gray-700 my-4" />

      {/* Playlist Items */}
      <div className="flex flex-col gap-1 text-sm">
        <div className="hover:text-green-400 cursor-pointer">Liked Songs</div>
        <div className="hover:text-green-400 cursor-pointer">Playlist 1</div>
        <div className="hover:text-green-400 cursor-pointer">Playlist 2</div>
      </div>
    </div>
  );
}
