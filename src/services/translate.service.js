// Translation via Gemini Lite. Behavior moved verbatim from server.js.
import { getModel } from './llm/gemini.js';
import { LANG_NAMES } from '../domain/constants.js';

export async function translate(text, targetLang) {
  const model = getModel('gemini-2.5-flash-lite');
  const result = await model.generateContent(
    `Translate to ${LANG_NAMES[targetLang]||'English'}. Return ONLY the translation:\n\n${text}`
  );
  return result.response.text().trim();
}
