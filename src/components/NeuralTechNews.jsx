import React, { useState, useEffect, useRef } from 'react';
import NeuralNewsCard from './NeuralNewsCard';
import NeuralNewsFilter from './NeuralNewsFilter';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const NeuralTechNews = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [category, setCategory] = useState('Technology');
    const [searchQuery, setSearchQuery] = useState('');
    const gridRef = useRef(null);

    // Animation Effect
    useEffect(() => {
        if (loading || articles.length === 0) return;

        const ctx = gsap.context(() => {
            // Slight delay to ensure DOM is fully painted
            const timer = setTimeout(() => {
                gsap.fromTo(".news-card",
                    { y: 50, opacity: 0 },
                    {
                        scrollTrigger: {
                            trigger: gridRef.current,
                            start: "top bottom-=50", // Start slightly before bottom
                            toggleActions: "play none none reverse"
                        },
                        y: 0,
                        opacity: 1,
                        duration: 0.6,
                        stagger: 0.1,
                        ease: "power2.out",
                        onComplete: () => {
                            // Clean up styles to prevent z-index/transform issues after animation
                            gsap.set(".news-card", { clearProps: "transform,opacity" });
                        }
                    }
                );
                ScrollTrigger.refresh();
            }, 100);

            return () => clearTimeout(timer);
        }, gridRef);

        return () => ctx.revert();
    }, [articles, loading]); // Re-run when content changes

    useEffect(() => {
        fetchNews();
    }, [category, searchQuery]);

    const getMockArticles = (cat) => {
        const categoryKey = cat.toLowerCase();

        const mocks = {
            technology: [
                { title: "The Future of Quantum Computing", description: "Scientists achieve new stability milestones in qubit processing.", image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb", source: "TechDaily", url: "#", publishedAt: new Date().toISOString() },
                { title: "Next-Gen Smartphones Released", description: "Foldable screens and holographic displays take center stage.", image: "https://images.unsplash.com/photo-1556656793-024524432fbc", source: "GadgetWorld", url: "#", publishedAt: new Date().toISOString() },
                { title: "Global 6G Research Begins", description: "Telecommunications giants agree on preliminary standards for 6G networks.", image: "https://images.unsplash.com/photo-1534081333815-ae5019106622", source: "NetNews", url: "#", publishedAt: new Date().toISOString() }
            ],
            ai: [
                { title: "Generative AI Transforms Coding", description: "New LLMs are writing production-ready code faster than ever.", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995", source: "AI Weekly", url: "#", publishedAt: new Date().toISOString() },
                { title: "Neural Networks in Healthcare", description: "AI diagnostics are saving lives by detecting diseases early.", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d", source: "HealthTech", url: "#", publishedAt: new Date().toISOString() },
                { title: "Ethical AI Framework Proposed", description: "Global leaders discuss regulations for autonomous systems.", image: "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1", source: "LawFuture", url: "#", publishedAt: new Date().toISOString() }
            ],
            mobile: [
                { title: "Revolutionary Battery Tech", description: "New phone batteries last week on a single charge.", image: "https://images.unsplash.com/photo-1581093458791-9f302e6d8359", source: "MobileInsider", url: "#", publishedAt: new Date().toISOString() },
                { title: "App Store Ecology Shifts", description: "New regulations open up mobile ecosystems to competition.", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c", source: "AppBiz", url: "#", publishedAt: new Date().toISOString() },
                { title: "5G Satellites Launching", description: "Direct-to-mobile satellite connectivity becomes a reality.", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3", source: "SpaceLink", url: "#", publishedAt: new Date().toISOString() }
            ],
            iot: [
                { title: "Smart Cities of 2026", description: "IoT sensors manage traffic and energy in real-time.", image: "https://images.unsplash.com/photo-1573164713988-8665fc963095", source: "CityTech", url: "#", publishedAt: new Date().toISOString() },
                { title: "Secure Home Automation", description: "New standard 'Matter 2.0' ensures seamless device security.", image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f", source: "HomeSmart", url: "#", publishedAt: new Date().toISOString() },
                { title: "Industrial IoT Efficiency", description: "Factories report 40% output increase with connected sensors.", image: "https://images.unsplash.com/photo-1565514020176-87d292427676", source: "Industry 4.0", url: "#", publishedAt: new Date().toISOString() }
            ],
            security: [
                { title: "Zero Trust Architecture", description: "Why companies are moving away from perimeter security.", image: "https://images.unsplash.com/photo-1563986768609-322da13575f3", source: "SecOps", url: "#", publishedAt: new Date().toISOString() },
                { title: "Biometric Passkeys Adopted", description: "Passwords are becoming obsolete as passkeys take over.", image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb", source: "AuthNews", url: "#", publishedAt: new Date().toISOString() },
                { title: "Quantum Encryption Shield", description: "First commercially viable quantum-safe encryption network live.", image: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87", source: "CyberGuard", url: "#", publishedAt: new Date().toISOString() }
            ],
            blockchain: [
                { title: "Web3 Gaming Resurgence", description: "Blockchain games are back with better gameplay and graphics.", image: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9", source: "ChainPlay", url: "#", publishedAt: new Date().toISOString() },
                { title: "DeFi Regulations 2026", description: "New global standards for decentralized finance announced.", image: "https://images.unsplash.com/photo-1621501103258-3e135c8c1a90", source: "CoinLaw", url: "#", publishedAt: new Date().toISOString() },
                { title: "NFT Utility Cases", description: "Beyond art: Real estate and tickets move on-chain.", image: "https://images.unsplash.com/photo-1620321023374-d1a68fdd720d", source: "TokenTimes", url: "#", publishedAt: new Date().toISOString() }
            ]
        };

        // Return specific category or default to technology/mixed if not found
        // Also combine a few if "technology" is selected to make it feel full
        if (categoryKey === 'technology') {
            return [...mocks.technology, ...mocks.ai];
        }

        return mocks[categoryKey] || mocks.technology;
    };

    const fetchNews = async () => {
        setLoading(true);
        setError(null);
        try {
            // Construct URL parameters
            const params = new URLSearchParams();
            if (searchQuery) params.append('q', searchQuery);
            else params.append('category', category.toLowerCase());

            // Use the API route which mimics backend behavior or is the actual backend
            const response = await fetch(`/api/tech-news?${params.toString()}`);

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || 'Failed to fetch news');
            }

            const data = await response.json();
            if (!data.articles || data.articles.length === 0) {
                // Fallback if no specific data found
                throw new Error("No articles");
            }
            setArticles(data.articles || []);
        } catch (err) {
            console.warn("API Error, using fallback data:", err);
            // Dynamic Fallback logic
            const fallbackData = getMockArticles(category);
            setArticles(fallbackData);
            // Optional: Only show error if we really want to, but for portfolio, fallback is better
            // setError('Using offline mode.'); 
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (newCategory) => {
        setCategory(newCategory);
        setSearchQuery(''); // Clear search when switching category
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        // We don't necessarily clear category visually but the fetch logic prioritizes query
    };

    const handleRefresh = () => {
        fetchNews();
    };

    return (
        <section className="neural-news-section" id="tech-news">
            <h2 className="section-heading">Tech News Stream</h2>
            <NeuralNewsFilter
                activeCategory={category}
                onCategoryChange={handleCategoryChange}
                onSearch={handleSearch}
                onRefresh={handleRefresh}
                loading={loading}
            />

            {/* Error is mostly hidden now in favor of fallback, but kept logic clean */}
            {error && (
                <div className="news-error">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="news-loading">
                    INITIALIZING NEURAL NEWS STREAM...
                </div>
            ) : articles.length > 0 ? (
                <div className="news-grid" ref={gridRef}>
                    {articles.map((article, index) => (
                        <NeuralNewsCard key={article.url + index} article={article} />
                    ))}
                </div>
            ) : (
                <div className="news-empty">
                    NO NEURAL DATA FOUND FOR THIS PARAMETER.
                </div>
            )}
        </section>
    );
};

export default NeuralTechNews;
