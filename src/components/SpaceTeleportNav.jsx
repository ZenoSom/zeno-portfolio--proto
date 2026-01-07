import { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { EasePack } from 'gsap/EasePack';

gsap.registerPlugin(ScrollToPlugin, EasePack);

export default function SpaceTeleportNav() {
    const [activeSection, setActiveSection] = useState('');

    const navItems = [
        { id: 'projects', label: 'Projects', icon: '🚀' },
        { id: 'achievements', label: 'Achievements', icon: '🏆', target: 'journey', tab: '1' },
        { id: 'certifications', label: 'Certifications', icon: '📜', target: 'journey', tab: '2' },
        { id: 'experience', label: 'Experience', icon: '💼', target: 'journey', tab: '3' },
        { id: 'neural-section', label: 'Neural Vis', icon: '🧠' }, // Updated ID in App.jsx
        { id: 'tech-news', label: 'Tech News', icon: '📰' },
        { id: 'skills', label: 'Skills', icon: '⚡' },
        { id: 'contact', label: 'Connect', icon: '📡' },
    ];

    const handleTeleport = (item) => {
        const targetId = item.target || item.id;
        const targetElement = document.getElementById(targetId);

        if (!targetElement) {
            console.warn(`Target ${targetId} not found`);
            return;
        }

        // 1. FREEZE INPUT
        document.body.style.pointerEvents = 'none';
        document.body.style.overflow = 'hidden';

        // Update active state
        setActiveSection(item.id);

        const tl = gsap.timeline({
            onComplete: () => {
                // 5. RELEASE
                document.body.style.pointerEvents = 'all';
                document.body.style.overflow = 'auto';

                // Dispatch event if it's a journey tab
                if (item.tab) {
                    const event = new CustomEvent('changeJourneyTab', { detail: item.tab });
                    window.dispatchEvent(event);
                }
            }
        });

        // 2. QUANTUM GLITCH SEQUENCE
        const scanlines = document.querySelectorAll('.glitch-scanline');

        gsap.set(".crack-overlay", { opacity: 1, zIndex: 999999 });
        gsap.set(scanlines, { opacity: 0, scaleX: 0 });

        // Glitch Chaos (HYPER SPEED)
        tl.to(scanlines, {
            duration: 0.05,
            opacity: 1,
            scaleX: 1,
            y: () => Math.random() * window.innerHeight,
            stagger: {
                amount: 0.05,
                from: "random",
                repeat: 2,
                yoyo: true
            },
            ease: "rough({ strength: 2, points: 10, randomize: true })"
        })
            .to(".glitch-flash", {
                duration: 0.02,
                opacity: 0.8,
                repeat: 3,
                yoyo: true
            }, "<")
            .to("#app-wrapper", {
                duration: 0.1,
                scale: 1.02, // Less scale for speed
                filter: "blur(4px) contrast(150%) hue-rotate(90deg)",
                x: () => (Math.random() - 0.5) * 20,
                y: () => (Math.random() - 0.5) * 20,
                skewX: 10,
                ease: "rough({ strength: 2, points: 10 })"
            }, "<")

            .add(() => {
                // 3. TELEPORT (Hyper Jump)
                if (targetElement) {
                    const y = targetElement.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top: y, behavior: 'auto' });
                }
            }, "-=0.08")

            // Restoration (Instant Snap)
            .to("#app-wrapper", {
                duration: 0.15,
                scale: 1,
                filter: "none",
                x: 0,
                y: 0,
                skewX: 0,
                clearProps: "all",
                ease: "power2.out"
            })
            .to(".crack-overlay", {
                opacity: 0,
                duration: 0.1,
                zIndex: -1
            }, "<");
    };

    return (
        <>
            <div className="crack-overlay">
                <div className="glitch-flash"></div>
                {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className="glitch-scanline" style={{ background: i % 2 === 0 ? 'cyan' : '#ff00ff' }}></div>
                ))}
            </div>

            <nav className="space-nav">
                <div className="nav-container">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            className={`nav-btn ${activeSection === item.id ? 'active' : ''}`}
                            onClick={() => handleTeleport(item)}
                            title={item.label}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                            <div className="nav-glow"></div>
                        </button>
                    ))}
                </div>
            </nav>
        </>
    );
}
