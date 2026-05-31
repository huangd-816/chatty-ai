// Gemini provider. Exposes the shared client (for vision + translate),
// the default chat model, and a chat-generation helper.
// Chat history/role handling moved verbatim from server.js.
import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../../config.js';

export const genAI = new GoogleGenerativeAI(config.geminiApiKey);
export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export function getModel(name) {
  return genAI.getGenerativeModel({ model: name });
}

// Returns raw model text (expected to be JSON). May throw (e.g. quota 429).
export async function generateChat({ systemPrompt, memoryContext, history, fallbackMsg }) {
  const pastMessages = history.slice(-14);
  // Gemini requires history to start with 'user' role
  const allPast = pastMessages.slice(0, -1).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));
  // Drop leading model messages
  let startIdx = 0;
  while (startIdx < allPast.length && allPast[startIdx].role === 'model') startIdx++;
  const geminiHistory = allPast.slice(startIdx);
  const lastUserMsg = pastMessages.slice(-1)[0]?.content || fallbackMsg;

  const chat = geminiModel.startChat({
    history: geminiHistory,
    systemInstruction: {
      role: 'user',
      parts: [{ text: systemPrompt + '\n\n' + memoryContext }]
    },
    generationConfig: { temperature: 0.92, maxOutputTokens: 600, responseMimeType: 'application/json' }
  });

  const result = await chat.sendMessage(lastUserMsg);
  return result.response.text();
}
