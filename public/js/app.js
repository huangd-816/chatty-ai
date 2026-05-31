console.log("chatty-ai v7.0 - Multi-Companion");

// State (state.companions, state.currentId), helpers (saveCompanions, getCompanion,
// getCurrentCompanion) and chatCaches now live in state.js, exposed on window
// by bootstrap.js. Referenced here as state.companions / state.currentId.

// ─── MODAL STATE ──────────────────────────────
let modalAvatar = '👻';
let modalVibe = 'bestie';
let modalPersonalities = ['bff'];
let modalLang = 'en';
let modalGender = 'female';
let modalVoiceStyle = 'auto';
let modalFacePreset = 'auto';
let modalFaceName = '';
let modalFaceCustomUrl = '';
let modalCatchphrase = '';
let modalDialogueSample = '';
let modalDialoguePerson = '';
let editingId = null;

function selectVoice(btn) {
  document.querySelectorAll('.voice-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  modalVoiceStyle = btn.dataset.voice;
}

function renderFacePresets() {
  const grid = document.getElementById('facePresetGrid');
  if (!grid) return;

  // Character presets (charType set) are search-only — show only when selected
  let visible = FACE_PRESETS.filter(p => {
    if (p.charType) return p.id === modalFacePreset;
    return p.gender === 'any' || p.gender === modalGender;
  });

  // Always keep 'auto' first, then language-matches, then others
  visible.sort((a, b) => {
    if (a.id === 'auto') return -1;
    if (b.id === 'auto') return 1;
    const aMatch = a.langs?.includes(modalLang) ? 0 : 1;
    const bMatch = b.langs?.includes(modalLang) ? 0 : 1;
    return aMatch - bMatch;
  });

  // Custom name entry: show a pravatar seeded by the typed name
  let customHtml = '';
  if (modalFaceName) {
    const url = `https://i.pravatar.cc/400?u=${encodeURIComponent(modalFaceName.toLowerCase())}`;
    modalFaceCustomUrl = url;
    customHtml = `
      <button class="face-preset-btn ${modalFacePreset === 'custom' ? 'selected' : ''}"
              data-face="custom" onclick="selectFacePreset(this)">
        <img class="face-preset-thumb" src="${url}" alt="${modalFaceName}" loading="lazy">
        <span class="face-preset-name">${modalFaceName}</span>
        <span class="face-preset-vibe">Custom</span>
      </button>`;
  }

  // "Add" upload button — always shown in the grid right after AI Auto
  const addBtn = `
    <button class="face-preset-btn face-preset-upload-btn" onclick="document.getElementById('facePresetUploadInput').click()">
      <div class="face-preset-thumb face-preset-add">＋</div>
      <span class="face-preset-name">Add</span>
      <span class="face-preset-vibe">Upload</span>
    </button>
    <input type="file" id="facePresetUploadInput" accept="image/*" style="display:none" onchange="handleFaceUpload(this)">`;

  // "Profile" button — shown when the user has their own profile photo set
  const userPhoto = getUserPhoto();
  const profileBtn = userPhoto ? `
    <button class="face-preset-btn ${modalFacePreset === 'userprofile' ? 'selected' : ''}"
            data-face="userprofile" onclick="selectFacePresetProfile(this,'${userPhoto.replace(/'/g,"\\'")}')">
      <img class="face-preset-thumb" src="${userPhoto}" alt="Profile" loading="lazy">
      <span class="face-preset-name">Profile</span>
      <span class="face-preset-vibe">Your photo</span>
    </button>` : '';

  const charBadge = { anime:'⚔️', game:'🎮', fiction:'📖' };
  grid.innerHTML = visible.map(p => `
    <button class="face-preset-btn ${modalFacePreset === p.id ? 'selected' : ''}"
            data-face="${p.id}" onclick="selectFacePreset(this)">
      ${p.charType ? `<span class="face-char-badge face-char-${p.charType}">${charBadge[p.charType]}</span>` : ''}
      ${p.url
        ? `<img class="face-preset-thumb" src="${p.url}" alt="${p.name}" loading="lazy">`
        : `<div class="face-preset-thumb face-preset-auto">✨</div>`}
      <span class="face-preset-name">${p.name}</span>
      <span class="face-preset-vibe">${p.vibe}</span>
    </button>`).join('') + customHtml;

  // Insert Add and Profile right after the AI Auto button (first child)
  const autoBtn = grid.querySelector('[data-face="auto"]');
  if (autoBtn) {
    const temp = document.createElement('div');
    temp.innerHTML = profileBtn + addBtn;
    autoBtn.after(...Array.from(temp.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())));
  }
}

const SMART_KEYWORDS = {
  region: {
    western:    ['western','european','american','british','french','italian','blonde','white'],
    asian:      ['asian','korean','japanese','chinese','kpop','k-pop','jpop','j-pop','cpop','c-pop','idol','anime','east asian'],
    southasian: ['indian','south asian','desi','bollywood','hindi','pakistani'],
    black:      ['black','african','dark skin','melanin','caribbean'],
    latino:     ['latin','hispanic','mexican','brazilian','colombian','spanish'],
  },
  style: {
    glam:    ['glam','glamorous','celebrity','gorgeous','luxury','fashion','chic','elegant','classy','model','runway','star'],
    bold:    ['bold','fierce','edgy','rock','punk','badass','powerful','strong','confident','rebel','action'],
    soft:    ['soft','cute','kawaii','sweet','gentle','innocent','dreamy','romantic','pastel'],
    natural: ['natural','casual','everyday','simple','clean','fresh','real','approachable'],
  },
  // Character name aliases for smart matching
  charAlias: {
    ca_zero2:    ['zero two','002','darling franxx','darling'],
    ca_rem:      ['rem','rezero','re zero','maid'],
    ca_mikasa:   ['mikasa','attack titan','aot','ackerman'],
    ca_megumin:  ['megumin','explosion','konosuba','crimson'],
    ca_aqua:     ['aqua','goddess','konosuba'],
    ca_asuna:    ['asuna','sao','sword art','kirito'],
    ca_nezuko:   ['nezuko','demon slayer','kimetsu'],
    ca_2b:       ['2b','nier','automata','android warrior'],
    ca_jinx:     ['jinx','arcane','lol','league of legends'],
    ca_hutao:    ['hu tao','hutao','genshin','funeral'],
    ca_ahri:     ['ahri','nine tail','ninetail','fox girl','lol'],
    ca_hermione: ['hermione','granger','harry potter','hogwarts'],
    ca_arya:     ['arya','stark','game of thrones','got','assassin'],
    ca_gojo:     ['gojo','satoru','jjk','jujutsu kaisen','six eyes','infinity'],
    ca_levi:     ['levi','captain levi','aot','attack titan','survey corps'],
    ca_kakashi:  ['kakashi','copy ninja','naruto','hatake','sharingan'],
    ca_deku:     ['deku','midoriya','mha','my hero academia','plus ultra'],
    ca_vegeta:   ['vegeta','dbz','dragon ball','saiyan','prince vegeta'],
    ca_nanami:   ['nanami','kento','jjk','salaryman'],
    ca_zoro:     ['zoro','roronoa','one piece','three sword','swordsman'],
    ca_itachi:   ['itachi','uchiha','naruto','crow','akatsuki'],
    ca_luffy:    ['luffy','one piece','pirate king','straw hat'],
    ca_geralt:   ['geralt','witcher','white wolf','rivia'],
    ca_cloud:    ['cloud','strife','ff7','final fantasy','soldier'],
    ca_kazuha:   ['kazuha','genshin','anemo','samurai poet'],
    ca_sherlock: ['sherlock','holmes','detective','watson','baker street'],
    ca_ironman:  ['iron man','tony stark','stark','avenger'],
    ca_batman:   ['batman','bruce wayne','dark knight','gotham'],
    ca_natsume:  ['natsume','takashi','book of friends','natsume yuujinchou','spirit'],
    ca_nyanko:   ['nyanko','nyanko sensei','madara','sensei cat','lucky cat spirit'],
    ca_natori:   ['natori','shuichi','actor exorcist','natsume exorcist'],
    ca_reiko:    ['reiko','reiko natsume','grandmother','book creator','lonely spirit'],
    ca_tanuma:   ['tanuma','kaname','natsume friend','empath'],
    ca_bocchi:   ['bocchi','hitori','gotoh','shy guitarist','kessoku','btr','lonely rock'],
    ca_nijika:   ['nijika','ijichi','drummer','kessoku band'],
    ca_ryo:      ['ryo','yamada','bass','bassist','kessoku'],
    ca_kita:     ['kita','ikuyo','vocalist','kessoku frontwoman'],
    ca_sparrow:  ['jack sparrow','sparrow','captain jack','pirates caribbean','rum'],
    ca_joker_dk: ['joker','dark knight','heath ledger','why so serious','chaos agent'],
    ca_bond:     ['james bond','bond','007','spy','licensed to kill'],
    ca_hannibal: ['hannibal','lecter','hannibal lecter','silence lambs','cannibal'],
    ca_tyler:    ['tyler durden','tyler','fight club','project mayhem','soap'],
    ca_walter:   ['walter white','heisenberg','breaking bad','say my name','chemistry'],
    ca_wednesday:['wednesday','wednesday addams','addams family','pale darkness','braids'],
    ca_eleven:   ['eleven','el','stranger things','eggo','psychic','demogorgon'],
    ca_light:    ['light yagami','light','kira','death note','god new world'],
    ca_l:        ['l lawliet','l detective','ryuzaki','death note','sweets'],
    ca_sebastian:['sebastian','michaelis','butler','black butler','kuroshitsuji'],
    ca_dazai:    ['dazai','dazai osamu','bsd','bungo stray dogs','bandages','suicidal'],
    ca_chuuya:   ['chuuya','nakahara','bsd','port mafia','calamity','hat'],
    ca_sukuna:   ['sukuna','ryomen','king of curses','jjk','jujutsu','tattoos'],
    ca_megumi:   ['megumi','fushiguro','ten shadows','jjk','shikigami'],
    ca_bakugo:   ['bakugo','kacchan','katsuki','explosion','mha','my hero','baku'],
    ca_tamaki:   ['tamaki','suoh','ouran','host club','king','princely'],
    ca_kyoya:    ['kyoya','ootori','shadow king','ouran','host club','glasses'],
    ca_makima:   ['makima','control devil','chainsaw man','csm'],
    ca_power:    ['power','blood devil','fiend','chainsaw man','csm'],
    ca_yor:      ['yor','yor forger','thorn princess','spy family','assassin mom'],
    ca_loid:     ['loid','loid forger','twilight','spy family','phantom'],
    ca_dio:      ['dio','dio brando','za warudo','jojo','vampire','time stop'],
    ca_zenitsu:  ['zenitsu','agatsuma','thunder','demon slayer','coward','yellow'],
    ca_toga:     ['toga','himiko','toga himiko','mha','villain','blood quirk'],
  },
};

function smartFaceMatch(query) {
  const q = query.toLowerCase();
  // Check character alias match first
  for (const [id, aliases] of Object.entries(SMART_KEYWORDS.charAlias || {})) {
    if (aliases.some(a => q.includes(a) || a.includes(q))) {
      const p = FACE_PRESETS.find(fp => fp.id === id);
      if (p && (p.gender === 'any' || p.gender === modalGender)) return { type:'preset', id };
    }
  }
  // Check exact or partial name match in library
  const nameMatch = FACE_PRESETS.find(p =>
    p.id !== 'auto' && (p.gender === 'any' || p.gender === modalGender) &&
    p.name.toLowerCase().includes(q)
  );
  if (nameMatch) return { type:'preset', id:nameMatch.id };

  // Check vibe keyword match
  const vibeMatch = FACE_PRESETS.find(p =>
    p.id !== 'auto' && (p.gender === 'any' || p.gender === modalGender) &&
    p.vibe.toLowerCase().split(/\s+/).some(w => q.includes(w) && w.length > 3)
  );
  if (vibeMatch) return { type:'preset', id:vibeMatch.id };

  // Score region + style from keywords
  let region = null, style = null;
  for (const [r, kws] of Object.entries(SMART_KEYWORDS.region)) {
    if (kws.some(kw => q.includes(kw))) { region = r; break; }
  }
  for (const [s, kws] of Object.entries(SMART_KEYWORDS.style)) {
    if (kws.some(kw => q.includes(kw))) { style = s; break; }
  }

  if (region || style) return { type:'studio', region: region||'western', style: style||'natural' };
  return null;
}

function onFaceNameInput(val) {
  modalFaceName = val.trim();
  if (!modalFaceName) {
    if (modalFacePreset === 'custom') modalFacePreset = 'auto';
    renderFacePresets();
    return;
  }

  // Try smart match if 3+ chars
  if (modalFaceName.length >= 3) {
    const match = smartFaceMatch(modalFaceName);
    if (match?.type === 'preset') {
      modalFacePreset = match.id;
      modalFaceName = '';
      renderFacePresets();
      return;
    }
    if (match?.type === 'studio') {
      faceStudioRegion = match.region;
      faceStudioStyle = match.style;
      modalFacePreset = 'custom';
      modalFaceCustomUrl = getFaceStudioUrl();
      modalFaceName = '';
      renderFacePresets();
      return;
    }
  }

  // Fallback: generate face from typed name as seed
  modalFacePreset = 'custom';
  const url = `https://i.pravatar.cc/400?u=${encodeURIComponent(modalFaceName.toLowerCase())}`;
  modalFaceCustomUrl = url;
  renderFacePresets();
}

function handleDialogueUpload(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 500000) { showToast('File too large — max 500KB'); input.value = ''; return; }
  const reader = new FileReader();
  reader.onload = e => {
    const raw = e.target.result.trim();
    modalDialogueSample = raw.slice(0, 4000);
    const lines = raw.split('\n').filter(l => l.trim()).length;
    const status = document.getElementById('dialogueStatus');
    if (status) {
      status.style.display = 'flex';
      const t = status.querySelector('.dialogue-status-text');
      if (t) t.textContent = `✅ ${lines} lines loaded — style ready`;
    }
    input.value = '';
    showToast('Chat style uploaded ✨');
  };
  reader.readAsText(file);
}

function clearDialogueSample() {
  modalDialogueSample = '';
  const status = document.getElementById('dialogueStatus');
  if (status) status.style.display = 'none';
  showToast('Style cleared');
}

function handleFaceUpload(input) {
  const file = input.files[0];
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxH = 500, ratio = Math.min(maxH / img.height, maxH / img.width, 1);
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      modalFacePreset = 'custom';
      modalFaceCustomUrl = canvas.toDataURL('image/jpeg', 0.85);
      modalFaceName = '';
      const inp = document.getElementById('faceNameInput');
      if (inp) inp.value = '';
      renderFacePresets();
      showToast('Photo uploaded ✨');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// ─── FACE STUDIO ──────────────────────────────
let faceStudioRegion = 'western';
let faceStudioStyle = 'natural';

const FACE_GEN = {
  western:     { natural:{f:'claire-western-nat',    m:'oliver-western-nat'},    glam:{f:'victoria-western-glam',  m:'gabriel-western-glam'}, bold:{f:'scarlett-western-bold',  m:'jake-western-bold'},  soft:{f:'rosie-western-soft',   m:'noah-western-soft'}   },
  asian:       { natural:{f:'yuki-asian-nat',        m:'kenji-asian-nat'},        glam:{f:'meiling-asian-glam',     m:'jun-asian-glam'},        bold:{f:'rina-asian-bold',        m:'ryu-asian-bold'},      soft:{f:'hana-asian-soft',     m:'ryo-asian-soft'}      },
  southasian:  { natural:{f:'priya-sa-nat',          m:'arjun-sa-nat'},           glam:{f:'ananya-sa-glam',         m:'rahul-sa-glam'},          bold:{f:'divya-sa-bold',          m:'vikram-sa-bold'},      soft:{f:'nisha-sa-soft',       m:'karan-sa-soft'}       },
  black:       { natural:{f:'amara-black-nat',       m:'kofi-black-nat'},         glam:{f:'zara-black-glam',        m:'kion-black-glam'},         bold:{f:'aisha-black-bold',       m:'darius-black-bold'},   soft:{f:'nadia-black-soft',    m:'elijah-black-soft'}   },
  latino:      { natural:{f:'lucia-latino-nat',      m:'carlos-latino-nat'},      glam:{f:'valentina-latino-glam',  m:'alejandro-latino-glam'},   bold:{f:'camila-latino-bold',     m:'mateo-latino-bold'},   soft:{f:'isabela-latino-soft', m:'daniel-latino-soft'}  },
};

function getFaceStudioUrl() {
  const g = FACE_GEN[faceStudioRegion]?.[faceStudioStyle];
  if (!g) return '';
  const seed = modalGender === 'male' ? g.m : g.f;
  return `https://i.pravatar.cc/400?u=${encodeURIComponent(seed)}`;
}

function updateFaceStudioPreview() {
  const img = document.getElementById('faceStudioPreview');
  if (img) { img.src = ''; img.src = getFaceStudioUrl(); }
}

function setFaceRegion(btn) {
  document.querySelectorAll('.fs-region-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  faceStudioRegion = btn.dataset.region;
  updateFaceStudioPreview();
}

function setFaceStudioStyle(btn) {
  document.querySelectorAll('.fs-style-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  faceStudioStyle = btn.dataset.fstyle;
  updateFaceStudioPreview();
}

function toggleFaceStudio() {
  const s = document.getElementById('faceStudio');
  const open = s.classList.toggle('open');
  if (open) {
    faceStudioRegion = 'western'; faceStudioStyle = 'natural';
    document.querySelectorAll('.fs-region-btn').forEach((b,i) => b.classList.toggle('selected', i===0));
    document.querySelectorAll('.fs-style-btn').forEach((b,i) => b.classList.toggle('selected', i===0));
    updateFaceStudioPreview();
  }
}

function applyFaceStudio() {
  modalFacePreset = 'custom';
  modalFaceCustomUrl = getFaceStudioUrl();
  modalFaceName = '';
  const inp = document.getElementById('faceNameInput');
  if (inp) inp.value = '';
  document.getElementById('faceStudio')?.classList.remove('open');
  renderFacePresets();
}

function selectFacePreset(btn) {
  modalFacePreset = btn.dataset.face;
  document.querySelectorAll('.face-preset-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  const preset = FACE_PRESETS.find(p => p.id === modalFacePreset);
  modalCatchphrase = preset?.catchphrase || '';
}

function selectFacePresetProfile(btn, photoUrl) {
  modalFacePreset = 'custom';
  modalFaceCustomUrl = photoUrl;
  modalFaceName = '';
  document.querySelectorAll('.face-preset-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function openCreateModal() {
  editingId = null;
  modalVoiceStyle = 'auto';
  modalFacePreset = 'auto';
  modalFaceName = '';
  modalFaceCustomUrl = '';
  modalCatchphrase = '';
  modalDialogueSample = '';
  modalDialoguePerson = '';
  document.getElementById('modalTitle').textContent = 'New AI Companion';
  document.getElementById('companionNameInput').value = '';
  document.querySelectorAll('.avatar-opt').forEach(e => e.classList.remove('selected'));
  document.querySelector('.avatar-opt').classList.add('selected');
  modalAvatar = '👻'; modalVibe = 'bestie'; modalPersonalities = ['bff'];
  modalLang = 'en'; modalGender = 'female';
  document.querySelectorAll('.vibe-btn')[0].classList.add('selected');
  document.querySelectorAll('.pers-btn').forEach(b => b.classList.remove('selected'));
  document.querySelector('[data-p="bff"]').classList.add('selected');
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('selected'));
  document.querySelector('[data-lang="en"]').classList.add('selected');
  document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('selected'));
  document.querySelector('[data-gender="female"]').classList.add('selected');
  goStep(1);
  document.getElementById('createModal').classList.add('active');
}

function editCurrentCompanion() {
  const c = getCurrentCompanion();
  editingId = c.id;
  document.getElementById('modalTitle').textContent = 'Edit ' + c.name;
  document.getElementById('companionNameInput').value = c.name;
  modalAvatar = c.avatar; modalVibe = c.vibe || 'bestie';
  modalPersonalities = [...(c.personalities || ['bff'])];
  modalLang = c.language || 'en'; modalGender = c.gender || 'female';

  document.querySelectorAll('.avatar-opt').forEach(e => {
    e.classList.toggle('selected', e.textContent === c.avatar);
  });
  document.querySelectorAll('.vibe-btn').forEach(b => {
    b.classList.toggle('selected', b.dataset.vibe === c.vibe);
  });
  document.querySelectorAll('.pers-btn').forEach(b => {
    b.classList.toggle('selected', c.personalities?.includes(b.dataset.p));
  });
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('selected', b.dataset.lang === c.language);
  });
  document.querySelectorAll('.gender-btn').forEach(b => {
    b.classList.toggle('selected', b.dataset.gender === c.gender);
  });
  modalVoiceStyle = c.voiceStyle || 'auto';
  document.querySelectorAll('.voice-btn').forEach(b => {
    b.classList.toggle('selected', b.dataset.voice === modalVoiceStyle);
  });
  modalFacePreset = c.facePreset || 'auto';
  modalFaceName = c.facePreset === 'custom' ? (c.faceName || '') : '';
  modalFaceCustomUrl = c.faceCustomUrl || '';
  modalCatchphrase = c.catchphrase || '';
  modalDialogueSample = c.dialogueSample || '';
  modalDialoguePerson = c.dialoguePerson || '';
  const dpInp = document.getElementById('dialoguePersonInput');
  if (dpInp) dpInp.value = modalDialoguePerson;
  const dStatus = document.getElementById('dialogueStatus');
  if (dStatus) {
    if (modalDialogueSample) {
      dStatus.style.display = 'flex';
      const t = dStatus.querySelector('.dialogue-status-text');
      if (t) t.textContent = `✅ Style loaded (${modalDialogueSample.length} chars)`;
    } else {
      dStatus.style.display = 'none';
    }
  }
  goStep(1);
  document.getElementById('createModal').classList.add('active');
  closeScreen('profile');
}

function closeCreateModal() {
  document.getElementById('createModal').classList.remove('active');
}

function goStep(n) {
  document.querySelectorAll('.modal-step').forEach((s, i) => {
    s.classList.toggle('active', i + 1 === n);
  });
  if (n === 3) renderFacePresets();
}

function selectAvatar(el) {
  document.querySelectorAll('.avatar-opt').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
  modalAvatar = el.textContent;
}

function selectVibe(btn) {
  document.querySelectorAll('.vibe-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  modalVibe = btn.dataset.vibe;
}

function togglePersonality(btn) {
  const p = btn.dataset.p;
  if (btn.classList.contains('selected')) {
    if (modalPersonalities.length > 1) {
      btn.classList.remove('selected');
      modalPersonalities = modalPersonalities.filter(x => x !== p);
    }
  } else {
    if (modalPersonalities.length < 4) {
      btn.classList.add('selected');
      modalPersonalities.push(p);
    } else {
      showToast('Max 4 personalities!');
    }
  }
}

function selectLang(btn) {
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  modalLang = btn.dataset.lang;
  if (document.getElementById('facePresetGrid')) renderFacePresets();
}

function selectGender(btn) {
  document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  modalGender = btn.dataset.gender;
  modalFacePreset = 'auto';
  modalFaceName = '';
  modalFaceCustomUrl = '';
  const inp = document.getElementById('faceNameInput');
  if (inp) inp.value = '';
  renderFacePresets();
}

function createCompanion() {
  const name = document.getElementById('companionNameInput').value.trim() || 'AI';
  if (editingId) {
    const c = getCompanion(editingId);
    c.name = name; c.avatar = modalAvatar; c.vibe = modalVibe;
    c.personalities = modalPersonalities; c.language = modalLang; c.gender = modalGender;
    c.voiceStyle = modalVoiceStyle; c.facePreset = modalFacePreset;
    c.faceName = modalFaceName; c.faceCustomUrl = modalFacePreset === 'custom' ? modalFaceCustomUrl : '';
    c.catchphrase = modalCatchphrase;
    c.dialogueSample = modalDialogueSample;
    c.dialoguePerson = modalDialoguePerson;
    saveCompanions();
    renderSidebar();
    switchCompanion(editingId);
    closeCreateModal();
    showToast('Updated ' + name + ' ✨');
  } else {
    const id = 'ai_' + Date.now();
    state.companions.push({
      id, name, avatar: modalAvatar, personalities: modalPersonalities,
      vibe: modalVibe, language: modalLang, gender: modalGender,
      voiceStyle: modalVoiceStyle, facePreset: modalFacePreset,
      faceName: modalFaceName, faceCustomUrl: modalFacePreset === 'custom' ? modalFaceCustomUrl : '',
      catchphrase: modalCatchphrase,
      dialogueSample: modalDialogueSample,
      dialoguePerson: modalDialoguePerson,
      created: Date.now(), lastMessage: '', lastTime: Date.now()
    });
    saveCompanions();
    renderSidebar();
    switchCompanion(id);
    closeCreateModal();
    showToast('Created ' + name + ' ✨');
  }
}

function deleteCurrentCompanion() {
  if (state.companions.length <= 1) { showToast("Can't delete last AI!"); return; }
  if (!confirm('Delete this AI? All memory will be lost.')) return;
  state.companions = state.companions.filter(c => c.id !== state.currentId);
  saveCompanions();
  renderSidebar();
  switchCompanion(state.companions[0].id);
  closeScreen('profile');
}

// ─── SIDEBAR ──────────────────────────────────
function renderSidebar(filter = '') {
  const list = document.getElementById('companionsList');
  list.innerHTML = '';
  const filtered = state.companions.filter(c =>
    c.name.toLowerCase().includes(filter.toLowerCase())
  ).sort((a, b) => b.lastTime - a.lastTime);

  filtered.forEach(c => {
    const item = document.createElement('div');
    item.className = 'companion-item' + (c.id === state.currentId ? ' active' : '');
    item.onclick = () => switchCompanion(c.id);
    const time = c.lastTime ? formatTime(c.lastTime) : '';
    const personalities = (c.personalities || []).slice(0, 2).join(', ');
    const mood = c.mood || 'happy';
    const moodColor = MOOD_COLORS?.[mood] || '#0084FF';
    const streak = getStreak(c.id);
    const avatarInner = c.customPhoto
      ? `<img src="${c.customPhoto}" class="companion-photo-img" alt="${c.name}">`
      : c.avatar;
    item.innerHTML = `
      <div class="companion-avatar" style="box-shadow:0 0 0 2px ${moodColor},0 0 8px ${moodColor}44">${avatarInner}</div>
      <div class="companion-info">
        <div class="companion-row">
          <span class="companion-name">${c.name}</span>
          <span class="companion-time">${time}${streak > 1 ? `<span class="streak-badge">🔥${streak}</span>` : ''}</span>
        </div>
        <div class="companion-preview">${c.lastMessage || personalities || 'Say hi!'}</div>
      </div>`;
    list.appendChild(item);
  });
}

function filterCompanions(val) { renderSidebar(val); }

// formatTime -> utils.js, chatCaches -> state.js (both on window via bootstrap)

function switchCompanion(id) {
  // Save current chat DOM
  if (state.currentId) chatCaches[state.currentId] = document.getElementById('chat').innerHTML;

  state.currentId = id;
  localStorage.setItem('chatty-ai_current', id);
  state.savedGifs = JSON.parse(localStorage.getItem(`${id}_saved_gifs`) || '[]');

  const c = getCompanion(id);

  // Update topbar
  document.getElementById('topbarEmoji').textContent = c.avatar;
  document.getElementById('topbarName').textContent = c.name;
  document.getElementById('topbarAvatar').style.background =
    `linear-gradient(135deg, ${avatarColor(c.avatar)} 0%, #0055cc 100%)`;

  // Restore from memory cache or localStorage
  if (chatCaches[id]) {
    document.getElementById('chat').innerHTML = chatCaches[id];
  } else {
    document.getElementById('chat').innerHTML = '';
    const stored = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) || '{}');
    if (stored[id]?.length) {
      loadChatFromStorage(id);
    } else {
      loadServerHistory(id);
    }
  }

  // Apply per-companion theme, mood ring, XP, photos
  applyCompanionTheme(id);
  updateStatusRing(c.mood || 'happy');
  _refreshXpDisplay(id);
  _applyCompanionPhotos(c);

  // Match voice recognition language to companion (recognition lives in voice.js)
  if (window.recognition) {
    const langMap = { zh:'zh-CN', ja:'ja-JP', ko:'ko-KR', es:'es-ES', fr:'fr-FR' };
    window.recognition.lang = langMap[c.language] || 'en-US';
  }

  // Update sidebar active state
  renderSidebar(document.querySelector('.sidebar-search')?.value || '');

  // On mobile, show chat panel
  document.getElementById('sidebar').classList.remove('sidebar-active');
  document.getElementById('chatPanel').classList.add('panel-active');

  scrollToBottom();
}

// avatarColor -> utils.js (on window via bootstrap)

function showSidebar() {
  document.getElementById('sidebar').classList.add('sidebar-active');
  document.getElementById('chatPanel').classList.remove('panel-active');
}

// ─── SCREENS ──────────────────────────────────
function openScreen(name) {
  document.getElementById(name + 'Screen').classList.add('active');
  if (name === 'video') startVideoCall();
  if (name === 'profile') {
    const c = getCurrentCompanion();
    document.getElementById('profileAvatarBig').textContent = c.avatar;
    document.getElementById('profileNameBig').textContent = c.name;
    const tags = document.getElementById('profileTags');
    tags.innerHTML = '';
    (c.personalities || []).forEach(p => {
      const tag = document.createElement('span');
      tag.className = 'profile-tag';
      tag.textContent = personalityLabel(p);
      tags.appendChild(tag);
    });
    const vibeTag = document.createElement('span');
    vibeTag.className = 'profile-tag profile-tag-vibe';
    vibeTag.textContent = vibeLabel(c.vibe);
    tags.appendChild(vibeTag);
    const langTag = document.createElement('span');
    langTag.className = 'profile-tag profile-tag-lang';
    langTag.textContent = langLabel(c.language);
    tags.appendChild(langTag);
    updateProfileStats();
    renderSavedGifs();
    _refreshXpDisplay(c.id);
    applyCompanionTheme(c.id);
    _applyCompanionPhotos(c);
  }
}

function closeScreen(name) {
  document.getElementById(name + 'Screen').classList.remove('active');
  if (name === 'video') stopVideoCall();
}

function personalityLabel(p) {
  const map = { bff:'🤙 BFF', flirty:'😏 Flirty', deep:'🧠 Deep', sarcastic:'😈 Sarcastic', soft:'🌸 Soft', chaotic:'🤪 Chaotic', cool:'😎 Cool', hype:'🔥 Hype' };
  return map[p] || p;
}

function vibeLabel(v) {
  const map = { bestie:'💫 Bestie', romantic:'💝 Romantic', mysterious:'🌙 Mysterious', mentor:'🧑‍🏫 Mentor' };
  return map[v] || v;
}

function langLabel(l) {
  const map = { en:'🇺🇸 EN', zh:'🇨🇳 ZH', es:'🇪🇸 ES', ja:'🇯🇵 JA', ko:'🇰🇷 KO', fr:'🇫🇷 FR' };
  return map[l] || l;
}

function updateProfileStats() {
  const memory = JSON.parse(localStorage.getItem(`${state.currentId}_profile`) || '{}');
  document.getElementById('statChats').textContent = memory.chatCount || 0;
  document.getElementById('statAffection').textContent = memory.affection || 0;
  document.getElementById('statSaved').textContent = state.savedGifs.length;
}

function clearMemory() {
  if (confirm('Clear all chat memory?')) {
    fetch('/clear-memory', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ companionId: state.currentId }) })
      .then(() => { showToast('Memory cleared 🗑️'); chatCaches[state.currentId] = ''; document.getElementById('chat').innerHTML = ''; });
  }
}

// ─── CALL / FACE SYSTEM ───────────────────────
// FACE_PRESETS -> faces.js; anime drawing -> animeface.js; canvas face
// render -> callface.js; video call controls -> call.js.
// (startVideoCall/stopVideoCall/etc + FACE_PRESETS on window via bootstrap)

// SAVED GIFS, GIF vision, TikTok actions, and the picker -> gifs.js
// (state.savedGifs -> state.savedGifs; all functions on window via bootstrap)

// VOICE (playVoice, fallbackVoice, playVoiceBar, animateWaves, toggleTranscript)
// and speech recognition -> voice.js (functions on window via bootstrap)

// ─── TYPING ───────────────────────────────────
function showTyping() {
  const chat = document.getElementById('chat');
  const el = document.createElement('div');
  el.className = 'typing-indicator'; el.id = 'typingIndicator';
  el.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  chat.appendChild(el); scrollToBottom();
  const dot = document.getElementById('statusDot');
  const txt = document.getElementById('statusText');
  if (dot) dot.classList.add('dot-typing');
  if (txt) txt.textContent = 'typing...';
}
function hideTyping() {
  document.getElementById('typingIndicator')?.remove();
  const dot = document.getElementById('statusDot');
  const txt = document.getElementById('statusText');
  if (dot) dot.classList.remove('dot-typing');
  if (txt) txt.textContent = 'Active now';
}

// ─── REPLY ────────────────────────────────────
let replyingTo = null;
function setReply(text, sender) {
  replyingTo = { text, sender };
  document.getElementById('replyBar').classList.add('active');
  document.getElementById('replyBarText').textContent = (sender==='user'?'You':'AI') + ': ' + text.slice(0,60);
  document.getElementById('input').focus();
}
function cancelReply() {
  replyingTo = null;
  window._editMode = false;
  window._editingRow = null;
  const bar = document.getElementById('replyBar');
  bar.classList.remove('active', 'edit-mode');
  document.getElementById('replyBarText').textContent = '';
  document.getElementById('input').value = '';
}

// ─── SCROLL ───────────────────────────────────
function scrollToBottom() {
  const chat = document.getElementById('chat');
  setTimeout(() => { chat.scrollTop = chat.scrollHeight; }, 50);
}

// ─── REACTIONS ────────────────────────────────
const REACTION_EMOJIS = ['❤️','😂','😮','😢','🔥','👏','😍','💀'];

function showReactionPicker(msgEl, rowEl) {
  document.querySelectorAll('.reaction-picker').forEach(p => p.remove());
  const picker = document.createElement('div'); picker.className = 'reaction-picker';
  REACTION_EMOJIS.forEach(emoji => {
    const btn = document.createElement('button'); btn.className = 'reaction-option'; btn.textContent = emoji;
    btn.onclick = () => { addReaction(msgEl, emoji); picker.remove(); };
    picker.appendChild(btn);
  });
  rowEl.appendChild(picker);
  setTimeout(() => document.addEventListener('click', () => picker.remove(), { once: true }), 10);
}

function addReaction(msgEl, emoji, fromAI = false) {
  let bar = msgEl.querySelector('.reactions');
  if (!bar) { bar = document.createElement('div'); bar.className = 'reactions'; msgEl.appendChild(bar); }
  const ex = [...bar.querySelectorAll('.reaction-bubble')].find(b => b.dataset.emoji === emoji);
  if (ex) {
    const n = parseInt(ex.dataset.count||1)+1; ex.dataset.count = n;
    ex.querySelector('.reaction-count').textContent = n>1?n:'';
    ex.classList.add('reaction-pop'); setTimeout(()=>ex.classList.remove('reaction-pop'),300);
  } else {
    const b = document.createElement('div'); b.className='reaction-bubble reaction-pop'; b.dataset.emoji=emoji; b.dataset.count=1;
    b.innerHTML=`${emoji}<span class="reaction-count"></span>`; b.onclick=()=>addReaction(msgEl,emoji);
    bar.appendChild(b); setTimeout(()=>b.classList.remove('reaction-pop'),300);
  }
  if (!fromAI) {
    const row = msgEl.closest('.msg-row');
    const isAI = row?.classList.contains('ai');
    const imgEl = msgEl.querySelector('img');
    const textEl = msgEl.querySelector('.msg-text-inner');
    const desc = imgEl ? (imgEl.dataset.description||imgEl.title||'the meme you sent') : (textEl?.textContent.slice(0,50)||'your message');
    clearTimeout(window._reactTimeout);
    window._reactTimeout = setTimeout(() => {
      sendToAI(`[User reacted ${emoji} to ${isAI?'your':'their own'} message: "${desc}". React naturally, don't ask for clarification]`);
    }, 800);
  }
}

function addReactionToLastUserMsg(emoji) {
  const rows = document.querySelectorAll('.msg-row.user');
  if (rows.length) addReaction(rows[rows.length-1].querySelector('.msg'), emoji, true);
}

// showConfirm -> utils.js (on window via bootstrap)


// ─── MULTI-SELECT DELETE ──────────────────────
let selectMode = false;
const selectedRows = new Set();

function toggleSelectMode() {
  selectMode = !selectMode;
  selectedRows.clear();
  document.querySelectorAll('.msg-row').forEach(row => {
    row.classList.remove('selected');
    const cb = row.querySelector('.msg-checkbox');
    if (cb) cb.style.display = selectMode ? 'flex' : 'none';
  });
  const bar = document.getElementById('selectBar');
  if (bar) { bar.style.display = selectMode ? 'flex' : 'none'; bar.style.setProperty('display', selectMode ? 'flex' : 'none', 'important'); }
  updateSelectCount();
}

function toggleSelectRow(row) {
  if (!selectMode) return;
  const cb = row.querySelector('.msg-checkbox');
  if (selectedRows.has(row)) {
    selectedRows.delete(row);
    row.classList.remove('selected');
    if (cb) cb.classList.remove('checked');
  } else {
    selectedRows.add(row);
    row.classList.add('selected');
    if (cb) cb.classList.add('checked');
  }
  updateSelectCount();
}

function updateSelectCount() {
  const el = document.getElementById('selectCount');
  if (el) el.textContent = selectedRows.size > 0 ? `${selectedRows.size} selected` : 'Select messages';
}

function deleteSelected() {
  if (!selectedRows.size) return;
  showConfirm(`Delete ${selectedRows.size} message${selectedRows.size>1?'s':''}?`, () => {
    selectedRows.forEach(row => {
      row.style.opacity = '0'; row.style.transform = 'scale(0.9)'; row.style.transition = 'all 0.15s';
      setTimeout(() => row.remove(), 150);
    });
    selectedRows.clear();
    toggleSelectMode();
    setTimeout(() => {
      saveChatToStorage();
      chatCaches[state.currentId] = '';
    }, 300);
  });
}

function selectAll() {
  document.querySelectorAll('.msg-row').forEach(row => {
    selectedRows.add(row); row.classList.add('selected');
    const cb = row.querySelector('.msg-checkbox');
    if (cb) cb.classList.add('checked');
  });
  updateSelectCount();
}

// ─── RENDER MESSAGE ───────────────────────────
function renderMessage(item, sender) {
  const chat = document.getElementById('chat');
  const div = document.createElement('div'); div.className = `msg ${sender}`;

  if (item.type === 'text') {
    const c = getCurrentCompanion();
    const showTranslate = c.language !== 'en';
    div.innerHTML = `
      <div class="translate-wrap">
        <div class="msg-text-inner translate-content">${escapeHtml(item.content)}</div>
        ${showTranslate ? `<button class="translate-btn" title="Translate" onclick="translateText('${escapeHtml(item.content).replace(/'/g, "\'")}', 'en', this)">🌐</button>` : ''}
      </div>`;
  } else if (item.type === 'emoji-reaction') {
    div.className += ' msg-emoji-react'; div.textContent = item.content;
  } else if (item.type === 'image' || item.type === 'image-upload') {
    div.className += ' msg-image';
    if (item.isGif) {
      div.style.cssText = 'display:flex;align-items:flex-end;gap:8px;background:none;border:none;padding:0;';
      const img = document.createElement('img');
      img.src = item.content; img.title = item.title||'meme'; img.alt = item.title||'meme';
      img.style.cssText = 'width:220px;height:180px;object-fit:cover;border-radius:16px;display:block;flex-shrink:0;';
      img.onerror = ()=>{ img.src='https://via.placeholder.com/220x180?text=GIF'; };
      div.appendChild(img); div.appendChild(createGifActions(item.content, item.title||'meme'));
      if (sender === 'ai') {
        describeGif(item.content).then(data => {
          const ctx = buildGifContext(data);
          img.dataset.description = ctx;
          img.dataset.text = data.text || '';
          img.dataset.people = data.people || '';
          img.dataset.vibe = data.vibe || '';
          img.title = ctx;
          img.alt = ctx;
        });
      }
    } else {
      const img = document.createElement('img'); img.src = item.content;
      img.style.cssText = 'width:240px;height:180px;object-fit:cover;border-radius:16px;display:block;';
      img.onerror = ()=>{ img.src='https://via.placeholder.com/240x180?text=📷'; };
      div.appendChild(img);
    }
  } else if (item.type === 'voice') {
    div.className += ' msg-voice-wrap';
    const voiceText = item.textToRead || '';
    const c = getCurrentCompanion();
    const showTranslate = c.language !== 'en';

    const voiceBar = document.createElement('div');
    voiceBar.className = 'msg-voice';
    voiceBar.innerHTML = `
      <button class="voice-play" onclick="playVoiceBar(this)">
        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      </button>
      <div class="voice-waves">
        <div class="wave-bar"></div><div class="wave-bar"></div>
        <div class="wave-bar"></div><div class="wave-bar"></div>
        <div class="wave-bar"></div><div class="wave-bar"></div>
      </div>
      <span class="voice-duration">${item.content||'0:02'}</span>
      <button class="voice-transcript-btn" onclick="toggleTranscript(this)" title="Show text">
        Aa
      </button>
      <span class="voice-text" style="display:none">${voiceText}</span>`;

    // Transcript panel with translate option
    const transcriptWrap = document.createElement('div');
    transcriptWrap.className = 'voice-transcript';
    transcriptWrap.style.display = 'none';
    transcriptWrap.innerHTML = `
      <div class="translate-wrap">
        <div class="translate-content">${escapeHtml(voiceText)}</div>
        ${showTranslate ? `<button class="translate-btn small" title="Translate to English" onclick="translateText('${escapeHtml(voiceText).replace(/'/g, "\'")}', 'en', this)">🌐</button>` : ''}
      </div>`;

    div.appendChild(voiceBar);
    div.appendChild(transcriptWrap);
  }

  const row = document.createElement('div'); row.className = 'msg-row ' + sender;
  // Checkbox
  const checkbox = document.createElement('div');
  checkbox.className = 'msg-checkbox';
  checkbox.style.display = 'none';
  checkbox.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>';
  checkbox.onclick = e => { e.stopPropagation(); toggleSelectRow(row); };
  row.appendChild(checkbox);
  // Long-press to enter select mode
  let _pt;
  // Long press on the message div itself
  row.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button, a, .msg-action-btn, .voice-play')) return;
    _pt = setTimeout(() => {
      navigator.vibrate && navigator.vibrate(30);
      if (!selectMode) toggleSelectMode();
      toggleSelectRow(row);
    }, 500);
  });
  row.addEventListener('pointerup', () => clearTimeout(_pt));
  row.addEventListener('pointercancel', () => clearTimeout(_pt));
  row.addEventListener('pointermove', (e) => { if (e.movementX**2 + e.movementY**2 > 25) clearTimeout(_pt); });
  // Tap to select when in select mode
  row.addEventListener('click', (e) => {
    if (!selectMode) return;
    if (e.target.closest('button, .msg-checkbox')) return;
    toggleSelectRow(row);
  });
  const actEl = document.createElement('div'); actEl.className = 'msg-actions';

  const replyBtn = document.createElement('button'); replyBtn.className = 'msg-action-btn'; replyBtn.title = 'Reply'; replyBtn.innerHTML = '↩';
  replyBtn.onclick = () => {
    const t = (item.type==='image'||item.type==='image-upload') ? (item.title||'meme') : (item.content||'message');
    setReply(t, sender);
  };
  actEl.appendChild(replyBtn);

  const reactBtn = document.createElement('button'); reactBtn.className = 'msg-action-btn'; reactBtn.title = 'React'; reactBtn.innerHTML = '😊';
  reactBtn.onclick = e => { e.stopPropagation(); showReactionPicker(div, row); };
  actEl.appendChild(reactBtn);

  // Delete button
  const delBtn = document.createElement('button');
  delBtn.className = 'msg-action-btn';
  delBtn.title = 'Delete';
  delBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ff3b30" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>';
  delBtn.style.cssText = 'background:rgba(255,59,48,0.08);border-color:rgba(255,59,48,0.2);';
  delBtn.onclick = () => showConfirm('Delete this message?', () => {
    row.style.opacity = '0'; row.style.transform = 'scale(0.9)'; row.style.transition = 'all 0.2s';
    setTimeout(() => { row.remove(); saveChatToStorage(); chatCaches[state.currentId] = ''; }, 200);
  });
  actEl.appendChild(delBtn);

  // Edit button (user text only)
  if (sender === 'user' && item.type === 'text') {
    const contentEl = div.querySelector('.translate-content') || div.querySelector('.msg-text-inner');
    const editBtn = document.createElement('button');
    editBtn.className = 'msg-action-btn';
    editBtn.title = 'Edit';
    editBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';
    editBtn.onclick = () => {
      const txt = contentEl ? contentEl.textContent.trim() : (item.content || '');
      document.getElementById('input').value = txt;
      document.getElementById('input').focus();
      window._editingRow = row;
      window._editMode = true;
      replyingTo = null;
      const bar = document.getElementById('replyBar');
      bar.classList.add('active', 'edit-mode');
      document.getElementById('replyBarText').textContent = txt.slice(0, 50);
    };
    actEl.appendChild(editBtn);
  }

  if (item.replyTo) {
    const q = document.createElement('div'); q.className = 'reply-quote';
    q.textContent = (item.replyTo.sender==='user'?'You':'AI') + ': ' + item.replyTo.text.slice(0,60);
    div.insertBefore(q, div.firstChild);
  }

  if (sender === 'user') { row.appendChild(actEl); row.appendChild(div); }
  else { row.appendChild(div); row.appendChild(actEl); }

  chat.appendChild(row); scrollToBottom();
}

// escapeHtml + _voicePlaceholderRE -> utils.js (on window via bootstrap)

// ─── VOICE BAR ───────────────────────────────  (playVoiceBar, animateWaves -> voice.js)

// GIF picker (toggleGifPicker, switchGifTab, loadTrendingGifs, searchGifs,
// renderGifGrid, sendGif, renderSavedGifsInPicker) -> gifs.js

// ─── SEND ─────────────────────────────────────
async function sendMessage() {
  const input = document.getElementById('input'); const msg = input.value.trim(); if (!msg) return;

  // ── EDIT MODE: update in-place, wipe stale AI responses ──
  if (window._editMode && window._editingRow) {
    const editingRow = window._editingRow;
    const contentEl = editingRow.querySelector('.translate-content') || editingRow.querySelector('.msg-text-inner');
    if (contentEl) contentEl.textContent = msg;
    const wrap = contentEl?.closest('.translate-wrap') || contentEl?.parentElement;
    if (wrap && !editingRow.querySelector('.edited-label')) {
      const lbl = document.createElement('span'); lbl.className = 'edited-label'; lbl.textContent = 'edited';
      wrap.appendChild(lbl);
    }
    // Remove every row that comes after the edited one (stale AI replies)
    let next = editingRow.nextElementSibling;
    while (next) { const rm = next; next = next.nextElementSibling; if (rm.classList.contains('msg-row')) rm.remove(); }
    input.value = '';
    window._editMode = false; window._editingRow = null;
    editingRow.classList.remove('editing');
    const bar = document.getElementById('replyBar');
    bar.classList.remove('active', 'edit-mode');
    document.getElementById('replyBarText').textContent = '';
    setTimeout(saveChatToStorage, 100);
    sendToAI(`[User edited their previous message to]: ${msg}`, msg);
    return;
  }

  // ── NORMAL SEND ──────────────────────────────
  const item = { type:'text', content:msg };
  if (replyingTo) { item.replyTo = replyingTo; cancelReply(); }
  renderMessage(item, 'user'); input.value = '';

  const c = getCurrentCompanion(); c.lastMessage = msg; c.lastTime = Date.now();
  saveCompanions(); renderSidebar();

  sendToAI(msg);
  setTimeout(saveChatToStorage, 100);
}

let _cachedGeo = null;
navigator.geolocation?.getCurrentPosition(
  p => { _cachedGeo = `${p.coords.latitude.toFixed(2)},${p.coords.longitude.toFixed(2)}`; },
  () => {},
  { timeout: 5000 }
);

async function sendToAI(text, originalText) {
  showTyping();
  const c = getCurrentCompanion();

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
  const dateStr = now.toLocaleDateString([], { weekday:'long', month:'long', day:'numeric' });
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const locationStr = _cachedGeo || tz;

  try {
    const res = await fetch('/chat', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ message: originalText || text, fullMessage: text, companionId:c.id, companion:c, context: { time: timeStr, date: dateStr, timezone: tz, location: locationStr } })
    });
    hideTyping();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.profile) localStorage.setItem(`${c.id}_profile`, JSON.stringify(data.profile));
    (data.messages||[]).forEach(m => renderMessage(m, 'ai'));
    if (data.emojiReaction) setTimeout(()=>addReactionToLastUserMsg(data.emojiReaction), 600);
    setTimeout(saveChatToStorage, 500);

    // Gamification + UX
    const hasVoice = (data.messages||[]).some(m => m.type === 'voice');
    addXp(state.currentId, hasVoice ? 15 : 10);
    updateStreak(state.currentId);
    playChime();
    const firstText = (data.messages||[]).find(m => m.type === 'text')?.content || '';
    setCompanionMood(state.currentId, detectMood(firstText));

    // Update last message from AI
    if (data.messages?.[0]?.type === 'text') {
      c.lastMessage = data.messages[0].content.slice(0,40); c.lastTime = Date.now();
      saveCompanions(); renderSidebar();
    }
  } catch(e) {
    hideTyping(); renderMessage({type:'text',content:'Oops! Lost connection 🌙'}, 'ai');
  }
}

// SPEECH RECOGNITION -> voice.js

// ─── IMAGE UPLOAD ─────────────────────────────
document.getElementById('fileInput').addEventListener('change', async () => {
  const file = document.getElementById('fileInput').files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = async (e) => {
    const dataUrl = e.target.result;
    renderMessage({ type:'image-upload', content:dataUrl }, 'user');

    // Auto-describe uploaded image with vision
    showTyping();
    try {
      const data = await describeGif(dataUrl);
      hideTyping();
      const ctx = buildGifContext(data);
      sendToAI(`[User sent an image — vision analysis: ${ctx}. React naturally to what you see, be specific about the content]`);
    } catch {
      hideTyping();
      const d = prompt('Describe this image (optional):');
      if (d?.trim()) sendToAI('User sent an image: ' + d);
    }
  };
  reader.readAsDataURL(file);
});

// ─── INIT ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('input')?.addEventListener('keydown', e => { if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); sendMessage(); } });
  let st;
  document.getElementById('gifSearch')?.addEventListener('input', e => { clearTimeout(st); st=setTimeout(()=>searchGifs(e.target.value),400); });

  // Restore user photo
  const savedUserPhoto = getUserPhoto();
  if (savedUserPhoto) setUserPhoto(savedUserPhoto);

  renderSidebar();

  // On mobile, start at sidebar; on desktop show chat
  if (window.innerWidth > 640) {
    switchCompanion(state.currentId);
    document.getElementById('chatPanel').classList.add('panel-active');
  } else {
    document.getElementById('sidebar').classList.add('sidebar-active');
  }
});


// ─── MESSAGE ACTIONS: DELETE & EDIT ───────────
function deleteMessage(row) {
  if (!confirm('Delete this message?')) return;
  row.style.animation = 'msgOut 0.2s ease forwards';
  setTimeout(() => { row.remove(); saveChatToStorage(); chatCaches[state.currentId] = ''; }, 200);
}

function editMessage(row, originalText) {
  const input = document.getElementById('input');
  // Fill input with original text
  input.value = originalText;
  input.focus();

  // Mark row as being edited
  row.classList.add('editing');

  // Store reference to edited row
  window._editingRow = row;
  window._editingOriginal = originalText;

  // Show edit indicator in reply bar
  const bar = document.getElementById('replyBar');
  const barText = document.getElementById('replyBarText');
  bar.classList.add('active');
  bar.classList.add('edit-mode');
  barText.textContent = 'Editing: ' + originalText.slice(0, 50);

  // Override send to handle edit
  window._editMode = true;
}

function cancelEdit() {
  window._editMode = false;
  window._editingRow = null;
  window._editingOriginal = null;
  document.getElementById('replyBar').classList.remove('active', 'edit-mode');
  document.getElementById('replyBarText').textContent = '';
  document.getElementById('input').value = '';
}

// ─── TRANSLATE ────────────────────────────────
async function translateText(text, targetLang, btn) {
  if (!text?.trim()) return;
  const original = btn.dataset.original || null;
  if (original) {
    const container = btn.closest('.translate-wrap');
    if (container) container.querySelector('.translate-content').textContent = original;
    btn.dataset.original = '';
    btn.textContent = '🌐';
    btn.title = 'Translate';
    return;
  }
  const origText = btn.textContent;
  btn.textContent = '⏳';
  btn.disabled = true;
  try {
    const res = await fetch('/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLang: targetLang || 'en' })
    });
    const data = await res.json();
    const container = btn.closest('.translate-wrap');
    const contentEl = container?.querySelector('.translate-content');
    if (contentEl) {
      btn.dataset.original = contentEl.textContent;
      contentEl.textContent = data.translated;
    }
    btn.textContent = '↩️';
    btn.title = 'Show original';
  } catch {
    showToast('Translation failed 😅');
    btn.textContent = origText;
  } finally {
    btn.disabled = false;
  }
}

// VOICE TRANSCRIPT (toggleTranscript) -> voice.js


// ─── LOAD HISTORY FROM SERVER ─────────────────
async function loadServerHistory(companionId) {
  try {
    const res = await fetch('/get-history?companionId=' + companionId);
    const data = await res.json();
    if (!data.messages || !data.messages.length) return;
    const chat = document.getElementById('chat');
    chat.innerHTML = '';
    data.messages.forEach(msg => {
      if (msg.role === 'user') {
        renderMessage({ type: 'text', content: msg.content }, 'user');
      } else if (msg.role === 'assistant') {
        // Try to parse as JSON (AI responses are stored as JSON)
        try {
          const parsed = JSON.parse(msg.content);
          if (parsed.messages) {
            parsed.messages.forEach(m => renderMessage(m, 'ai'));
          } else {
            renderMessage({ type: 'text', content: msg.content }, 'ai');
          }
        } catch {
          renderMessage({ type: 'text', content: msg.content }, 'ai');
        }
      }
    });
    scrollToBottom();
  } catch(e) { console.warn('Could not load server history:', e); }
}

// ─── CHAT HISTORY PERSISTENCE ─────────────────
const CHAT_STORAGE_KEY = 'chatty-ai_chat_history';

function saveChatToStorage() {
  const chat = document.getElementById('chat');
  if (!chat) return;
  const stored = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) || '{}');
  // Save simplified version - just text content per companion
  const messages = [];
  chat.querySelectorAll('.msg-row').forEach(row => {
    const sender = row.classList.contains('user') ? 'user' : 'ai';
    const textEl = row.querySelector('.msg-text-inner .translate-content, .msg-text-inner');
    const voiceEl = row.querySelector('.voice-text');
    const imgEl = row.querySelector('img');
    if (textEl) messages.push({ type: 'text', sender, content: textEl.textContent });
    else if (voiceEl) {
      const vt = voiceEl.textContent?.trim();
      if (vt && !_voicePlaceholderRE.test(vt)) messages.push({ type: 'voice', sender, content: '0:02', textToRead: vt });
      // skip saving voice bars with no real text
    }
    else if (imgEl && imgEl.src) messages.push({ type: 'image', sender, content: imgEl.src, isGif: true, title: imgEl.title });
  });
  stored[state.currentId] = messages.slice(-60); // keep last 60
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(stored));
}

function loadChatFromStorage(id) {
  const stored = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) || '{}');
  const messages = stored[id] || [];
  if (!messages.length) return;
  const chat = document.getElementById('chat');
  chat.innerHTML = '';
  messages.forEach(msg => {
    // Drop voice bars that have placeholder text — they have no audio
    if (msg.type === 'voice' && (!msg.textToRead || _voicePlaceholderRE.test(msg.textToRead.trim()))) return;
    renderMessage(msg, msg.sender);
  });
}
// ─── PHOTO UPLOADS ────────────────────────────
// compressPhoto -> utils.js (on window via bootstrap)

// ── User profile photo ──
function getUserPhoto() { return localStorage.getItem('chatty-ai_user_photo') || ''; }

function setUserPhoto(url) {
  try { localStorage.setItem('chatty-ai_user_photo', url); } catch { showToast('Storage full — try a smaller photo'); return; }
  const btn = document.getElementById('userPhotoBtn');
  if (btn) {
    if (url) { btn.style.backgroundImage = `url(${url})`; btn.textContent = ''; }
    else { btn.style.backgroundImage = ''; btn.textContent = '👤'; }
  }
}

function handleUserPhotoUpload(input) {
  const file = input.files[0]; if (!file) return; input.value = '';
  compressPhoto(file, 300, url => { setUserPhoto(url); showToast('Your photo updated ✨'); });
}

// ── AI companion photo ──
function handleAIPhotoUpload(input) {
  const file = input.files[0]; if (!file) return; input.value = '';
  compressPhoto(file, 400, url => {
    const c = getCurrentCompanion();
    c.customPhoto = url;
    saveCompanions();
    _applyCompanionPhotos(c);
    renderSidebar(document.querySelector('.sidebar-search')?.value || '');
    showToast(`${c.name}'s photo updated ✨`);
  });
}

function _applyCompanionPhotos(c) {
  // Topbar avatar
  const emoji = document.getElementById('topbarEmoji');
  const photo = document.getElementById('topbarAvatarPhoto');
  if (emoji && photo) {
    if (c.customPhoto) { photo.src = c.customPhoto; photo.style.display = 'block'; emoji.style.display = 'none'; }
    else { photo.style.display = 'none'; emoji.style.display = ''; emoji.textContent = c.avatar; }
  }
  // Profile screen avatar
  const bigEmoji = document.getElementById('profileAvatarBig');
  const bigPhoto = document.getElementById('profileAvatarPhoto');
  if (bigEmoji && bigPhoto) {
    if (c.customPhoto) { bigPhoto.src = c.customPhoto; bigPhoto.style.display = 'block'; bigEmoji.style.display = 'none'; }
    else { bigPhoto.style.display = 'none'; bigEmoji.style.display = ''; bigEmoji.textContent = c.avatar; }
  }
}

// ── Custom chat background ──
function handleChatBgUpload(input) {
  const file = input.files[0]; if (!file) return; input.value = '';
  compressPhoto(file, 1400, url => {
    const c = getCurrentCompanion();
    c.chatBgCustom = url; c.chatBg = 'custom';
    saveCompanions();
    applyCompanionTheme(c.id);
    showToast('Chat background updated ✨');
  });
}

// ─── MOOD SYSTEM ──────────────────────────────
const MOOD_COLORS = { happy:'#FFD60A', excited:'#FF9F0A', playful:'#30D158', curious:'#5E5CE6', tired:'#636366', melancholy:'#0084FF' };
const MOOD_ICONS  = { happy:'😊', excited:'🔥', playful:'😄', curious:'🤔', tired:'😴', melancholy:'🌙' };

function detectMood(text) {
  if (!text) return 'happy';
  const t = text.toLowerCase();
  if (/tired|sleepy|exhausted|ugh|meh|😴|😑/.test(t)) return 'tired';
  if (/miss|sad|lonely|sigh|😔|💔|😢/.test(t)) return 'melancholy';
  if (/hmm|wonder|curious|really\?|tell me|🤔/.test(t)) return 'curious';
  if (/lol|haha|😄|🤪|silly|fun|hilarious/.test(t)) return 'playful';
  if (/!|amazing|love|great|yay|🥰|😍|🔥|✨|wow/.test(t)) return 'excited';
  return 'happy';
}

function setCompanionMood(id, mood) {
  const c = getCompanion(id);
  if (!c || c.mood === mood) return;
  c.mood = mood;
  saveCompanions();
  if (id === state.currentId) updateStatusRing(mood);
}

function updateStatusRing(mood) {
  const ring = document.getElementById('topbarStoryRing');
  if (ring) {
    const color = MOOD_COLORS[mood] || '#0084FF';
    ring.style.background = `linear-gradient(135deg, ${color} 0%, #ee2a7b 45%, #6228d7 80%, #00f2ea 100%)`;
  }
  const sidebarItem = document.querySelector(`.companion-item.active .companion-avatar`);
  if (sidebarItem) {
    const color = MOOD_COLORS[mood] || '#0084FF';
    sidebarItem.style.boxShadow = `0 0 0 2.5px ${color}, 0 0 12px ${color}55`;
  }
}

// XP/level, daily streak, and playChime -> gamification.js + utils.js
// (all exposed on window via bootstrap)

// ─── CHAT BACKGROUND THEMES ───────────────────
const BG_THEMES = {
  default: '',
  ocean:   'radial-gradient(ellipse at 20% 80%, rgba(0,80,160,0.3) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(0,160,200,0.2) 0%, transparent 50%)',
  forest:  'radial-gradient(ellipse at 30% 70%, rgba(0,80,40,0.35) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(40,120,20,0.2) 0%, transparent 50%)',
  sunset:  'radial-gradient(ellipse at 50% 100%, rgba(200,60,30,0.3) 0%, transparent 60%), radial-gradient(ellipse at 50% 0%, rgba(120,40,160,0.25) 0%, transparent 50%)',
  cosmic:  'radial-gradient(ellipse at 20% 20%, rgba(100,40,200,0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(0,100,200,0.25) 0%, transparent 50%)',
  cherry:  'radial-gradient(ellipse at 60% 40%, rgba(200,60,100,0.3) 0%, transparent 60%), radial-gradient(ellipse at 30% 80%, rgba(160,40,80,0.2) 0%, transparent 50%)',
};

function applyCompanionTheme(id) {
  const c = getCompanion(id);
  const chat = document.getElementById('chat');
  if (!chat) return;
  if (c.chatBg === 'custom' && c.chatBgCustom) {
    chat.style.background = `linear-gradient(rgba(6,6,14,0.62), rgba(6,6,14,0.62)), url(${c.chatBgCustom}) center/cover`;
  } else {
    chat.style.background = BG_THEMES[c.chatBg || 'default'] || '';
  }
  document.querySelectorAll('.bg-dot').forEach(d => d.classList.toggle('active', d.dataset.theme === (c.chatBg || 'default')));
}

function setChatBg(theme) {
  const c = getCurrentCompanion();
  c.chatBg = theme;
  saveCompanions();
  applyCompanionTheme(c.id);
}

// ─── CHAT SEARCH ──────────────────────────────
let _searchOpen = false, _searchMatches = [], _searchIdx = 0;

function toggleChatSearch() {
  _searchOpen = !_searchOpen;
  const bar = document.getElementById('chatSearchBar');
  if (!bar) return;
  if (_searchOpen) {
    bar.style.display = 'flex';
    document.getElementById('chatSearchInput')?.focus();
  } else {
    bar.style.display = 'none';
    const inp = document.getElementById('chatSearchInput');
    if (inp) inp.value = '';
    _clearSearchHL(); _searchMatches = [];
    document.getElementById('searchCount').textContent = '';
  }
}

function runChatSearch(val) {
  _clearSearchHL(); _searchMatches = []; _searchIdx = 0;
  if (!val.trim()) { document.getElementById('searchCount').textContent = ''; return; }
  document.querySelectorAll('.msg-row').forEach(row => {
    const txt = row.querySelector('.translate-content, .msg-text-inner, .voice-text')?.textContent || '';
    if (txt.toLowerCase().includes(val.toLowerCase())) { row.classList.add('search-match'); _searchMatches.push(row); }
  });
  _applySearchCurrent();
}

function searchNav(dir) {
  if (!_searchMatches.length) return;
  _searchMatches[_searchIdx]?.classList.remove('search-current');
  _searchIdx = (_searchIdx + dir + _searchMatches.length) % _searchMatches.length;
  _applySearchCurrent();
}

function _applySearchCurrent() {
  const el = _searchMatches[_searchIdx];
  if (el) { el.classList.add('search-current'); el.scrollIntoView({ behavior:'smooth', block:'center' }); }
  const cnt = document.getElementById('searchCount');
  if (cnt) cnt.textContent = _searchMatches.length ? `${_searchIdx+1}/${_searchMatches.length}` : '0';
}

function _clearSearchHL() {
  document.querySelectorAll('.search-match,.search-current').forEach(el => el.classList.remove('search-match','search-current'));
}

// ─── EXPORT CHAT ──────────────────────────────
function exportChat() {
  const c = getCurrentCompanion();
  let text = `chatty-ai — ${c.name}\nExported: ${new Date().toLocaleString()}\n${'─'.repeat(40)}\n\n`;
  document.querySelectorAll('.msg-row').forEach(row => {
    const who = row.classList.contains('user') ? 'You' : c.name;
    const content = row.querySelector('.translate-content, .msg-text-inner, .voice-text')?.textContent?.trim();
    if (content) text += `${who}: ${content}\n`;
  });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type:'text/plain' }));
  a.download = `${c.name}-chat.txt`; a.click();
}

window.translateText = translateText;
window.deleteMessage = deleteMessage;
window.showConfirm = showConfirm;
window.editMessage = editMessage;
window.cancelEdit = cancelEdit;
window.toggleTranscript = toggleTranscript;
window.toggleSelectMode = toggleSelectMode;
window.deleteSelected = deleteSelected;
window.selectAll = selectAll;
window.selectVoice = selectVoice;
window.selectFacePreset = selectFacePreset;
window.renderFacePresets = renderFacePresets;
window.onFaceNameInput = onFaceNameInput;
window.setFaceRegion = setFaceRegion;
window.setFaceStudioStyle = setFaceStudioStyle;
window.toggleFaceStudio = toggleFaceStudio;
window.applyFaceStudio = applyFaceStudio;
window.handleFaceUpload = handleFaceUpload;
window.handleDialogueUpload = handleDialogueUpload;
window.clearDialogueSample = clearDialogueSample;
window.toggleChatSearch = toggleChatSearch;
window.runChatSearch = runChatSearch;
window.searchNav = searchNav;
window.exportChat = exportChat;
window.setChatBg = setChatBg;
window.handleUserPhotoUpload = handleUserPhotoUpload;
window.handleAIPhotoUpload = handleAIPhotoUpload;
window.handleChatBgUpload = handleChatBgUpload;
