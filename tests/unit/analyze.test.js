import { describe, it, expect } from 'vitest';
import { analyzeMessage } from '../../src/services/analyze.service.js';

describe('analyzeMessage', () => {
  it('extracts the user name', () => {
    expect(analyzeMessage('my name is Sam').facts).toContain('name: Sam');
  });
  it('extracts age', () => {
    expect(analyzeMessage("i'm 25 years old").facts).toContain('age: 25');
  });
  it('detects a happy mood', () => {
    expect(analyzeMessage('this is great haha').mood).toBe('happy');
  });
  it('flags sad messages as concerned', () => {
    const a = analyzeMessage('i feel so lonely and sad');
    expect(a.mood).toBe('sad');
    expect(a.sentiment).toBe('concerned');
  });
  it('tags topics', () => {
    expect(analyzeMessage('i have a cat and a dog').topics).toContain('pets');
  });
  it('handles Chinese location facts', () => {
    expect(analyzeMessage('我在新西兰读书').facts).toContain('location: New Zealand');
  });
});
