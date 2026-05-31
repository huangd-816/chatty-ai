// Conversation history endpoints: sync, clear, fetch.
// Behavior moved verbatim from server.js.
import { Router } from 'express';
import { getChatHistory, saveChatHistory } from '../services/history.service.js';
import { clearAll } from '../services/memory.service.js';

const router = Router();

router.post('/sync-history', (req, res) => {
  const { companionId, messages } = req.body;
  try { saveChatHistory(companionId||'0816', messages); res.json({ ok:true }); }
  catch { res.json({ ok:false }); }
});

router.post('/clear-memory', (req, res) => {
  const { companionId } = req.body;
  try { clearAll(companionId || '0816'); res.json({ ok:true }); }
  catch { res.json({ ok:false }); }
});

router.get('/get-history', (req, res) => {
  const id = req.query.companionId || '0816';
  res.json({ messages: getChatHistory(id) });
});

export default router;
