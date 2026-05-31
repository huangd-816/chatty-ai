// POST /translate — Gemini Lite translation. Behavior moved verbatim from server.js.
import { Router } from 'express';
import { translate } from '../services/translate.service.js';

const router = Router();

router.post('/translate', async (req, res) => {
  const { text, targetLang } = req.body;
  if (!text?.trim()) return res.json({ translated: text });
  try {
    res.json({ translated: await translate(text, targetLang) });
  } catch {
    res.status(500).json({ translated: text });
  }
});

export default router;
