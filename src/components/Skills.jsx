import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Skills({ skills = [], technologies = [] }) {
    const containerRef = useRef(null);

    useEffect(() => {
        // Temporarily disabled GSAP for debugging
        /*
        const ctx = gsap.context(() => {
            gsap.from(".icon-card", {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                },
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out"
            });
        }, containerRef);

        return () => ctx.revert();
        */
    }, []);

    const renderGrid = (items) => (
        items.map((it, i) => (
            <div key={i} className="icon-card">
                <img
                    src={it.icon || "assets/icons/project-placeholder.png"}
                    alt={it.name}
                    onError={(e) => e.target.src = "assets/icons/project-placeholder.png"}
                />
                <p>{it.name}</p>
            </div>
        ))
    );

    return (
        <section className="section skills-section" id="skills">
            <h2 className="section-heading">Skills & Technologies</h2>
            <div className="skills-box-container" ref={containerRef}>
                <div id="skillsGrid" className="icons-grid">
                    {renderGrid(skills)}
                </div>
                <div id="techGrid" className="icons-grid">
                    {renderGrid(technologies)}
                </div>
            </div>
        </section>
    );
}
