import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminSongsPage() {
  const [songs, setSongs] = useState([]);
  const [editingSong, setEditingSong] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedArtist, setEditedArtist] = useState('');

  useEffect(() => {

    
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    const res = await axios.get('http://localhost:4000/api/songs');
    setSongs(res.data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this song?')) return;
    await axios.delete(`http://localhost:4000/api/songs/${id}`);
    fetchSongs();
  };

  const handleEdit = (song) => {
    setEditingSong(song._id);
    setEditedName(song.name);
    setEditedArtist(song.artist);
    console.log(song._id);
    
  };

  const handleUpdate = async () => {
    await axios.put(`http://localhost:4000/api/songs/${editingSong}`, {
      name: editedName,
      artist: editedArtist,
    });
    setEditingSong(null);
    fetchSongs();
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-8">
      <h2 className="text-3xl font-semibold mb-6 text-center">🎶 Admin Song Manager</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {songs.map((song) => (
          <div key={song._id} className="bg-[#1e1e2f] p-4 rounded-xl shadow-md">
            <img src={song.coverUrl} alt="cover" className="w-full h-48 object-cover rounded-md mb-4" />
            {editingSong === song._id ? (
              <>
                <input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="bg-[#2c2c3e] text-white rounded-lg px-3 py-2 w-full mb-2"
                />
                <input
                  value={editedArtist}
                  onChange={(e) => setEditedArtist(e.target.value)}
                  className="bg-[#2c2c3e] text-white rounded-lg px-3 py-2 w-full mb-2"
                />
                <button
                  onClick={handleUpdate}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mb-2"
                >
                  💾 Save
                </button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold">{song.name}</h3>
                <p className="text-sm text-gray-400">{song.artist}</p>
                <audio controls src={song.url} className="w-full my-3" />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(song)}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded-lg"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(song._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
