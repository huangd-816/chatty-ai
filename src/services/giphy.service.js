// Giphy integration: server-side gif resolution (for AI replies) + search/trending.
// Behavior moved verbatim from server.js.
import config from '../config.js';

// Resolve a single best-match gif URL for a query, with fallbacks.
export async function fetchGif(query) {
  const key = config.giphyApiKey;
  const trySearch = async (q) => {
    const r = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${key}&q=${encodeURIComponent(q)}&limit=10&rating=pg-13`);
    const d = await r.json();
    if (d.data?.length > 0) {
      const pick = d.data[Math.floor(Math.random() * Math.min(5, d.data.length))];
      return pick.images.original.url;
    }
    return null;
  };
  try {
    const result = await trySearch(query);
    if (result) return result;
    const simple = query.split(' ').slice(0, 2).join(' ');
    if (simple !== query) { const r2 = await trySearch(simple); if (r2) return r2; }
    const fallbacks = ['funny reaction', 'omg', 'lol', 'cute', 'mood'];
    return await trySearch(fallbacks[Math.floor(Math.random() * fallbacks.length)]);
  } catch(e) { console.error('Giphy:', e.message); return null; }
}

function mapGifs(data) {
  return (data || []).map(g => ({ id:g.id, url:g.images.original.url, preview:g.images.fixed_width_small.url, title:g.title }));
}

export async function searchGifs(q) {
  const key = config.giphyApiKey;
  const r = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${key}&q=${encodeURIComponent(q)}&limit=12&rating=pg-13`);
  const d = await r.json();
  return mapGifs(d.data);
}

export async function trendingGifs() {
  const key = config.giphyApiKey;
  const r = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${key}&limit=12&rating=pg-13`);
  const d = await r.json();
  return mapGifs(d.data);
}
