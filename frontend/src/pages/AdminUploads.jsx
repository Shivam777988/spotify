import { useState } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import AdminSongsPage from './AdminSongsPage';
export default function AdminUploads() {
  const [name, setName] = useState('');
  const [artist, setArtist] = useState('');
  const [song, setSong] = useState(null);
  const [url, setUrl] = useState('');
  const [cover, setCover] = useState(null);
  const [coverUrl, setCoverUrl] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('song', song);
    formData.append('cover', cover);

    try {
      const res = await axios.post('http://localhost:4000/api/upload-song', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploadedUrl = res.data.url;
      const uploadedCoverUrl = res.data.coverUrl;
      setUrl(uploadedUrl);
      setCoverUrl(uploadedCoverUrl);

      // Save metadata to DB
      await axios.post('http://localhost:4000/api/save-song', {
        name,
        artist,
        url: uploadedUrl,
        coverUrl: uploadedCoverUrl,
      });

      alert("✅ Song metadata saved to DB!");
    } catch (err) {
      console.error(err);
      alert('❌ Upload Failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f0f0f] px-4">
      <form
        onSubmit={handleUpload}
        className="w-full max-w-lg min-h-[75vh] bg-[#1e1e2f] text-white p-8 rounded-2xl shadow-2xl flex flex-col justify-center items-center gap-5"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">🎧 Upload MP3 Song</h2>

        <input
          type="text"
          placeholder="🎵 Song Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-[#2c2c3e] text-white rounded-lg px-4 py-2 w-full outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="text"
          placeholder="👨‍🎤 Artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className="bg-[#2c2c3e] text-white rounded-lg px-4 py-2 w-full outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setCover(e.target.files[0])}
          className="file:bg-blue-600 file:border-none file:px-4 file:py-2 file:rounded-md file:text-white w-full bg-[#2c2c3e] text-white rounded-lg"
          required
        />

        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setSong(e.target.files[0])}
          className="file:bg-green-600 file:border-none file:px-4 file:py-2 file:rounded-md file:text-white w-full bg-[#2c2c3e] text-white rounded-lg"
          required
        />

        <button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-600 transition-all text-black font-medium py-2 rounded-lg flex items-center justify-center"
        >
          ⬆️ Upload
        </button>

        {url && (
          <div className="mt-6 bg-[#2a2a40] p-4 rounded-lg text-center w-full">
            <p className="mb-2 text-lg font-medium">🎶 {name} - {artist}</p>

            {coverUrl && (
              <img
                src={coverUrl}
                alt="cover"
                className="w-32 h-32 mx-auto mb-3 object-cover rounded-md shadow-md"
              />
            )}

            <audio controls src={url} className="w-full mt-2 rounded-md" />

            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="block mt-2 text-blue-400 hover:underline"
            >
              🔗 Open in new tab
            </a>
          </div>
        )}
      </form>
<Link to="/admin/edit" className="mt-4 text-blue-400 hover:underline">
  ✏️ Edit Songs
</Link>
    </div>
    
  );
}
