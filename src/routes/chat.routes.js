// POST /chat — the core conversation endpoint. Orchestrates analysis,
// memory, prompt assembly, LLM generation, gif resolution, and persistence.
// Logic moved verbatim from server.js, delegating to services.
import { Router } from 'express';
import { analyzeMessage } from '../services/analyze.service.js';
import { getMemory, saveMemory, applyAnalysis, applyUpdates } from '../services/memory.service.js';
import { getChatHistory, saveChatHistory } from '../services/history.service.js';
import { buildSystemPrompt, buildMemoryContext } from '../services/prompt.service.js';
import { generateChat } from '../services/llm/index.js';
import { fetchGif } from '../services/giphy.service.js';
import { userScopedId } from '../store/fileStore.js';
import { MOOD_POOLS } from '../domain/constants.js';

const router = Router();

router.post('/chat', async (req, res) => {
  const { message, fullMessage, companionId, companion, context } = req.body;
  const id = userScopedId(req.user.id, companionId);
  const aiMessage = fullMessage || message;

  const timeContext = context
    ? `[Context: Time is ${context.time} on ${context.date}. Timezone: ${context.timezone}]`
    : '';

  let history = getChatHistory(id);
  let memory  = getMemory(id);
  const analysis = analyzeMessage(message);
  applyAnalysis(memory, analysis, message);

  // Handle edited messages - replace the old version in history
  const isEdit = aiMessage.startsWith('[User edited their previous message to]:');
  if (isEdit) {
    const newText = aiMessage.replace('[User edited their previous message to]: ', '');
    // Find and replace the last user message in history
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].role === 'user') {
        history[i].content = newText;
        break;
      }
    }
    // Remove last AI response so it regenerates
    if (history[history.length-1]?.role === 'assistant') history.pop();
  } else {
    history.push({ role:'user', content:aiMessage });
  }

  const memoryContext = buildMemoryContext(memory, history, timeContext);
  const systemPrompt = buildSystemPrompt(companion || { name:'0816', personalities:['bff'], vibe:'bestie', language:'en', gender:'female' });

  try {
    const raw = await generateChat({ systemPrompt, memoryContext, history, fallbackMsg: aiMessage });

    history.push({ role:'assistant', content:raw });
    saveChatHistory(id, history);

    let parsed;
    try { parsed = JSON.parse(raw.replace(/^```json/,'').replace(/```$/,'').trim()); }
    catch { parsed = { messages:[{ type:'text', content:'oops brain glitch 👻', textToRead:'oops' }] }; }

    const isPlaceholder = s => !s || /^(spoken version|placeholder|\[.*\]|0:\d\d)$/i.test(s.trim());
    let lastTextContent = '';
    for (const msg of parsed.messages||[]) {
      if (msg.type==='gif' && msg.query) {
        const url = await fetchGif(msg.query);
        if (url) { msg.type='image'; msg.content=url; msg.isGif=true; }
        else { msg.type='text'; msg.content="couldn't load that gif 😅"; }
      }
      // Track last text content for dedup
      if (msg.type === 'text') { lastTextContent = msg.content || ''; delete msg.textToRead; }
      // Voice: reject placeholder OR exact repeat of preceding text message
      if (msg.type === 'voice') {
        const ttr = msg.textToRead?.trim() || '';
        if (isPlaceholder(ttr)) {
          msg.type = 'text'; msg.content = '...'; delete msg.textToRead;
        } else if (ttr === lastTextContent.trim()) {
          // Same as text above — drop the voice message entirely
          msg._drop = true;
        }
      }
    }

    parsed.messages = (parsed.messages||[]).filter(m => !m._drop);

    applyUpdates(memory, parsed.memoryUpdates);

    if (parsed.messages?.length) memory.affection = Math.min(100, (memory.affection||0) + 8);

    const pool = MOOD_POOLS[memory.mood]||MOOD_POOLS.neutral;
    const emojiReaction = Math.random()<0.7 ? pool[Math.floor(Math.random()*pool.length)] : null;

    saveMemory(id, memory);
    res.json({ ...parsed, emojiReaction, profile:{ chatCount:memory.chatCount, affection:memory.affection } });

  } catch(e) {
    console.error('Gemini Error:', e.message);
    res.status(500).json({ messages:[{ type:'text', content:'brain glitched 👻 gimme a sec', textToRead:'oops' }] });
  }
});

export default router;
