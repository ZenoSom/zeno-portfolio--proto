import React from 'react';

const NeuralNewsCard = ({ article }) => {
    // Format date nicely
    const date = new Date(article.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <div className="news-card">
            <img
                src={article.image}
                alt={article.title}
                className="news-image"
                onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'; // Fallback image
                }}
            />
            <div className="news-content">
                <div className="news-meta">
                    <span className="news-source">{article.source}</span>
                    <span className="news-date">{date}</span>
                </div>
                <h3>{article.title}</h3>
                <p className="news-desc">{article.description}</p>
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="news-link">
                    Read Article →
                </a>
            </div>
        </div>
    );
};

export default NeuralNewsCard;
