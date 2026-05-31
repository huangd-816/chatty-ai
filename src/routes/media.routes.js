// Giphy search/trending + GIF vision description.
// Behavior moved verbatim from server.js.
import { Router } from 'express';
import { searchGifs, trendingGifs } from '../services/giphy.service.js';
import { describeGif } from '../services/vision.service.js';

const router = Router();

router.get('/giphy/search', async (req, res) => {
  try { res.json({ gifs: await searchGifs(req.query.q) }); }
  catch { res.json({ gifs: [] }); }
});

router.get('/giphy/trending', async (req, res) => {
  try { res.json({ gifs: await trendingGifs() }); }
  catch { res.json({ gifs: [] }); }
});

router.post('/describe-gif', async (req, res) => {
  res.json(await describeGif(req.body.imageUrl));
});

export default router;
