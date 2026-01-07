import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';

export default function Hero({ profile }) {
    const cardRef = useRef(null);
    const displayName = profile?.name || "Somnath Singh";

    if (!profile) return null;

    const normalizeUrl = (key, url) => {
        if (!url) return "#";
        if (key === "email") return url.startsWith("mailto:") ? url : `mailto:${url}`;
        if (url.startsWith("http://") || url.startsWith("https://")) return url;
        return `https://${url}`;
    };

    const handleMouseMove = (e) => {
        const card = cardRef.current;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element.
        const y = e.clientY - rect.top;  // y position within the element.

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5; // Max rotation 5 deg
        const rotateY = ((x - centerX) / centerX) * 5;

        gsap.to(card, {
            rotationX: rotateX,
            rotationY: rotateY,
            transformPerspective: 1000,
            duration: 0.4,
            ease: "power2.out"
        });
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;
        if (!card) return;

        gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            duration: 0.7,
            ease: "elastic.out(1, 0.5)"
        });
    };

    const socialMap = {
        github: "assets/icons/github.png",
        linkedin: "assets/icons/linkedin.png",
        instagram: "assets/icons/instagram.png",
        email: "assets/icons/mail.png"
    };

    return (
        <header className="hero-wrap">
            <section
                className="hero-card"
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ transformStyle: 'preserve-3d' }}
            >
                <img id="profilePic" className="avatar" src={profile.profilePic || "assets/icons/profile.gif"} alt="profile" />
                <h1 id="name" className="glitch" data-text={displayName} style={{ fontFamily: '"Share Tech Mono", monospace' }}>{displayName}</h1>
                <p id="title" className="subtitle">{profile.title}</p>
                <p id="bio" className="bio">{profile.bio}</p>

                <div id="socials" className="social-icons">
                    {["github", "linkedin", "instagram", "email"].map(k => {
                        if (profile.links && profile.links[k]) {
                            return (
                                <a key={k} href={normalizeUrl(k, profile.links[k])} target="_blank" rel="noopener noreferrer">
                                    <img src={socialMap[k] || "assets/icons/profile.png"} alt={k} />
                                </a>
                            );
                        }
                        return null;
                    })}
                </div>
            </section>
        </header>
    );
}
