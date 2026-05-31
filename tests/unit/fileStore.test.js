import { describe, it, expect } from 'vitest';
import { safeId, userScopedId } from '../../src/store/fileStore.js';

describe('safeId (path-traversal guard)', () => {
  it('accepts valid ids', () => {
    expect(safeId('ai_1779798629531')).toBe('ai_1779798629531');
    expect(safeId('0816')).toBe('0816');
  });
  it('defaults empty/null to 0816', () => {
    expect(safeId('')).toBe('0816');
    expect(safeId(null)).toBe('0816');
  });
  it('rejects traversal / separators', () => {
    expect(() => safeId('../../etc/passwd')).toThrow();
    expect(() => safeId('a/b')).toThrow();
    expect(() => safeId('a.b')).toThrow();
    expect(() => safeId('foo bar')).toThrow();
  });
});

describe('userScopedId (per-user isolation)', () => {
  it('composes user + companion', () => {
    expect(userScopedId('u1', 'c1')).toBe('u1__c1');
  });
  it('defaults companion to 0816', () => {
    expect(userScopedId('u1')).toBe('u1__0816');
  });
  it('rejects a malicious companion id', () => {
    expect(() => userScopedId('u1', '../secret')).toThrow();
  });
  it('rejects a malicious user id', () => {
    expect(() => userScopedId('../../x', 'c1')).toThrow();
  });
});
