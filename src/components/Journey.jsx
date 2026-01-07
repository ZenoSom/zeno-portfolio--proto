import { useState, useEffect } from 'react';
import { gsap } from 'gsap';

export default function Journey({ journeyData = {} }) {
    const [activeTab, setActiveTab] = useState("1"); // 1: Achievements, 2: Certifications, 3: Experience
    const [modalItem, setModalItem] = useState(null);

    const getCategory = (val) => {
        if (val === "1") return "achievements";
        if (val === "2") return "certifications";
        if (val === "3") return "experience";
        return "achievements";
    };

    const category = getCategory(activeTab);
    const items = journeyData[category] || [];

    // Event Listener for External Navigation
    useEffect(() => {
        const handleExternalNav = (e) => {
            const tab = e.detail;
            setActiveTab(tab);
            setShowAll(true); // Auto-expand when navigating from menu
        };

        window.addEventListener('changeJourneyTab', handleExternalNav);
        return () => window.removeEventListener('changeJourneyTab', handleExternalNav);
    }, []);

    // GSAP Animation Effect
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
                    duration: 0.1,
                    ease: "elastic.out(1, 0.3)",
                    repeat: -1
                }
            );

            const randomNodes = nodes.slice(0, 5);
            gsap.to(randomNodes, {
                duration: 0.7,
                ease: "elastic.out(1, 0.1)",
                x: "100%",
                stagger: 0.1,
                repeatDelay: 1.5,
                repeat: -1
            });

            // Reset others ?? - The original code resets "previous" button. 
            // In React we re-render, so creating a new 'RadioButtonEffect' instance or logic might be tricky.
            // We will simplify: animate the CURRENT one. The others will just be static or reset by re-render if we were fully mounting/unmounting, 
            // but here we are just changing state.
            // To be exact parity, we should ideally run the "off" animation for the previous one.
            // But since we track activeTab, we can useEffect on activeTab change to trigger animations.
        }
    }, [activeTab]);


    const handleTabChange = (val) => {
        // "Off" animation for current tab before switching? 
        // The original code: changeEffect(previous, false) which moves x to -100%.
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


    const [showAll, setShowAll] = useState(false);

    // Reset showAll when tab changes
    useEffect(() => {
        setShowAll(false);
    }, [activeTab]);

    const visibleItems = showAll ? items : items.slice(0, 3);
    const hasMore = items.length > 3;

    return (
        <section className="journey-section" id="journey">
            <div className="badges">
                <span className="badge ai" title="AI / ML">🧠</span>
                <span className="badge web" title="Web Development">🌐</span>
                <span className="badge security" title="Cyber Security">🛡</span>
                <span className="badge internship" title="Internship / Experience">⚙️</span>
            </div>

            <div className="container">
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

            <div className="journey-cards" id="journeyCards">
                {visibleItems.map((item, i) => (
                    <div key={i} className={`journey-card ${category}`} onClick={() => setModalItem(item)}>
                        <h4>{item.title}</h4>
                        <span>{item.year}</span>
                        <p>Click to view</p>
                    </div>
                ))}
            </div>

            {hasMore && (
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button
                        className="view-all-btn"
                        onClick={() => setShowAll(!showAll)}
                    >
                        {showAll ? 'Show Less' : 'View All'}
                    </button>
                </div>
            )}

            <div className={`journey-modal ${modalItem ? '' : 'hidden'}`} id="journeyModal">
                <div className="journey-modal-card">
                    <h3>{modalItem?.title}</h3>
                    <span>{modalItem?.year}</span>
                    <p>{modalItem?.description}</p>
                    <button onClick={() => setModalItem(null)}>Close</button>
                </div>
            </div>
        </section>
    );
}
