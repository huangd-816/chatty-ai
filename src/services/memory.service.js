// Long-term per-companion memory: load (with defaults + migration), save,
// and the two mutation paths (heuristic analysis + model-supplied updates).
// Behavior moved verbatim from server.js.
import { memoryFile, historyFile, readJson, writeJson, exists, remove } from '../store/fileStore.js';

function defaultMemory() {
  return { userName:null, affection:0, chatCount:0, lastInteraction:null, mood:'neutral', topics:[], keywords:[], sentiment:'positive', preferences:{ emojiReactions:[], favoriteTopics:[] }, insights:[], facts:[], emotions:[], importantMoments:[], sharedJokes:[], currentSituation:'', personality:{ humorLevel:5, openness:5, emotionalDepth:5 } };
}

export function getMemory(id) {
  const f = memoryFile(id);
  if (!exists(f)) {
    const def = defaultMemory();
    writeJson(f, def);
    return def;
  }
  const m = readJson(f, null);
  if (!m) return { userName:null, facts:[], emotions:[], importantMoments:[], sharedJokes:[], currentSituation:'', topics:[], keywords:[], preferences:{ emojiReactions:[] }, affection:0, chatCount:0, sentiment:'positive', mood:'neutral' };
  if (!m.facts) m.facts = [];
  if (!m.emotions) m.emotions = [];
  if (!m.importantMoments) m.importantMoments = [];
  if (!m.sharedJokes) m.sharedJokes = [];
  if (!m.currentSituation) m.currentSituation = '';
  if (!m.userName) m.userName = null;
  return m;
}

export function saveMemory(id, m) {
  writeJson(memoryFile(id), m);
}

// Fold heuristic analysis of the user's message into memory.
export function applyAnalysis(memory, analysis, message) {
  memory.chatCount      = (memory.chatCount||0) + 1;
  memory.lastInteraction = new Date().toISOString();
  memory.mood           = analysis.mood;
  memory.sentiment      = analysis.sentiment;
  memory.topics         = [...new Set([...(memory.topics||[]), ...analysis.topics])].slice(-15);
  memory.keywords       = [...new Set([...(memory.keywords||[]), ...analysis.keywords])].slice(-20);
  if (analysis.facts.length) memory.facts = [...new Set([...(memory.facts||[]), ...analysis.facts])].slice(-30);
  if (analysis.mood !== 'neutral') {
    memory.emotions = [...(memory.emotions||[]), {
      date: new Date().toISOString().split('T')[0],
      emotion: analysis.mood, context: message.slice(0,50)
    }].slice(-20);
  }
  return memory;
}

// Fold the model's structured memoryUpdates block into memory.
export function applyUpdates(memory, mu) {
  if (!mu) return memory;
  const today = new Date().toISOString().split('T')[0];
  if (mu.userName) memory.userName = mu.userName;
  if (mu.newFact) memory.facts = [...new Set([...memory.facts, mu.newFact])].slice(-30);
  if (mu.emotionLog) memory.emotions = [...memory.emotions, { date:today, emotion:mu.emotionLog, context:'AI observed' }].slice(-20);
  if (mu.importantMoment) memory.importantMoments = [...(memory.importantMoments||[]), { text:mu.importantMoment, date:today }].slice(-10);
  if (mu.currentSituation) memory.currentSituation = mu.currentSituation;
  if (mu.sharedJoke) memory.sharedJokes = [...(memory.sharedJokes||[]), mu.sharedJoke].slice(-8);
  return memory;
}

// Reset a companion: empty history file, delete memory file.
export function clearAll(id) {
  const hf = historyFile(id), mf = memoryFile(id);
  if (exists(hf)) writeJson(hf, []);
  remove(mf);
}
