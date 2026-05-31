// GIF/meme vision description via Gemini (supports animated GIFs).
// Behavior moved from server.js + an SSRF guard: only fetch from Giphy hosts.
// Uploaded images arrive as data: URLs and never trigger a network fetch.
import { getModel } from './llm/gemini.js';

const FALLBACK = { description: 'a meme', text: '', people: '', vibe: 'funny' };
const UPLOAD = { description: 'an uploaded image', text: '', people: '', vibe: 'funny' };
const ERROR_FALLBACK = { description: 'a funny meme', text: '', people: '', vibe: 'funny' };

// Only allow fetching remote images from Giphy (closes server-side request forgery).
function isAllowedImageUrl(url) {
  try {
    const u = new URL(url);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return false;
    return u.hostname === 'giphy.com' || u.hostname.endsWith('.giphy.com');
  } catch {
    return false;
  }
}

export async function describeGif(imageUrl) {
  if (!imageUrl) return { ...FALLBACK };
  if (imageUrl.startsWith('data:')) return { ...UPLOAD };
  if (!isAllowedImageUrl(imageUrl)) return { ...ERROR_FALLBACK };
  try {
    const imgResp = await fetch(imageUrl);
    const imgBuf = await imgResp.arrayBuffer();
    const imgB64 = Buffer.from(imgBuf).toString('base64');
    const mimeType = imageUrl.includes('.gif') ? 'image/gif' : 'image/jpeg';
    const visionModel = getModel('gemini-2.0-flash');
    const visionResult = await visionModel.generateContent([
      { inlineData: { data: imgB64, mimeType } },
      'Analyze this meme/GIF in JSON only: {"description":"one casual sentence","text":"visible text or empty string","people":"characters/people or empty string","vibe":"funny/wholesome/dramatic/chaotic/sad"}'
    ]);
    const raw = visionResult.response.text().replace(/```json|```/g,'').trim();
    return JSON.parse(raw);
  } catch(e) {
    console.error('Vision error:', e.message);
    return { ...ERROR_FALLBACK };
  }
}
