import React, { useState ,useRef} from 'react';


function Footer() {
      const [currentSongIndex, setCurrentSongIndex] = useState(null);
     const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
     const audioRef = useRef(null);
   
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
      return (
        <div>
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
    )
}

export default Footer
