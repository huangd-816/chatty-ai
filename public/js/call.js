// Video call controls + lifecycle. Extracted from app.js (Phase 2).
import { getCurrentCompanion, state } from './state.js';
import { updateCallPortrait, startCallFaceAnimation, stopCallFaceAnimation } from './callface.js';

let videoStream = null;
let callInterval = null;
let callSeconds = 0;
let callTimerInterval = null;
let isMuted = false;
let isCameraOff = true;

function buildCallPhrases() {
  const c = getCurrentCompanion();
  const base = [
    "hey... so good to see you",
    "okay real talk... how are you actually doing?",
    "I was literally just thinking about you",
    "wait... okay I'm back",
    "you look great today honestly",
    "I feel like we haven't talked in forever",
  ];
  if (c.personalities?.includes('flirty') || c.vibe === 'romantic') {
    base.push("okay stop... you're making me nervous", "ngl you're kind of everything rn", "why do I get so happy when you call");
  }
  if (c.personalities?.includes('chaotic')) {
    base.push("okay WAIT I have to tell you something insane", "I cannot be normal about this call lol");
  }
  if (c.personalities?.includes('soft')) {
    base.push("I'm really glad you called... genuinely", "just wanted to say I appreciate you");
  }
  return base;
}

async function speakCallPhrase() {
  if (state.callSpeaking) return;
  const phrases = buildCallPhrases();
  const phrase = phrases[Math.floor(Math.random() * phrases.length)];

  state.callSpeaking = true;
  document.getElementById('callSpeakIndicator')?.classList.add('speaking');
  document.getElementById('callPortrait')?.classList.add('speaking');

  const controller = new AbortController();
  const ttsTimeout = setTimeout(() => controller.abort(), 8000);

  try {
    const companion = getCurrentCompanion();
    const res = await fetch('/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: phrase, companion }),
      signal: controller.signal
    });
    clearTimeout(ttsTimeout);

    if (!res.ok) throw new Error('TTS failed');

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    const stopPortraitSpeak = () => {
      state.callSpeaking = false;
      document.getElementById('callSpeakIndicator')?.classList.remove('speaking');
      document.getElementById('callPortrait')?.classList.remove('speaking');
    };
    audio.onended = () => { stopPortraitSpeak(); URL.revokeObjectURL(url); };
    audio.onerror = () => stopPortraitSpeak();
    audio.play();
  } catch (e) {
    clearTimeout(ttsTimeout);
    state.callSpeaking = false;
    document.getElementById('callSpeakIndicator')?.classList.remove('speaking');
    document.getElementById('callPortrait')?.classList.remove('speaking');
    console.warn('Call voice error:', e);
  }
}

export async function startVideoCall() {
  const c = getCurrentCompanion();
  isCameraOff = true; isMuted = false;
  document.getElementById('callName').textContent = c.name;
  document.getElementById('pipName').textContent = c.name;
  document.getElementById('pipAvatar').textContent = c.avatar;
  document.getElementById('videoStatus').textContent = 'Ringing... 📞';
  updateCallPortrait();
  startCallFaceAnimation();

  setSelfProfilePhoto(true);

  // Non-blocking — never delays call startup
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      videoStream = stream;
      stream.getVideoTracks().forEach(t => t.enabled = false);
      const selfEl = document.querySelector('.video-self-inner');
      const video = document.createElement('video');
      video.srcObject = stream; video.autoplay = true; video.muted = true; video.playsInline = true;
      video.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:10px;opacity:0;';
      selfEl.innerHTML = ''; selfEl.appendChild(video);
    })
    .catch(e => console.warn('No media:', e));

  const camBtn = document.getElementById('camBtn');
  if (camBtn) {
    camBtn.classList.add('vid-active');
    camBtn.querySelector('.vid-icon').innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34"/></svg>`;
    camBtn.querySelector('.vid-label').textContent = 'Camera';
  }

  setTimeout(() => {
    document.getElementById('videoStatus').textContent = 'Connected ✨';
    callSeconds = 0;
    callTimerInterval = setInterval(() => {
      callSeconds++;
      const m = Math.floor(callSeconds/60), s = callSeconds%60;
      const t = `${m}:${s.toString().padStart(2,'0')}`;
      document.getElementById('videoStatus').textContent = t;
      document.getElementById('pipTime').textContent = t;
    }, 1000);
    setTimeout(() => speakCallPhrase(), 600);
    callInterval = setInterval(() => { if (Math.random() > 0.3) speakCallPhrase(); }, 12000 + Math.random()*6000);
  }, 500);
}

export function stopVideoCall() {
  if (videoStream) { videoStream.getTracks().forEach(t => t.stop()); videoStream = null; }
  if (callInterval) { clearInterval(callInterval); callInterval = null; }
  if (callTimerInterval) { clearInterval(callTimerInterval); callTimerInterval = null; }
  window.speechSynthesis.cancel();
  state.callSpeaking = false;
  document.getElementById('callPortrait')?.classList.remove('speaking');
  stopCallFaceAnimation();
  const vbg = document.querySelector('.video-bg');
  vbg?.classList.remove('portrait-mode');
  vbg?.style.removeProperty('--portrait-bg');
  document.querySelector('.video-self-inner').innerHTML = 'You';
  setSelfProfilePhoto(false);
  document.getElementById('videoStatus').textContent = 'Connecting...';
  document.getElementById('callPip').classList.remove('active');
  isCameraOff = false; isMuted = false;
}

export function minimizeCall() {
  document.getElementById('videoScreen').classList.remove('active');
  document.getElementById('callPip').classList.add('active');
}

export function expandCall() {
  document.getElementById('callPip').classList.remove('active');
  document.getElementById('videoScreen').classList.add('active');
}

let isMutedState = false, isCamOff = true;

export function toggleMute(btn) {
  isMutedState = !isMutedState;
  btn.classList.toggle('vid-active', isMutedState);
  btn.querySelector('.vid-icon').innerHTML = isMutedState
    ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`
    : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`;
  btn.querySelector('.vid-label').textContent = isMutedState ? 'Unmute' : 'Mute';
  if (videoStream) videoStream.getAudioTracks().forEach(t => t.enabled = !isMutedState);
}

function setSelfProfilePhoto(visible) {
  const photo = window.getUserPhoto();
  const el = document.getElementById('selfProfilePhoto');
  if (!el) return;
  if (visible && photo) { el.src = photo; el.style.display = 'block'; }
  else { el.style.display = 'none'; }
}

export function toggleCamera(btn) {
  isCamOff = !isCamOff;
  btn.classList.toggle('vid-active', isCamOff);
  btn.querySelector('.vid-icon').innerHTML = isCamOff
    ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34"/></svg>`
    : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`;
  btn.querySelector('.vid-label').textContent = isCamOff ? 'Camera' : 'Hide';
  if (videoStream) {
    videoStream.getVideoTracks().forEach(t => t.enabled = !isCamOff);
    const v = document.querySelector('.video-self-inner video');
    if (v) v.style.opacity = isCamOff ? '0' : '1';
  }
  setSelfProfilePhoto(isCamOff);
}
