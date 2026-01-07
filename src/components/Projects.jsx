import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Projects({ projects = [] }) {
    const [filter, setFilter] = useState("All");
    const sliderRef = useRef(null);

    const filteredProjects = projects.filter(p => filter === "All" || p.category === filter);

    // GSAP Scroll Animation
    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        // Animate cards whenever the filtered list changes
        const ctx = gsap.context(() => {
            gsap.from(".project-card", {
                scrollTrigger: {
                    trigger: slider,
                    start: "top 85%",
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out"
            });
        }, sliderRef);

        return () => ctx.revert();
    }, [filter]); // Re-run animation when filter changes

    // Drag Scroll Logic
    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        // ... (existing drag logic)
        let isDown = false;
        let startX;
        let scrollLeft;

        const onMouseDown = (e) => {
            isDown = true;
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        };
        const onMouseUp = () => isDown = false;
        const onMouseLeave = () => isDown = false;
        const onMouseMove = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX);
            slider.scrollLeft = scrollLeft - walk;
        };

        slider.addEventListener('mousedown', onMouseDown);
        slider.addEventListener('mouseleave', onMouseLeave);
        slider.addEventListener('mouseup', onMouseUp);
        slider.addEventListener('mousemove', onMouseMove);

        return () => {
            slider.removeEventListener('mousedown', onMouseDown);
            slider.removeEventListener('mouseleave', onMouseLeave);
            slider.removeEventListener('mouseup', onMouseUp);
            slider.removeEventListener('mousemove', onMouseMove);
        };
    }, []);

    return (
        <section className="projects-section" id="projects">
            <h2 className="section-heading">Projects</h2>

            <div className="project-filters">
                {["All", "Web", "IoT", "AI", "Security"].map(f => (
                    <button
                        key={f}
                        className={`filter-btn ${filter === f ? 'active' : ''} ${f.toLowerCase()}`}
                        onClick={() => setFilter(f)}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="projects-slider" id="projectsSlider" ref={sliderRef}>
                {filteredProjects.map((p, i) => (
                    <div key={i} className={`project-card ${p.category}`}>
                        <img src={p.image} alt={p.title} loading="lazy" onError={(e) => e.target.src = "assets/icons/project-placeholder.png"} />
                        <h4>{p.title}</h4>
                        <p>{p.description}</p>
                        {p.link && <button onClick={() => window.open(p.link, "_blank")}>Open</button>}
                    </div>
                ))}
            </div>
        </section>
    );
}
