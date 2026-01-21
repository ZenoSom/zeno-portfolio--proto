import { useEffect, useState } from 'react';
import useProfile from './hooks/useProfile';
import Intro from './components/Intro';
import SwordSound from './components/SwordSound';
import Snow from './components/Snow';
import Cursor from './components/Cursor';
import MusicPlayer from './components/MusicPlayer';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Journey from './components/Journey';
import Skills from './components/Skills';
import Contact from './components/Contact';
import SakuraFooter from './components/SakuraFooter';
import NeuralTechNews from './components/NeuralTechNews';
import NeuralLink from './components/NeuralLink';
import SpaceTeleportNav from './components/SpaceTeleportNav';


function App() {
    const { profile, loading } = useProfile();
    const [showIntro, setShowIntro] = useState(true);
    const [contentVisible, setContentVisible] = useState(false);
    const [isDesktopMode, setIsDesktopMode] = useState(window.innerWidth < 768);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        // Neural Network Intersection Observer
        const neuralSection = document.querySelector('.neural-section');
        if (neuralSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.1 });
            observer.observe(neuralSection);
            return () => observer.disconnect();
        }
    }, [loading]);

    useEffect(() => {
        // Handle desktop mode viewport
        const viewport = document.querySelector('meta[name=viewport]');
        if (viewport) {
            viewport.setAttribute('content', isDesktopMode ? 'width=1200' : 'width=device-width, initial-scale=1.0');
        }
    }, [isDesktopMode]);

    useEffect(() => {
        // Handle window resize for mobile detection
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            setIsDesktopMode(mobile);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Back to Top Scroll Logic
        const btn = document.getElementById("backToTop");
        if (!btn) return;
        const handleScroll = () => {
            if (window.scrollY > 150) {
                btn.classList.add("visible");
                btn.classList.remove("hidden");
            } else {
                btn.classList.add("hidden");
                btn.classList.remove("visible");
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (showIntro) {
        return <Intro onComplete={() => setShowIntro(false)} />;
    }

    if (!profile && !loading) return <div className="error">Failed to load profile.</div>;



    return (
        <>
            <SpaceTeleportNav />
            <SwordSound />
            <Snow />
            <Cursor />

            {profile && <MusicPlayer musicData={profile.music} />}

            <div id="app-wrapper">
                <Hero profile={profile || {}} />

                <main className="content">
                    <Projects projects={profile?.projects || []} />

                    <Journey journeyData={profile?.journey || {}} />

                    <section className="neural-section" id="neural-section">
                        <h2 className="section-heading">Neural Network Visualization</h2>
                        <div className="neural-container">
                            <iframe src="neural/index.html" frameBorder="0" allow="fullscreen"></iframe>
                        </div>
                    </section>

                    <NeuralTechNews />


                    <Skills skills={profile?.skills} technologies={profile?.technologies} />
                </main>

                <footer className="footer">
                    <div className="samurai-sword">
                        <div className="sword-blade"></div>
                        <div className="sword-handle"></div>
                    </div>

                    <p className="footer-text">
                        Made with <span className="heart">❤️</span> by
                        <span className="name-glow"> Somnath Singh</span>
                    </p>

                    <p className="footer-copyright">
                        © <span id="year">{new Date().getFullYear()}</span> Somnath Singh. All rights reserved.
                    </p>

                    <p className="footer-license">
                        This website is licensed under the <strong>MIT License</strong>.
                    </p>

                    <NeuralLink />
                </footer>
            </div>

            <Contact />
            <button id="backToTop" className="back-to-top" onClick={scrollToTop}>↑</button>
        </>
    );
}

export default App;
