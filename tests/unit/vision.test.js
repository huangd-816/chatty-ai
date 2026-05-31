import { describe, it, expect } from 'vitest';
import { describeGif } from '../../src/services/vision.service.js';

// These assert the SSRF guard never performs a network fetch for disallowed URLs.
describe('describeGif SSRF guard', () => {
  it('returns the upload fallback for data: URLs', async () => {
    const r = await describeGif('data:image/png;base64,AAAA');
    expect(r.description).toBe('an uploaded image');
  });
  it('blocks non-Giphy URLs (no fetch, returns fallback)', async () => {
    const r = await describeGif('http://169.254.169.254/latest/meta-data/');
    expect(r).toMatchObject({ description: 'a funny meme', vibe: 'funny' });
  });
  it('returns a generic fallback for an empty url', async () => {
    const r = await describeGif('');
    expect(r.description).toBe('a meme');
  });
});
