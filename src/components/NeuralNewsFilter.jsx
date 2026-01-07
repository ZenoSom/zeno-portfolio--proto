import React, { useState } from 'react';

const NeuralNewsFilter = ({ activeCategory, onCategoryChange, onSearch, onRefresh, loading }) => {
    const categories = ['Technology', 'AI', 'Cybersecurity', 'Programming'];
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        if (e.key === 'Enter') {
            onSearch(e.target.value);
        }
    };

    return (
        <div className="news-header">
            <div className="news-title">Tech News</div>

            <div className="news-filters">
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                        onClick={() => onCategoryChange(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="news-actions">
                <div className="news-search">
                    <input
                        type="text"
                        placeholder="Search keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                </div>
                <button
                    className={`refresh-btn ${loading ? 'spinning' : ''}`}
                    onClick={onRefresh}
                    title="Refresh News"
                    disabled={loading}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3" /></svg>
                </button>
            </div>
        </div>
    );
};

export default NeuralNewsFilter;
