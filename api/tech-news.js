export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { q, category } = req.query;
    const apiKey = process.env.GNEWS_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API Configuration Error' });
    }

    // Construct the query: priority to specific query 'q', fallback to 'category', default to 'technology'
    let searchQuery = 'technology';
    if (q) searchQuery = q;
    else if (category) searchQuery = category;

    try {
        const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(searchQuery)}&lang=en&max=6&apikey=${apiKey}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`GNews API Error: ${response.statusText}`);
        }

        const data = await response.json();

        // Start of Selection
        const articles = data.articles.map(article => ({
            title: article.title,
            description: article.description,
            image: article.image,
            url: article.url,
            source: article.source.name,
            publishedAt: article.publishedAt
        }));

        return res.status(200).json({ articles });

    } catch (error) {
        console.error('Tech News API Error:', error);
        return res.status(500).json({ error: 'Failed to fetch news' });
    }
}
