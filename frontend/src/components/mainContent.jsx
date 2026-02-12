import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import {Link ,useNavigate } from "react-router-dom";
export default function MainContent({ className = "" }) {
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const audioRef = useRef(null);
  // const progressRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
const navigate=useNavigate();
  // 1. Fetch songs from backend
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/songs');
        setSongs(res.data);
      } catch (err) {
        console.error('Failed to fetch songs:', err);
      }
    };

    fetchSongs();
  }, []);
    const [jsongs, setJSongs] = useState([]);
 // replace with your real client_id

//   useEffect(() => {
//     const fetchJSongs = async () => {
//       try {
//        const res = await axios.get(
//   `https://api.jamendo.com/v3.0/tracks/?client_id=160977ae&format=json&limit=20`
// );

//         setJSongs(res.data.results); // Jamendo returns { headers, results }
//       } catch (err) {
//         console.error("Error fetching Jamendo songs:", err);
//       }
//     };

//     fetchJSongs();
//   }, []);

  // 2. Play selected song
  const playSong = (index) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  // 3. Control Previous Song
  const handlePrev = () => {
    if (currentSongIndex > 0) {
      playSong(currentSongIndex - 1);
    }
  };

  // 4. Control Next Song
  const handleNext = () => {
    if (currentSongIndex < songs.length - 1) {
      playSong(currentSongIndex + 1);
    }
  };

  // 5. Update playback progress
  useEffect(() => {
    const audio = audioRef.current;
    console.log(audio)
    
    if (!audio) return;

    const updateProgress = () => {
      const percent = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(percent) ? 0 : percent);
    };

    audio.addEventListener("timeupdate", updateProgress);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, [isPlaying]);

  // 6. Seek manually
  // const handleSeek = (e) => {

  //   const audio = audioRef.current;
  //   const width = progressRef.current.clientWidth;
  //   const offset = e.nativeEvent.offsetX;
  //   const duration = audio.duration;
  //   audio.currentTime = (offset / width) * duration;

  // };

  // 7. Toggle play/pause
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  // 8. Auto play when song index changes
  useEffect(() => {
    if (audioRef.current && currentSongIndex !== null) {
      audioRef.current.load();
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentSongIndex]);


  const PlayingMusic=(song)=>{
    if (!button) {
      navigate(`/songs/${song._id}`)
    }

  }
  return (
    <div className={`min-h-screen bg-[#0f0f0f] text-white ${className}`}>
      <h1 className="text-3xl font-bold mb-6">🎵 All Songs</h1>

      {/* Grid of songs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {songs.map((song, index) => (
      <div 
  key={index}
  onClick={() => navigate(`/songs/${song._id}`)} 
  className={`group relative bg-[#1f1f1f] rounded-lg p-3 shadow-md hover:scale-105 transition-transform cursor-pointer ${
    index === currentSongIndex ? "ring-2 ring-green-500" : ""
  }`}
>
  <img
    src={song.coverUrl}
    alt={song.name}
    className="w-full h-48 object-cover rounded-md mb-3"
  />
  <h2
    className="text-xl font-semibold truncate w-full"
    title={song.name}
  >
    {song.name}
  </h2>
  <p className="text-gray-400 truncate" title={song.artist}>
    {song.artist}
  </p>

  {/* Play button - visible only on hover */}
  <button
    onClick={(e) => {
      e.stopPropagation(); // prevent navigation
      playSong(index);
    }}
    className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded cursor-pointer"
  >
    {index === currentSongIndex && isPlaying ? "Playing..." : "Play"}
  </button>
</div>

        ))}
      </div>

      {/* Custom Audio Player */}
      {currentSongIndex !== null && (
        <div className="fixed bottom-0 left-0 w-full bg-[#1a1a1a] p-4 border-t border-gray-700">
          <h3 className="text-lg font-semibold text-center">
            🎧 Now Playing: {songs[currentSongIndex]?.name} - {songs[currentSongIndex]?.artist}
          </h3>

          <audio ref={audioRef}>
            <source src={songs[currentSongIndex]?.url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
<div className="w-full flex justify-center">
  <input
    type="range"
    min="0"
    max="100"
    value={progress}
    onChange={(e) => {
      const newProgress = parseFloat(e.target.value);
      setProgress(newProgress);

      const audio = audioRef.current;
      if (audio && audio.duration) {
        audio.currentTime = (newProgress / 100) * audio.duration;
      }
    }}
    onMouseDown={() => {
      const audio = audioRef.current;
      if (audio && !audio.paused) {
        audio.pause();
      }
    }}
    onMouseUp={() => {
      const audio = audioRef.current;
      if (audio && isPlaying) {
        audio.play();
      }
    }}
  className="w-1/3 mt-4 h-2 bg-gray-600 rounded-lg cursor-pointer"
    style={{
      background: `linear-gradient(to right, #22c55e ${progress}%, #374151 ${progress}%)`,
    }}
  />
</div>





          <div className="flex justify-center mt-3 gap-4">
            <button
              onClick={handlePrev}
              disabled={currentSongIndex === 0}
              className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
            >
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061a1.125 1.125 0 0 1 1.683.977v8.122Z" />
</svg>

            </button>
            <button
              onClick={togglePlay}
              className="bg-green-500 px-4 py-1 hover:bg-green-600 rounded-2xl"
            >
              {isPlaying ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
</svg>
: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
</svg>
}
            </button>
            <button
              onClick={handleNext}
              disabled={currentSongIndex === songs.length - 1}
              className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
            >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811Z" />
</svg>

            </button>
          </div>
        </div>
      )}
    </div>
  );
}
