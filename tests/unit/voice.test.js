import { describe, it, expect } from 'vitest';
import { getVoiceId, getVoiceSettings } from '../../src/services/voice.service.js';
import { ELEVENLABS_VOICES, VOICE_STYLE_IDS } from '../../src/domain/constants.js';

describe('getVoiceId', () => {
  it('uses a named style override when set', () => {
    expect(getVoiceId({ gender: 'male', voiceStyle: 'bold' })).toBe(VOICE_STYLE_IDS.bold.male);
  });
  it('falls back to the personality voice', () => {
    expect(getVoiceId({ gender: 'female', personalities: ['flirty'] })).toBe(ELEVENLABS_VOICES.flirty);
  });
  it('uses the male_ prefix for male personalities', () => {
    expect(getVoiceId({ gender: 'male', personalities: ['hype'] })).toBe(ELEVENLABS_VOICES.male_hype);
  });
  it('defaults to bff when nothing is provided', () => {
    expect(getVoiceId({})).toBe(ELEVENLABS_VOICES.bff);
  });
});

describe('getVoiceSettings', () => {
  it('returns the per-personality settings', () => {
    expect(getVoiceSettings({ personalities: ['chaotic'] }).style).toBe(0.92);
  });
  it('returns defaults for unknown personalities', () => {
    expect(getVoiceSettings({ personalities: ['unknown'] })).toMatchObject({ stability: 0.5 });
  });
});
