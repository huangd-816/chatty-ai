// Groq provider — used as a fallback when Gemini hits its quota.
// Behavior moved verbatim from server.js. Null when no API key configured.
import Groq from 'groq-sdk';
import config from '../../config.js';

export const groq = config.groqApiKey ? new Groq({ apiKey: config.groqApiKey }) : null;

export async function generateChat({ systemPrompt, memoryContext, history }) {
  const groqRes = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
      { role: 'system', content: systemPrompt + '\n\n' + memoryContext },
      ...history.slice(-6).map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }))
    ],
    response_format: { type: 'json_object' },
    temperature: 0.92, max_tokens: 500
  });
  return groqRes.choices[0].message.content;
}
