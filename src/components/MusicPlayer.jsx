import { useState, useRef, useEffect } from 'react';

export default function MusicPlayer({ musicData }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const audioRef = useRef(null);

    const defaultMusic = {
        src: "assets/track.mp3",
        title: "Track",
        cover: "assets/icons/cover.png"
    };

    const music = musicData || defaultMusic;

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.volume = 0.30;

        // Autoplay attempt
        const attemptPlay = async () => {
            try {
                await audio.play();
                setIsPlaying(true);
            } catch {
                console.log("Autoplay blocked");
                const playOnInteraction = () => {
                    audio.play().catch(() => { });
                    setIsPlaying(true);
                    document.removeEventListener('click', playOnInteraction);
                    document.removeEventListener('keydown', playOnInteraction);
                };
                document.addEventListener('click', playOnInteraction);
                document.addEventListener('keydown', playOnInteraction);
            }
        };

        audio.addEventListener('canplaythrough', attemptPlay, { once: true });

        // Restore volume
        try {
            const saved = localStorage.getItem("samurai_volume");
            if (saved !== null) audio.volume = parseFloat(saved);
        } catch (e) { }

        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        audio.addEventListener("play", onPlay);
        audio.addEventListener("pause", onPause);

        return () => {
            audio.removeEventListener("play", onPlay);
            audio.removeEventListener("pause", onPause);
        }
    }, [music.src]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (audio.paused) {
            audio.play().catch(() => { });
        } else {
            audio.pause();
        }
    };

    const handleVolume = (e) => {
        const vol = parseFloat(e.target.value);
        if (audioRef.current) audioRef.current.volume = vol;
        try { localStorage.setItem("samurai_volume", vol.toString()); } catch (e) { }
    };

    return (
        <>
            <audio ref={audioRef} id="audio" src={music.src || "assets/track.mp3"} preload="metadata"></audio>

            <button
                id="musicToggle"
                className="music-toggle"
                onClick={() => setIsVisible(!isVisible)}
            >
                <img src="assets/icons/music-icon.png" alt="music" />
            </button>

            <div
                id="musicBar"
                className="music-bar"
                style={{ display: isVisible ? 'flex' : 'none' }}
            >
                <img id="musicCover" className="music-cover" src={music.cover || "assets/icons/cover.png"} alt="Cover" />
                <div className="music-meta">
                    <div id="trackName" className="track-name">{music.title || "Track"}</div>
                    <a id="trackExternal" className="track-ext" href={music.src || "#"} target="_blank" rel="noreferrer">↗</a>
                </div>
                <button id="playPause" className="music-btn" onClick={togglePlay}>
                    {isPlaying ? "⏸" : "▶"}
                </button>
                <div className="volume-wrap">
                    <input
                        id="volumeRange"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        defaultValue="0.3"
                        onInput={handleVolume}
                    />
                </div>
                <button id="closeMusic" className="music-close" onClick={() => setIsVisible(false)}>✕</button>
            </div>
        </>
    );
}
