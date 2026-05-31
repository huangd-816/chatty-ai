// Shared, mutable app state. ES modules can't reassign an imported binding,
// so the reassignable globals (companions, currentId) live on this object and
// are mutated as state.companions / state.currentId everywhere.
// Extracted from app.js (Phase 2).

const STORAGE_KEY = 'chatty-ai_companions';

export const state = {
  companions: JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'),
  currentId: null,
};

if (!state.companions) {
  state.companions = [{
    id: '0816', name: '0816', avatar: '👻',
    personalities: ['bff'], vibe: 'bestie',
    language: 'en', gender: 'female',
    created: Date.now(), lastMessage: 'hey! 👋', lastTime: Date.now(),
  }];
  saveCompanions();
}

state.currentId = localStorage.getItem('chatty-ai_current') || state.companions[0].id;

// Saved GIFs for the current companion (reassigned in gifs.js + switchCompanion).
state.savedGifs = JSON.parse(localStorage.getItem(`${state.currentId}_saved_gifs`) || '[]');

export function saveCompanions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.companions));
}

export function getCompanion(id) {
  return state.companions.find(c => c.id === id) || state.companions[0];
}

export function getCurrentCompanion() {
  return getCompanion(state.currentId);
}

// Per-companion cached chat DOM (mutated in place, never reassigned).
export const chatCaches = {};
