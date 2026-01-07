import { useRef, useEffect } from 'react';
import gsap from 'gsap';

const NeuralLink = () => {
    const linkRef = useRef(null);

    useEffect(() => {
        const link = linkRef.current;
        if (!link) return;

        // Pulse Animation
        gsap.to(link, {
            boxShadow: "0 0 20px rgba(255, 215, 0, 0.4), 0 0 40px rgba(0, 255, 0, 0.2)",
            repeat: -1,
            yoyo: true,
            duration: 1.5,
            ease: "sine.inOut"
        });

        // Hover Glitch Effect
        const handleMouseEnter = () => {
            gsap.to(link, {
                scale: 1.05,
                duration: 0.1,
                x: () => Math.random() * 4 - 2, // Shake x
                y: () => Math.random() * 4 - 2, // Shake y
                onComplete: () => {
                    gsap.to(link, { x: 0, y: 0, duration: 0.1 }); // Reset shake
                }
            });
        };

        const handleMouseLeave = () => {
            gsap.to(link, { scale: 1, duration: 0.3 });
        };

        link.addEventListener('mouseenter', handleMouseEnter);
        link.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            link.removeEventListener('mouseenter', handleMouseEnter);
            link.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <section className="neural-link-section">
            <a
                href="https://arunshekhar.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="warp-gate-card"
                ref={linkRef}
            >
                <div className="gate-glow"></div>
                <div className="gate-content">
                    <span className="gate-icon">🤝</span>
                    <div className="gate-text">
                        <h3>Checkout Arun's Portfolio Protocol</h3>
                    </div>
                </div>
            </a>
        </section>
    );
};

export default NeuralLink;
