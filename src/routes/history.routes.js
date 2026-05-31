// Conversation history endpoints: sync, clear, fetch.
// Storage is namespaced per authenticated user.
import { Router } from 'express';
import { getChatHistory, saveChatHistory } from '../services/history.service.js';
import { clearAll } from '../services/memory.service.js';
import { userScopedId } from '../store/fileStore.js';

const router = Router();

router.post('/sync-history', (req, res) => {
  const { companionId, messages } = req.body;
  try { saveChatHistory(userScopedId(req.user.id, companionId), messages); res.json({ ok:true }); }
  catch { res.json({ ok:false }); }
});

router.post('/clear-memory', (req, res) => {
  const { companionId } = req.body;
  try { clearAll(userScopedId(req.user.id, companionId)); res.json({ ok:true }); }
  catch { res.json({ ok:false }); }
});

router.get('/get-history', (req, res) => {
  res.json({ messages: getChatHistory(userScopedId(req.user.id, req.query.companionId)) });
});

export default router;
