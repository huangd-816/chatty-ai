// ElevenLabs text-to-speech. Voice selection moved verbatim from server.js.
import config from '../config.js';
import { ELEVENLABS_VOICES, VOICE_STYLE_IDS, PERSONALITY_TTS_SETTINGS } from '../domain/constants.js';

export function getVoiceId(companion) {
  const gender = companion.gender || 'female';
  const style = companion.voiceStyle;
  if (style && style !== 'auto' && VOICE_STYLE_IDS[style]) {
    return VOICE_STYLE_IDS[style][gender] || VOICE_STYLE_IDS[style].female;
  }
  const p = (companion.personalities||['bff'])[0];
  const key = gender === 'male' ? `male_${p}` : p;
  return ELEVENLABS_VOICES[key] || ELEVENLABS_VOICES.bff;
}

export function getVoiceSettings(companion) {
  const p = (companion.personalities||['bff'])[0];
  return PERSONALITY_TTS_SETTINGS[p] || { stability:0.5, similarity_boost:0.8, style:0.5 };
}

// Returns an audio Buffer. Throws an Error with `.status` on upstream failure.
export async function synthesize(text, companion) {
  const voiceId = getVoiceId(companion || {});
  const vs = getVoiceSettings(companion || {});
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: { 'xi-api-key': config.elevenLabsApiKey, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg' },
    body: JSON.stringify({ text: text.slice(0, 500), model_id: 'eleven_turbo_v2_5', voice_settings: { ...vs, use_speaker_boost: true } })
  });
  if (!response.ok) {
    const err = new Error(await response.text());
    err.status = response.status;
    throw err;
  }
  return Buffer.from(await response.arrayBuffer());
}
