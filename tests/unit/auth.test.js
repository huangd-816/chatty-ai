import { describe, it, expect } from 'vitest';
import { registerUser, authenticate } from '../../src/services/auth.service.js';

const uniq = (p) => `${p}_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;

describe('auth service', () => {
  it('registers a user and returns id + username', () => {
    const name = uniq('alice');
    const u = registerUser(name, 'password123');
    expect(u.username).toBe(name);
    expect(u.id).toMatch(/^[a-f0-9]+$/);
  });
  it('authenticates with the correct password', () => {
    const name = uniq('carol');
    registerUser(name, 'password123');
    expect(authenticate(name, 'password123')).toMatchObject({ username: name });
  });
  it('rejects a wrong password', () => {
    const name = uniq('dave');
    registerUser(name, 'password123');
    expect(authenticate(name, 'wrong-password')).toBeNull();
  });
  it('rejects an unknown user', () => {
    expect(authenticate(uniq('ghost'), 'whatever123')).toBeNull();
  });
  it('rejects short passwords', () => {
    expect(() => registerUser(uniq('bob'), 'short')).toThrow();
  });
  it('rejects invalid usernames', () => {
    expect(() => registerUser('has space', 'password123')).toThrow();
  });
  it('rejects duplicate usernames', () => {
    const name = uniq('dup');
    registerUser(name, 'password123');
    expect(() => registerUser(name, 'password123')).toThrow();
  });
});
