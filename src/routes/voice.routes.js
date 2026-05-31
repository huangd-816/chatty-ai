// POST /tts — ElevenLabs text-to-speech. Behavior moved verbatim from server.js.
import { Router } from 'express';
import { synthesize } from '../services/voice.service.js';

const router = Router();

router.post('/tts', async (req, res) => {
  const { text, companion } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'No text' });
  try {
    const audio = await synthesize(text, companion || {});
    res.set('Content-Type', 'audio/mpeg');
    res.send(audio);
  } catch(e) {
    res.status(e.status || 500).json({ error: e.message });
  }
});

export default router;
