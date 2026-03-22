import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Journey({ journeyData = {} }) {
    const [activeTab, setActiveTab] = useState("1"); // 1: Achievements, 2: Certifications, 3: Experience
    const [showAll, setShowAll] = useState(false);
    const timelineRef = useRef(null);

    const getCategory = (val) => {
        if (val === "1") return "achievements";
        if (val === "2") return "certifications";
        if (val === "3") return "experience";
        return "achievements";
    };

    const category = getCategory(activeTab);
    const allItems = journeyData[category] || [];
    const items = showAll ? allItems : allItems.slice(0, 3);
    const hasMore = allItems.length > 3;

    // Event Listener for External Navigation
    useEffect(() => {
        const handleExternalNav = (e) => {
            const tab = e.detail;
            setActiveTab(tab);
        };

        window.addEventListener('changeJourneyTab', handleExternalNav);
        return () => window.removeEventListener('changeJourneyTab', handleExternalNav);
    }, []);

    // Original GSAP Animation Effect for the Tab Buttons (PRESERVED)
    useEffect(() => {
        const group = document.querySelector(`.radio-btn-group input[value="${activeTab}"]`)?.closest('.radio-btn-group');
        if (group) {
            const nodes = gsap.utils.shuffle(gsap.utils.selector(group)("rect"));

            gsap.to(nodes, {
                duration: 0.8,
                ease: "elastic.out(1, 0.3)",
                x: "100%",
                stagger: 0.01,
                overwrite: true
            });

            gsap.fromTo(
                nodes,
                { fill: "#0c79f7" },
                {
                    fill: "#76b3fa",
                    duration: 1.5,
                    ease: "power2.inOut",
                    yoyo: true,
                    repeat: -1
                }
            );

            const randomNodes = nodes.slice(0, 5);
            gsap.to(randomNodes, {
                duration: 1.5,
                ease: "power2.inOut",
                x: "100%",
                stagger: 0.2,
                repeatDelay: 2.0,
                repeat: -1
            });
        }
    }, [activeTab]);

    const handleTabChange = (val) => {
        const prevGroup = document.querySelector(`.radio-btn-group input[value="${activeTab}"]`)?.closest('.radio-btn-group');
        if (prevGroup) {
            const nodes = gsap.utils.selector(prevGroup)("rect");
            gsap.to(nodes, {
                duration: 0.8,
                ease: "elastic.out(1, 0.3)",
                x: "-100%",
                stagger: 0.01,
                overwrite: true
            });
        }
        setActiveTab(val);
    };

    // Reset showAll when tab changes
    useEffect(() => {
        setShowAll(false);
    }, [activeTab]);

    // GSAP Animation for Timeline Cards when Tab Changes
    useEffect(() => {
        if (!timelineRef.current) return;
        
        const cards = timelineRef.current.querySelectorAll('.journey-card-modern');
        if (cards.length > 0) {
            gsap.fromTo(cards, 
                { opacity: 0, x: -50, scale: 0.95 },
                {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "back.out(1.7)"
                }
            );
        }
    }, [activeTab]);

    return (
        <section className="journey-section modern-journey" id="journey">
            <div className="badges">
                <span className="badge ai" title="AI / ML">🧠</span>
                <span className="badge web" title="Web Development">🌐</span>
                <span className="badge security" title="Cyber Security">🛡</span>
                <span className="badge internship" title="Internship / Experience">⚙️</span>
            </div>

            <div className="container" style={{ marginBottom: "20px" }}>
                {[
                    { val: "1", label: "Achievements" },
                    { val: "2", label: "Certifications" },
                    { val: "3", label: "Experience" }
                ].map((tab) => (
                    <div key={tab.val} className="radio-btn-group">
                        <input
                            type="radio"
                            name="stagger-radio-group"
                            value={tab.val}
                            id={`input-${tab.val}`}
                            checked={activeTab === tab.val}
                            onChange={() => handleTabChange(tab.val)}
                        />
                        <label htmlFor={`input-${tab.val}`}>
                            <span>{tab.label}</span>
                            <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                                <g className="left">
                                    {Array.from({ length: 25 }).map((_, i) => (
                                        <rect key={i} x="-100%" y={i * 2} width="100%" height="2" />
                                    ))}
                                </g>
                            </svg>
                        </label>
                    </div>
                ))}
            </div>

            <div className="journey-timeline-modern" ref={timelineRef}>
                {items.length === 0 ? (
                    <div className="empty-state">No entries available yet.</div>
                ) : (
                    items.map((item, i) => (
                        <div key={i} className={`journey-card-modern ${category}`}>
                            <div className="timeline-dot"></div>
                            <div className="journey-card-content">
                                <div className="journey-header">
                                    <h3 className="journey-title">{item.title}</h3>
                                    <span className="journey-year">{item.year}</span>
                                </div>
                                <p className="journey-description">{item.description}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {hasMore && (
                <div className="show-more-container-modern" style={{ paddingBottom: '30px' }}>
                    <button
                        className="show-more-btn-modern"
                        onClick={() => {
                            setShowAll(!showAll);
                            if (showAll) {
                                document.getElementById("journey").scrollIntoView({ behavior: "smooth" });
                            }
                        }}
                    >
                        {showAll ? "Show Less" : "Show More"}
                    </button>
                </div>
            )}
        </section>
    );
}
