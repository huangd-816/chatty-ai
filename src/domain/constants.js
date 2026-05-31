// Static lookup tables for voice, personality, language, and reactions.
// Moved verbatim from the original server.js — single source of truth.

export const ELEVENLABS_VOICES = {
  soft:'EXAVITQu4vr4xnSDxMaL', flirty:'cgSgspJ2msm6clMCkdW9', hype:'jBpfuIE2acCO8z3wKNLl',
  chaotic:'jBpfuIE2acCO8z3wKNLl', bff:'EXAVITQu4vr4xnSDxMaL', deep:'pFZP5JQG7iQjIQuC4Bku',
  sarcastic:'cgSgspJ2msm6clMCkdW9', cool:'pFZP5JQG7iQjIQuC4Bku',
  male_soft:'TxGEqnHWrfWFTfGW9XjX', male_flirty:'VR6AewLTigWG4xSOukaG', male_hype:'pNInz6obpgDQGcFmaJgB',
  male_chaotic:'pNInz6obpgDQGcFmaJgB', male_bff:'TxGEqnHWrfWFTfGW9XjX', male_deep:'ErXwobaYiN019PkySvjV',
  male_sarcastic:'VR6AewLTigWG4xSOukaG', male_cool:'ErXwobaYiN019PkySvjV',
};

// Named voice style overrides (selected in create/edit modal)
export const VOICE_STYLE_IDS = {
  warm:    { female:'EXAVITQu4vr4xnSDxMaL', male:'TxGEqnHWrfWFTfGW9XjX' },
  playful: { female:'cgSgspJ2msm6clMCkdW9', male:'VR6AewLTigWG4xSOukaG' },
  bold:    { female:'jBpfuIE2acCO8z3wKNLl', male:'pNInz6obpgDQGcFmaJgB' },
  deep:    { female:'pFZP5JQG7iQjIQuC4Bku', male:'ErXwobaYiN019PkySvjV' },
};

// Per-personality speaking style (expressiveness, stability)
export const PERSONALITY_TTS_SETTINGS = {
  bff:       { stability:0.45, similarity_boost:0.80, style:0.60 },
  flirty:    { stability:0.38, similarity_boost:0.85, style:0.72 },
  soft:      { stability:0.65, similarity_boost:0.80, style:0.28 },
  deep:      { stability:0.70, similarity_boost:0.75, style:0.38 },
  sarcastic: { stability:0.33, similarity_boost:0.80, style:0.78 },
  chaotic:   { stability:0.22, similarity_boost:0.75, style:0.92 },
  cool:      { stability:0.60, similarity_boost:0.80, style:0.48 },
  hype:      { stability:0.28, similarity_boost:0.80, style:0.88 },
};

export const PERSONALITY_TRAITS = {
  bff:'ride-or-die best friend energy, gen z, casual warmth',
  flirty:'playfully flirtatious, charming, subtle compliments',
  deep:'philosophical, meaningful questions, beyond small talk',
  sarcastic:'sharp witty humor, loving roasts, dry comebacks',
  soft:'gentle, nurturing, validate feelings, make them feel safe',
  chaotic:'unhinged humor, wild takes, absurd but loveable',
  cool:'lowkey, effortlessly chill, real talk only',
  hype:'biggest cheerleader, hype them up, celebrate everything'
};

export const VIBE_TRAITS = {
  bestie:'platonic best friend, supportive, fun',
  romantic:'warm romantic undertones, affectionate, makes them feel special',
  mysterious:'intriguing, unpredictable, leave them wanting more',
  mentor:'wise, guide them, share perspective, celebrate growth'
};

export const LANG_INSTRUCTIONS = {
  en:'Respond in English',
  zh:'全程用中文回复，用年轻人的网络用语',
  es:'Responde en español con slang juvenil',
  ja:'日本語で返信してください、若者言葉を使って',
  ko:'한국어로 대답하세요',
  fr:'Réponds en français'
};

export const GIF_STYLE = {
  chaotic:'surreal absurd meme', soft:'wholesome cute', hype:'celebration excited',
  sarcastic:'eye roll reaction', flirty:'wink smile charming', cool:'smooth casual',
  deep:'thinking contemplating', bff:'funny reaction meme'
};

// Translation target-language display names
export const LANG_NAMES = { en:'English', zh:'Chinese', es:'Spanish', ja:'Japanese', ko:'Korean', fr:'French' };

// Emoji reaction pools by detected mood
export const MOOD_POOLS = {
  happy:['❤️','🔥','😍','🎉','✨','🥰','👏'], sad:['🫂','💙','😢','🥺','🫶'],
  stressed:['💀','😩','🫠','💪','🫶'], curious:['👀','🤔','😮','🤯'],
  passionate:['🔥','💥','😤','💯'], neutral:['😊','👍','✨','🙌','😄','🤙']
};
