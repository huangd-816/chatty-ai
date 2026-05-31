import { describe, it, expect } from 'vitest';
import { buildSystemPrompt, buildMemoryContext } from '../../src/services/prompt.service.js';

describe('buildSystemPrompt', () => {
  it('includes the name and personality traits', () => {
    const p = buildSystemPrompt({ name: 'Luna', personalities: ['flirty'], vibe: 'romantic', language: 'en', gender: 'female' });
    expect(p).toContain('"Luna"');
    expect(p).toContain('flirtatious');
  });
  it('adds the imitation block when a dialogue sample is provided', () => {
    const p = buildSystemPrompt({ name: 'X', personalities: ['bff'], dialogueSample: 'yo wassup lol', dialoguePerson: 'Sara' });
    expect(p).toContain('IMITATION MODE');
    expect(p).toContain('Sara');
  });
});

describe('buildMemoryContext', () => {
  it('renders the user name, situation and recent messages', () => {
    const mem = {
      userName: 'Sam', facts: ['location: NZ'], emotions: [], importantMoments: [],
      sharedJokes: [], topics: ['pets'], mood: 'happy', affection: 20, currentSituation: 'busy with finals',
    };
    const ctx = buildMemoryContext(mem, [{ role: 'user', content: 'hi there' }], '[time]');
    expect(ctx).toContain('Sam');
    expect(ctx).toContain('busy with finals');
    expect(ctx).toContain('hi there');
  });
});
