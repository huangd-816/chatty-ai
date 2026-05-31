// Provider-agnostic chat generation. Tries Gemini, falls back to Groq on
// quota/429 errors (when configured). Returns raw model text (JSON string).
// Fallback logic moved verbatim from server.js.
import * as gemini from './gemini.js';
import * as groqProvider from './groq.js';

export async function generateChat({ systemPrompt, memoryContext, history, fallbackMsg }) {
  try {
    return await gemini.generateChat({ systemPrompt, memoryContext, history, fallbackMsg });
  } catch (geminiErr) {
    if (geminiErr.message?.includes('429') || geminiErr.message?.includes('quota')) {
      if (!groqProvider.groq) throw geminiErr;
      console.log('Gemini quota hit, falling back to Groq...');
      return await groqProvider.generateChat({ systemPrompt, memoryContext, history });
    }
    throw geminiErr;
  }
}
