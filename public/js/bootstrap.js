// Module bootstrap (Phase 2 — "prove the pattern").
//
// app.js is still a classic script (its functions stay global, so the ~60
// inline onclick handlers keep working untouched). This module loads the
// extracted ES modules FIRST and republishes their exports onto window so the
// classic script can call them as before. Loaded right before app.js; both are
// deferred, so this runs first and window.* is ready when app.js executes.
import * as utils from './utils.js';
import * as gamification from './gamification.js';
import * as gifs from './gifs.js';
import * as voice from './voice.js';
import * as call from './call.js'; // pulls in callface.js -> animeface.js + faces.js
import { FACE_PRESETS } from './faces.js';
import { state, saveCompanions, getCompanion, getCurrentCompanion, chatCaches } from './state.js';

Object.assign(window, utils, gamification, gifs, voice, call, {
  state,
  saveCompanions,
  getCompanion,
  getCurrentCompanion,
  chatCaches,
  FACE_PRESETS,
});
