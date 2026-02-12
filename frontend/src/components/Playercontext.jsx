import { createContext, useState, useRef, useEffect } from "react";

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  const playSong = (index) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    if (currentSongIndex > 0) playSong(currentSongIndex - 1);
  };

  const handleNext = () => {
    if (currentSongIndex < songs.length - 1) playSong(currentSongIndex + 1);
  };

  useEffect(() => {
    const fetchSongs = async () => {
      const res = await fetch('http://localhost:4000/api/songs');
      const data = await res.json();
      setSongs(data);
    };
    fetchSongs();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
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

  useEffect(() => {
    if (audioRef.current && currentSongIndex !== null) {
      audioRef.current.load();
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentSongIndex]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    isPlaying ? audio.pause() : audio.play();
    setIsPlaying(!isPlaying);
  };

  return (
    <PlayerContext.Provider
      value={{
        songs,
        currentSongIndex,
        isPlaying,
        playSong,
        handlePrev,
        handleNext,
        togglePlay,
        progress,
        setProgress,
        audioRef,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
