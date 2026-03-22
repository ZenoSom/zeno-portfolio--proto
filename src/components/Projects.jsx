import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Projects({ projects = [] }) {
    const [filter, setFilter] = useState("All");
    const [showAll, setShowAll] = useState(false);
    const gridRef = useRef(null);

    // Ensure backwards compatibility by filtering correctly
    const filteredProjects = projects.filter(p => filter === "All" || p.category === filter);
    const displayedProjects = showAll ? filteredProjects : filteredProjects.slice(0, 4);

    // Filter categories (unique list from projects + "All")
    const categories = ["All", ...new Set(projects.map(p => p.category))].filter(Boolean);

    // Initial appearance and scroll animations
    useEffect(() => {
        const grid = gridRef.current;
        if (!grid) return;

        // Clean up previous animations when re-filtering
        const ctx = gsap.context(() => {
            gsap.fromTo(".project-card-modern", 
                { y: 60, opacity: 0, scale: 0.95 },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: grid,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }, gridRef);

        return () => ctx.revert();
    }, [filter, showAll]);

    return (
        <section className="projects-section modern-projects" id="projects">
            <h2 className="section-heading glitched-heading">Featured Projects</h2>
            
            <div className="project-filters-modern">
                {categories.map(f => (
                    <button
                        key={f}
                        className={`filter-btn-modern ${filter === f ? 'active' : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className={`projects-grid-modern ${showAll ? 'expanded' : ''}`} ref={gridRef}>
                {displayedProjects.map((p, i) => (
                    <div key={i} className={`project-card-modern ${p.featured ? 'featured-project' : ''}`}>
                        <div className="project-image-wrapper">
                            <img src={p.image} alt={p.title} loading="lazy" onError={(e) => e.target.src = "assets/icons/project-placeholder.png"} />
                            {p.featured && <div className="featured-badge">Featured Target</div>}
                        </div>
                        <div className="project-content">
                            <span className="project-category">{p.category}</span>
                            <h4>{p.title}</h4>
                            <p>{p.description}</p>
                            {p.link && (
                                <a href={p.link} target="_blank" rel="noreferrer" className="project-link-btn">
                                    Initiate Link <span className="arrow">↗</span>
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filteredProjects.length > 4 && (
                <div className="show-more-container-modern">
                    <button
                        className="show-more-btn-modern"
                        onClick={() => {
                            setShowAll(!showAll);
                            if (showAll) {
                                document.getElementById("projects").scrollIntoView({ behavior: "smooth" });
                            }
                        }}
                    >
                        {showAll ? "Show Less Projects" : "Show More Projects"}
                    </button>
                </div>
            )}
        </section>
    );
}
