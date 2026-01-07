import { useEffect, useRef } from 'react';

export default function SwordSound() {
    const audioRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (audioRef.current) {
                audioRef.current.volume = 0.8;
                audioRef.current.play().catch(() => { });
            }
        }, 600);
        return () => clearTimeout(timer);
    }, []);

    return (
        <audio ref={audioRef} id="swordSound" src="/assets/sounds/slash.mp3" preload="auto"></audio>
    );
}
