import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function SongPage() {
  const [song, setSong] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/songs/${id}`);
        setSong(res.data);
      } catch (err) {
        console.error('Error fetching song:', err);
      }
    };

    fetchSong();
  }, [id]);

  if (!song) return <div className="text-white p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-4 text-center  ">
      <h1 className="text-3xl font-bold mb-4">🎵 {song.name}</h1>
      <div className='flex justify-center content-center'>      <img src={song.coverUrl} alt={song.name} className="w-full max-w-md rounded shadow-lg mb-4" />
</div>
      <p className="text-xl mb-2">Artist: <span className="font-semibold">{song.artist}</span></p>
      <audio controls className="w-full">
        <source src={song.url} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default SongPage;
