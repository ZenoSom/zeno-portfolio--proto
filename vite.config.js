import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'configure-server',
        configureServer(server) {
          server.middlewares.use('/api/tech-news', async (req, res, next) => {
            // Parse query parameters
            const url = new URL(req.url, `http://${req.headers.host}`);
            const q = url.searchParams.get('q');
            const category = url.searchParams.get('category');

            const apiKey = env.GNEWS_API_KEY;

            if (!apiKey) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'API Key missing in .env' }));
              return;
            }

            let searchQuery = 'technology';
            if (q) searchQuery = q;
            else if (category) searchQuery = category;

            try {
              const fetchUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(searchQuery)}&lang=en&max=6&apikey=${apiKey}`;
              const apiRes = await fetch(fetchUrl);

              if (!apiRes.ok) {
                const errText = await apiRes.text();
                console.error('GNews Error:', errText);
                throw new Error(`GNews API Error: ${apiRes.status} ${apiRes.statusText}`);
              }

              const data = await apiRes.json();

              const articles = data.articles ? data.articles.map(article => ({
                title: article.title,
                description: article.description,
                image: article.image,
                url: article.url,
                source: article.source.name,
                publishedAt: article.publishedAt
              })) : [];

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ articles }));
            } catch (error) {
              console.error('Middleware Error:', error);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Failed to fetch news locally' }));
            }
          });
        }
      }
    ],
  };
});

