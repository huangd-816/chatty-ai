// Call-screen face rendering: anime canvas face, photo portrait, animation loop.
// Extracted from app.js (Phase 2).
import { getCurrentCompanion, state } from './state.js';
import { FACE_PRESETS } from './faces.js';
import { _drawAnimeHairBack, _drawAnimeHairFront, _drawAnimeAccessories } from './animeface.js';

// Canvas animation state (local to the renderer).
let callAnimFrame = null;
let eyeBlinkState = 1;
let blinkTimer = 0;
let mouthOpen = 0;

const ANIME_STYLES = {
  // Character-specific: h=hair, h2=hair-dark, sk=skin, ey=eye, ei=eye-inner, ac=accent, bg=bg-glow, sh=shirt, hs=hairStyle
  ca_zero2:   {h:'#FF4060',h2:'#CC1040',sk:'#FFE0D4',ey:'#00CED1',ei:'#00A8B0',ac:'#FF1744',bg:'rgba(255,50,80,0.22)',sh:'#CC1040',hs:'twin'},
  ca_rem:     {h:'#3870F8',h2:'#1850CC',sk:'#FFE8E4',ey:'#FF5090',ei:'#E03068',ac:'#3870F8',bg:'rgba(50,110,250,0.2)', sh:'#1A1A5A',hs:'bob'},
  ca_mikasa:  {h:'#181820',h2:'#0D0D12',sk:'#F0C8A8',ey:'#608898',ei:'#405878',ac:'#8A4A4A',bg:'rgba(20,20,40,0.18)', sh:'#2A3444',hs:'short'},
  ca_megumin: {h:'#181820',h2:'#0D0D12',sk:'#FFE0D4',ey:'#CC1A1A',ei:'#AA0808',ac:'#CC1A1A',bg:'rgba(150,0,0,0.18)',  sh:'#1A0A28',hs:'long'},
  ca_aqua:    {h:'#38AEFF',h2:'#1090F8',sk:'#E8F2FF',ey:'#1870FF',ei:'#0050E0',ac:'#38AEFF',bg:'rgba(20,150,255,0.22)',sh:'#E0ECFF',hs:'long'},
  ca_asuna:   {h:'#C05030',h2:'#883820',sk:'#FFE4D4',ey:'#703838',ei:'#502020',ac:'#C05030',bg:'rgba(160,70,30,0.18)', sh:'#F0F0FF',hs:'long'},
  ca_nezuko:  {h:'#181820',h2:'#0D0D12',sk:'#FFE4D8',ey:'#C83060',ei:'#A01040',ac:'#C83060',bg:'rgba(160,20,60,0.18)', sh:'#C03068',hs:'long'},
  ca_2b:      {h:'#E8E8F0',h2:'#C8C8D8',sk:'#F0EEEC',ey:'#888890',ei:'#606068',ac:'#A0A0A8',bg:'rgba(20,20,30,0.22)', sh:'#101018',hs:'bob'},
  ca_jinx:    {h:'#6868FF',h2:'#4848D8',sk:'#E8D4E0',ey:'#4040FF',ei:'#2020C8',ac:'#FF3068',bg:'rgba(60,50,200,0.22)',sh:'#20104A',hs:'twin'},
  ca_hutao:   {h:'#181820',h2:'#0D0D12',sk:'#F0D8D4',ey:'#C82020',ei:'#AA0808',ac:'#C82020',bg:'rgba(140,0,20,0.2)',  sh:'#CC2040',hs:'twin'},
  ca_ahri:    {h:'#C04880',h2:'#A03060',sk:'#F0DCD4',ey:'#4080E0',ei:'#2060C0',ac:'#C04880',bg:'rgba(160,40,100,0.2)',sh:'#1A1A3A',hs:'long'},
  ca_gojo:    {h:'#F8F8FF',h2:'#E0E0F0',sk:'#F0E8E4',ey:'#40A0FF',ei:'#1080FF',ac:'#40A0FF',bg:'rgba(40,140,255,0.22)',sh:'#101018',hs:'short'},
  ca_levi:    {h:'#181820',h2:'#0D0D12',sk:'#D8C8B8',ey:'#4A5060',ei:'#303840',ac:'#6A8070',bg:'rgba(20,30,20,0.18)', sh:'#4A5444',hs:'undercut'},
  ca_kakashi: {h:'#E8E8E8',h2:'#D0D0D0',sk:'#D0B8A0',ey:'#3A5A6A',ei:'#203848',ac:'#888888',bg:'rgba(40,40,50,0.18)', sh:'#2A2A2A',hs:'swept'},
  ca_deku:    {h:'#1A2A12',h2:'#0D1A08',sk:'#F8E4D0',ey:'#2A5A28',ei:'#1A3A18',ac:'#208818',bg:'rgba(20,80,20,0.18)', sh:'#1A3A18',hs:'messy'},
  ca_vegeta:  {h:'#181820',h2:'#0D0D12',sk:'#E8C8A0',ey:'#2A3A5A',ei:'#1A2A40',ac:'#3A50A0',bg:'rgba(15,25,55,0.2)',  sh:'#1A1A2E',hs:'spiky'},
  ca_nanami:  {h:'#C8A860',h2:'#A08840',sk:'#DEC0A0',ey:'#6A5A40',ei:'#4A3A28',ac:'#C8A860',bg:'rgba(140,100,40,0.18)',sh:'#2A2A1A',hs:'swept'},
  ca_zoro:    {h:'#205A18',h2:'#104008',sk:'#DCC098',ey:'#205A18',ei:'#104008',ac:'#388A28',bg:'rgba(20,70,20,0.18)',  sh:'#181818',hs:'short'},
  ca_itachi:  {h:'#181820',h2:'#0D0D12',sk:'#D0A888',ey:'#CC2020',ei:'#AA0808',ac:'#CC2020',bg:'rgba(30,0,0,0.22)',   sh:'#080814',hs:'long'},
  ca_luffy:   {h:'#181820',h2:'#0D0D12',sk:'#F8D8A8',ey:'#181820',ei:'#0D0D12',ac:'#CC2020',bg:'rgba(200,20,20,0.18)',sh:'#CC2020',hs:'short'},
  ca_geralt:  {h:'#F0F0F0',h2:'#D8D8D8',sk:'#D0B888',ey:'#888888',ei:'#606060',ac:'#D8D0A0',bg:'rgba(60,50,40,0.2)',  sh:'#1A1A1A',hs:'long'},
  ca_cloud:   {h:'#C8C8E8',h2:'#A0A0C8',sk:'#E8D0B8',ey:'#4060C8',ei:'#2040A8',ac:'#4060C8',bg:'rgba(40,60,140,0.2)',sh:'#1A1A2E',hs:'spiky'},
  ca_kazuha:  {h:'#CC4040',h2:'#AA2020',sk:'#E8D0B8',ey:'#CC4040',ei:'#AA2020',ac:'#4080C8',bg:'rgba(160,40,40,0.18)',sh:'#2A3A4A',hs:'long'},
  ca_light:   {h:'#C09050',h2:'#A07030',sk:'#F0D8B8',ey:'#C09050',ei:'#A07030',ac:'#C09050',bg:'rgba(160,120,40,0.18)',sh:'#181818',hs:'swept'},
  ca_l:       {h:'#181820',h2:'#0D0D12',sk:'#E0D0B8',ey:'#181820',ei:'#0D0D12',ac:'#505050',bg:'rgba(10,10,20,0.22)', sh:'#F0F0F0',hs:'messy'},
  ca_sebastian:{h:'#181820',h2:'#0D0D12',sk:'#D8C0A0',ey:'#8030C0',ei:'#601080',ac:'#8030C0',bg:'rgba(60,0,80,0.22)', sh:'#080808',hs:'swept'},
  ca_dazai:   {h:'#604818',h2:'#3A2808',sk:'#E8C8A0',ey:'#604818',ei:'#3A2808',ac:'#8A6030',bg:'rgba(60,40,10,0.18)', sh:'#1A0A02',hs:'messy'},
  ca_chuuya:  {h:'#CC2020',h2:'#AA0808',sk:'#DCC0A0',ey:'#CC2020',ei:'#AA0808',ac:'#CC2020',bg:'rgba(160,20,20,0.22)',sh:'#1A0A02',hs:'short'},
  ca_sukuna:  {h:'#F8D0C0',h2:'#E0B0A0',sk:'#E8C0A8',ey:'#CC0A28',ei:'#AA0018',ac:'#CC0A28',bg:'rgba(160,0,20,0.22)', sh:'#080808',hs:'short'},
  ca_megumi:  {h:'#181820',h2:'#0D0D12',sk:'#D8C8B0',ey:'#1A2A4A',ei:'#0D1A30',ac:'#2A3A5A',bg:'rgba(10,18,48,0.2)',  sh:'#1A1A2E',hs:'short'},
  ca_bakugo:  {h:'#D0A820',h2:'#B08800',sk:'#F0C888',ey:'#D0A820',ei:'#B08800',ac:'#FF6020',bg:'rgba(180,130,0,0.2)', sh:'#181818',hs:'spiky'},
  ca_makima:  {h:'#C88040',h2:'#A06020',sk:'#F0D4C0',ey:'#CC8844',ei:'#AA6622',ac:'#CC8844',bg:'rgba(160,90,30,0.18)',sh:'#1A1A1A',hs:'long'},
  ca_power:   {h:'#D04060',h2:'#B02040',sk:'#F0D4D0',ey:'#CC0020',ei:'#AA0010',ac:'#D04060',bg:'rgba(180,30,40,0.22)',sh:'#1A1A1A',hs:'twin'},
  ca_yor:     {h:'#181820',h2:'#0D0D12',sk:'#F0C8C8',ey:'#880A0A',ei:'#660808',ac:'#880A0A',bg:'rgba(80,0,0,0.22)',   sh:'#880A0A',hs:'long'},
  ca_loid:    {h:'#D4C888',h2:'#B0A060',sk:'#E8D0B0',ey:'#5A8060',ei:'#3A6040',ac:'#D4C888',bg:'rgba(140,130,50,0.18)',sh:'#1A2A1A',hs:'swept'},
  ca_dio:     {h:'#F0E040',h2:'#D0C020',sk:'#F0DCC0',ey:'#880808',ei:'#660000',ac:'#F0E040',bg:'rgba(160,130,0,0.22)',sh:'#181818',hs:'swept'},
  ca_zenitsu: {h:'#E8C040',h2:'#C8A020',sk:'#F8E0C0',ey:'#E8C040',ei:'#C8A020',ac:'#4060D0',bg:'rgba(200,160,20,0.2)',sh:'#E8E020',hs:'short'},
  ca_toga:    {h:'#E8C040',h2:'#C8A020',sk:'#F0D4C0',ey:'#E8C040',ei:'#C8A020',ac:'#FF4080',bg:'rgba(200,160,20,0.18)',sh:'#2A2A2A',hs:'buns'},
  ca_wednesday:{h:'#181820',h2:'#0D0D12',sk:'#E8E0D0',ey:'#181820',ei:'#0D0D12',ac:'#505050',bg:'rgba(10,10,20,0.22)',sh:'#080808',hs:'braids'},
  ca_eleven:  {h:'#181820',h2:'#0D0D12',sk:'#F0D8C0',ey:'#4060A0',ei:'#204080',ac:'#4060A0',bg:'rgba(30,40,80,0.18)', sh:'#484848',hs:'short'},
  ca_hermione:{h:'#604818',h2:'#3A2808',sk:'#F0D8C0',ey:'#604818',ei:'#3A2808',ac:'#AA7830',bg:'rgba(60,40,10,0.18)', sh:'#181818',hs:'long'},
  ca_arya:    {h:'#181820',h2:'#0D0D12',sk:'#D8C0A0',ey:'#6A5840',ei:'#4A3820',ac:'#6A5840',bg:'rgba(20,20,30,0.18)', sh:'#282828',hs:'messy'},
  ca_natsume: {h:'#C8A050',h2:'#A08030',sk:'#F0D8B8',ey:'#6A9060',ei:'#4A6840',ac:'#C8A050',bg:'rgba(140,110,30,0.18)',sh:'#2A3A2A',hs:'swept'},
  ca_bocchi:  {h:'#CC4080',h2:'#AA2060',sk:'#FFE4D4',ey:'#CC4080',ei:'#AA2060',ac:'#CC4080',bg:'rgba(180,40,80,0.2)',  sh:'#E8D4E0',hs:'long'},
  ca_nijika:  {h:'#E8E020',h2:'#C8C000',sk:'#FFE8D0',ey:'#E8A020',ei:'#C08000',ac:'#E8E020',bg:'rgba(200,180,0,0.2)', sh:'#181818',hs:'short'},
  ca_ryo:     {h:'#181820',h2:'#0D0D12',sk:'#FFE8D8',ey:'#8040C0',ei:'#6020A0',ac:'#8040C0',bg:'rgba(60,20,100,0.18)',sh:'#1A1A2E',hs:'long'},
  ca_kita:    {h:'#CC6820',h2:'#AA4800',sk:'#FFE0C8',ey:'#CC6820',ei:'#AA4800',ac:'#FF8040',bg:'rgba(180,80,0,0.18)',  sh:'#282828',hs:'swept'},
  ca_nyanko:  {h:'#F8E8D0',h2:'#E0C8A8',sk:'#F8E8D0',ey:'#CC6020',ei:'#AA4000',ac:'#CC6020',bg:'rgba(160,90,20,0.2)', sh:'#F8E8D0',hs:'short'},
  ca_sherlock:{h:'#181820',h2:'#0D0D12',sk:'#E8D0B8',ey:'#2040C0',ei:'#1020A0',ac:'#5050A0',bg:'rgba(10,20,60,0.18)', sh:'#080814',hs:'swept'},
  ca_ironman: {h:'#4A3020',h2:'#3A2010',sk:'#E8C898',ey:'#4A3020',ei:'#2A1808',ac:'#CC2A2A',bg:'rgba(180,20,20,0.2)', sh:'#CC2A2A',hs:'short'},
  ca_batman:  {h:'#181820',h2:'#0D0D12',sk:'#D8B888',ey:'#181820',ei:'#0D0D12',ac:'#4A4A2A',bg:'rgba(10,10,20,0.22)', sh:'#080808',hs:'short'},
  ca_walter:  {h:'#181820',h2:'#0D0D12',sk:'#D8C0A0',ey:'#4A4A3A',ei:'#2A2A20',ac:'#5A5A40',bg:'rgba(30,30,20,0.18)', sh:'#2A2A1A',hs:'short'},
  ca_bond:    {h:'#181820',h2:'#0D0D12',sk:'#E0C8A0',ey:'#2A5068',ei:'#1A3048',ac:'#5080A0',bg:'rgba(20,40,60,0.18)', sh:'#080814',hs:'swept'},
  ca_sparrow: {h:'#4A2A08',h2:'#2A0A00',sk:'#D8A868',ey:'#4A2A08',ei:'#2A0A00',ac:'#D0A040',bg:'rgba(60,40,0,0.2)',   sh:'#181010',hs:'long'},
  ca_joker_dk:{h:'#207A10',h2:'#104A08',sk:'#F0E8D0',ey:'#207A10',ei:'#104A08',ac:'#CC3020',bg:'rgba(0,60,0,0.2)',    sh:'#402810',hs:'messy'},
  ca_hannibal:{h:'#3A2A1A',h2:'#2A1A08',sk:'#D8B888',ey:'#6A3A20',ei:'#4A2008',ac:'#8A4A2A',bg:'rgba(40,20,10,0.2)', sh:'#180808',hs:'swept'},
  ca_tyler:   {h:'#E8C880',h2:'#C8A860',sk:'#E8C8A0',ey:'#8A7060',ei:'#6A5040',ac:'#E8C880',bg:'rgba(140,100,40,0.18)',sh:'#CC2020',hs:'short'},
  ca_natori:  {h:'#F8F0E0',h2:'#E0D8C8',sk:'#F0D8B8',ey:'#4A5A6A',ei:'#2A3A4A',ac:'#E0D8C0',bg:'rgba(60,60,50,0.18)',sh:'#282828',hs:'swept'},
  ca_reiko:   {h:'#C8B0E0',h2:'#A890C8',sk:'#EEE0D8',ey:'#8070B0',ei:'#605090',ac:'#C8B0E0',bg:'rgba(120,100,160,0.18)',sh:'#9080B0',hs:'long'},
  ca_tanuma:  {h:'#1A2A3A',h2:'#0D1A2A',sk:'#E0C8A8',ey:'#2A4A5A',ei:'#1A2A3A',ac:'#4A6A7A',bg:'rgba(20,40,50,0.18)',sh:'#2A3A4A',hs:'short'},
  // Generic personality → anime style
  bff:        {h:'#C84480',h2:'#A02860',sk:'#FFE4D4',ey:'#FF80A0',ei:'#E05080',ac:'#FF80A0',bg:'rgba(200,50,100,0.2)',sh:'#FF80A0',hs:'twin'},
  romantic:   {h:'#D090C8',h2:'#A86498',sk:'#FFEAE8',ey:'#9060C0',ei:'#703898',ac:'#D090C8',bg:'rgba(180,80,160,0.2)',sh:'#E0A0C8',hs:'long'},
  mysterious: {h:'#3A2060',h2:'#1A1040',sk:'#E0D0E8',ey:'#8040C8',ei:'#6018A8',ac:'#8040C8',bg:'rgba(50,10,100,0.25)',sh:'#1A0A3A',hs:'long'},
  mentor:     {h:'#8A7060',h2:'#5A4030',sk:'#E8D0B0',ey:'#5A7060',ei:'#3A5040',ac:'#8A9A80',bg:'rgba(70,60,40,0.18)',sh:'#4A5A50',hs:'swept'},
  flirty:     {h:'#D04080',h2:'#A02050',sk:'#FFEAE0',ey:'#E050A0',ei:'#C03080',ac:'#E050A0',bg:'rgba(190,40,90,0.2)',sh:'#E050A0',hs:'long'},
  deep:       {h:'#3048A0',h2:'#1A2878',sk:'#E0E8F8',ey:'#2858C0',ei:'#1038A0',ac:'#5080D0',bg:'rgba(30,60,180,0.2)',sh:'#1A2878',hs:'bob'},
  chaotic:    {h:'#8020C8',h2:'#5000A8',sk:'#F0D8FF',ey:'#C030C8',ei:'#A010A8',ac:'#FF40A0',bg:'rgba(130,20,200,0.22)',sh:'#5000A8',hs:'messy'},
  cool:       {h:'#909098',h2:'#707078',sk:'#D8C8B8',ey:'#4878A0',ei:'#285888',ac:'#6090B8',bg:'rgba(50,70,100,0.18)',sh:'#303848',hs:'bob'},
  hype:       {h:'#D04000',h2:'#A02000',sk:'#FFE0C0',ey:'#C03000',ei:'#A01000',ac:'#FF8000',bg:'rgba(180,60,0,0.2)',sh:'#D04000',hs:'spiky'},
  sarcastic:  {h:'#181820',h2:'#0D0D12',sk:'#E0C8A0',ey:'#3A5A40',ei:'#1A3A20',ac:'#5A7A50',bg:'rgba(15,25,15,0.2)',sh:'#1A2018',hs:'short'},
  soft:       {h:'#D0A0C0',h2:'#A870A0',sk:'#FFF0EC',ey:'#70B080',ei:'#508060',ac:'#D0A0C0',bg:'rgba(190,140,190,0.18)',sh:'#F0C0E0',hs:'long'},
};

function getAnimeStyle(companion) {
  const fp = companion.facePreset;
  if (fp && fp !== 'auto' && ANIME_STYLES[fp]) return ANIME_STYLES[fp];
  const p = (companion.personalities || ['bff'])[0];
  const vibe = companion.vibe || '';
  if (vibe === 'romantic') return ANIME_STYLES.romantic;
  if (vibe === 'mysterious') return ANIME_STYLES.mysterious;
  if (vibe === 'mentor') return ANIME_STYLES.mentor;
  return ANIME_STYLES[p] || ANIME_STYLES.bff;
}

function drawCallFace(speaking) {
  const canvas = document.getElementById('callFaceCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const c = getCurrentCompanion();
  const st = getAnimeStyle(c);
  const isMale = c.gender === 'male';

  blinkTimer++;
  if (blinkTimer > 185) eyeBlinkState = Math.max(0, eyeBlinkState - 0.32);
  if (blinkTimer > 196) { eyeBlinkState = 1; blinkTimer = 0; }
  mouthOpen = speaking
    ? 0.2 + Math.abs(Math.sin(Date.now() / 130)) * 0.8
    : Math.max(0, mouthOpen - 0.08);

  const cx = W / 2, faceY = H * 0.445;
  const faceW = W * 0.285, faceH = H * 0.246;

  // Background glow
  const bgGrad = ctx.createRadialGradient(cx, faceY, 15, cx, faceY, W * 0.62);
  bgGrad.addColorStop(0, st.bg); bgGrad.addColorStop(1, 'rgba(2,4,10,0)');
  ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, W, H);

  // Outfit gradient
  const shirtGrad = ctx.createLinearGradient(0, faceY + faceH * 0.5, 0, H);
  shirtGrad.addColorStop(0, st.sh + '00'); shirtGrad.addColorStop(0.3, st.sh + 'CC'); shirtGrad.addColorStop(1, st.sh);
  ctx.fillStyle = shirtGrad;
  ctx.beginPath();
  ctx.moveTo(0, H);
  ctx.bezierCurveTo(cx * 0.1, H * 0.87, cx - faceW * 0.7, faceY + faceH * 0.72, cx - 17, faceY + faceH * 0.58);
  ctx.lineTo(cx + 17, faceY + faceH * 0.58);
  ctx.bezierCurveTo(cx + faceW * 0.7, faceY + faceH * 0.72, cx + W * 0.9, H * 0.87, W, H);
  ctx.closePath(); ctx.fill();

  // Neck
  ctx.fillStyle = st.sk;
  ctx.beginPath(); ctx.rect(cx - 13, faceY + faceH * 0.44, 26, faceH * 0.2); ctx.fill();

  // Hair back
  _drawAnimeHairBack(ctx, cx, faceY, faceW, faceH, st, isMale, c.facePreset || 'auto', st.hs);

  // Face shape (anime: wide forehead, pointed chin)
  const drawFacePath = () => {
    ctx.beginPath();
    ctx.moveTo(cx, faceY - faceH * 0.54);
    ctx.bezierCurveTo(cx + faceW * 0.88, faceY - faceH * 0.52, cx + faceW, faceY - faceH * 0.08, cx + faceW * 0.88, faceY + faceH * 0.2);
    ctx.bezierCurveTo(cx + faceW * 0.68, faceY + faceH * 0.38, cx + faceW * 0.22, faceY + faceH * 0.54, cx, faceY + faceH * 0.58);
    ctx.bezierCurveTo(cx - faceW * 0.22, faceY + faceH * 0.54, cx - faceW * 0.68, faceY + faceH * 0.38, cx - faceW * 0.88, faceY + faceH * 0.2);
    ctx.bezierCurveTo(cx - faceW, faceY - faceH * 0.08, cx - faceW * 0.88, faceY - faceH * 0.52, cx, faceY - faceH * 0.54);
    ctx.closePath();
  };
  drawFacePath(); ctx.fillStyle = st.sk; ctx.fill();
  const sideShade = ctx.createLinearGradient(cx - faceW, faceY, cx + faceW, faceY);
  sideShade.addColorStop(0, 'rgba(0,0,0,0.08)'); sideShade.addColorStop(0.35, 'rgba(0,0,0,0)');
  sideShade.addColorStop(0.65, 'rgba(0,0,0,0)'); sideShade.addColorStop(1, 'rgba(0,0,0,0.08)');
  drawFacePath(); ctx.fillStyle = sideShade; ctx.fill();

  // Ears
  const earY = faceY + faceH * 0.02;
  [cx - faceW * 0.9, cx + faceW * 0.9].forEach((ex, i) => {
    ctx.fillStyle = st.sk;
    ctx.beginPath(); ctx.ellipse(ex, earY, faceW * 0.115, faceH * 0.175, i === 0 ? 0.08 : -0.08, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.07)';
    ctx.beginPath(); ctx.ellipse(ex + (i===0?2:-2), earY, faceW * 0.07, faceH * 0.12, 0, 0, Math.PI * 2); ctx.fill();
  });

  // Eyebrows
  const browY = faceY - faceH * 0.26;
  ctx.strokeStyle = st.h; ctx.lineWidth = isMale ? 2.5 : 2; ctx.lineCap = 'round';
  [cx - faceW * 0.3, cx + faceW * 0.3].forEach((bx, i) => {
    const s = i === 0 ? -1 : 1;
    ctx.beginPath();
    ctx.moveTo(bx - s * faceW * 0.1, browY + (isMale ? 2 : 3));
    ctx.quadraticCurveTo(bx, browY - (isMale ? 4 : 6), bx + s * faceW * 0.12, browY + 1);
    ctx.stroke();
  });

  // Eyes (large anime-style)
  const eyeY = faceY - faceH * 0.07;
  const eyeW = faceW * 0.27, eyeHt = faceH * 0.155 * eyeBlinkState;
  [cx - faceW * 0.3, cx + faceW * 0.3].forEach(ex => {
    if (eyeBlinkState < 0.15) {
      ctx.strokeStyle = st.h; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(ex - eyeW, eyeY); ctx.quadraticCurveTo(ex, eyeY - 3, ex + eyeW, eyeY); ctx.stroke();
      return;
    }
    ctx.fillStyle = '#F8F8F6';
    ctx.beginPath(); ctx.ellipse(ex, eyeY, eyeW, Math.max(1, eyeHt), 0, 0, Math.PI * 2); ctx.fill();
    ctx.save();
    ctx.beginPath(); ctx.ellipse(ex, eyeY, eyeW * 0.98, Math.max(1, eyeHt * 0.98), 0, 0, Math.PI * 2); ctx.clip();
    const irisGrad = ctx.createRadialGradient(ex, eyeY - eyeHt * 0.15, 1, ex, eyeY, eyeW * 0.88);
    irisGrad.addColorStop(0, st.ei); irisGrad.addColorStop(0.5, st.ey); irisGrad.addColorStop(1, st.ey + '80');
    ctx.fillStyle = irisGrad;
    ctx.beginPath(); ctx.ellipse(ex, eyeY, eyeW * 0.85, eyeHt * 0.98, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(5,5,10,0.85)';
    ctx.beginPath(); ctx.ellipse(ex, eyeY, eyeW * 0.32, eyeHt * 0.42, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.beginPath(); ctx.ellipse(ex + eyeW * 0.28, eyeY - eyeHt * 0.32, eyeW * 0.22, eyeHt * 0.25, 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.beginPath(); ctx.ellipse(ex - eyeW * 0.2, eyeY + eyeHt * 0.18, eyeW * 0.1, eyeHt * 0.1, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = st.h; ctx.lineWidth = 2.8; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(ex - eyeW, eyeY + eyeHt * 0.3);
    ctx.bezierCurveTo(ex - eyeW * 0.4, eyeY - eyeHt * 1.1, ex + eyeW * 0.4, eyeY - eyeHt * 1.1, ex + eyeW, eyeY + eyeHt * 0.3);
    ctx.stroke();
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(ex - eyeW * 0.85, eyeY + eyeHt * 0.7);
    ctx.bezierCurveTo(ex - eyeW * 0.3, eyeY + eyeHt * 1.12, ex + eyeW * 0.3, eyeY + eyeHt * 1.12, ex + eyeW * 0.85, eyeY + eyeHt * 0.7);
    ctx.stroke();
    if (!isMale) {
      ctx.lineWidth = 1.4;
      for (let l = -3; l <= 3; l++) {
        const lx = ex + l * eyeW * 0.3, ly = eyeY - eyeHt;
        ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + l * 1.2, ly - (Math.abs(l) < 2 ? 5 : 4)); ctx.stroke();
      }
    }
  });

  // Nose (anime: two small dots)
  const noseY = faceY + faceH * 0.12;
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  [cx - 4.5, cx + 4.5].forEach(nx => { ctx.beginPath(); ctx.ellipse(nx, noseY, 2.2, 1.8, 0, 0, Math.PI * 2); ctx.fill(); });

  // Mouth
  const mY = faceY + faceH * 0.3, mW = faceW * 0.22;
  const mOpen = Math.max(0, mouthOpen * faceH * 0.14);
  if (mouthOpen > 0.08) {
    ctx.fillStyle = '#220608';
    ctx.beginPath(); ctx.ellipse(cx, mY + mOpen * 0.45, mW * 0.78, Math.max(1, mOpen * 0.85), 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = st.ac.startsWith('#') ? st.ac + 'D0' : 'rgba(220,80,120,0.82)';
  ctx.beginPath();
  ctx.moveTo(cx - mW, mY); ctx.bezierCurveTo(cx - mW*0.5, mY-4, cx - mW*0.1, mY-5, cx, mY-3);
  ctx.bezierCurveTo(cx + mW*0.1, mY-5, cx + mW*0.5, mY-4, cx + mW, mY);
  ctx.bezierCurveTo(cx + mW*0.5, mY+1.5, cx - mW*0.5, mY+1.5, cx - mW, mY); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx - mW*0.82, mY+1); ctx.bezierCurveTo(cx - mW*0.45, mY+mOpen+5.5, cx + mW*0.45, mY+mOpen+5.5, cx + mW*0.82, mY+1);
  ctx.bezierCurveTo(cx + mW*0.45, mY+2.5, cx - mW*0.45, mY+2.5, cx - mW*0.82, mY+1); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.beginPath(); ctx.ellipse(cx, mY + mOpen*0.5 + 3, mW*0.35, 2.2, 0, 0, Math.PI*2); ctx.fill();

  // Blush
  const blushA = speaking ? 0.38 : 0.24;
  ctx.save(); ctx.filter = 'blur(5px)';
  ctx.fillStyle = `rgba(255,120,120,${blushA})`;
  [cx - faceW*0.56, cx + faceW*0.56].forEach(bx => {
    ctx.beginPath(); ctx.ellipse(bx, faceY + faceH*0.12, faceW*0.22, faceH*0.09, 0, 0, Math.PI*2); ctx.fill();
  });
  ctx.restore();

  // Hair front/bangs
  _drawAnimeHairFront(ctx, cx, faceY, faceW, faceH, st, isMale, c.facePreset || 'auto', st.hs);

  // Accessories
  _drawAnimeAccessories(ctx, cx, faceY, faceW, faceH, st, c.facePreset || 'auto');

  // Speaking ring
  if (speaking) {
    const glow = 0.3 + Math.abs(Math.sin(Date.now() / 200)) * 0.6;
    ctx.strokeStyle = st.ac + Math.floor(glow * 180).toString(16).padStart(2, '0');
    ctx.lineWidth = 7;
    ctx.beginPath(); ctx.arc(cx, faceY, W * 0.45, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = `rgba(255,255,255,${glow * 0.12})`;
    ctx.lineWidth = 14; ctx.stroke();
  }
}

export function updateCallPortrait() {
  const c = getCurrentCompanion();
  const portrait = document.getElementById('callPortrait');
  const canvas = document.getElementById('callFaceCanvas');
  const videoBg = document.querySelector('.video-bg');

  let portraitUrl = null;
  if (c.facePreset === 'custom' && c.faceCustomUrl) {
    portraitUrl = c.faceCustomUrl;
  } else {
    const preset = FACE_PRESETS.find(p => p.id === (c.facePreset || 'auto'));
    if (preset?.url) {
      portraitUrl = preset.url;
    } else if (!preset || preset.id === 'auto') {
      // Auto: derive a real photo from companion name so every AI gets a real face
      const seed = encodeURIComponent((c.name || 'ai').toLowerCase().replace(/\s+/g, '-'));
      portraitUrl = `https://i.pravatar.cc/400?u=${seed}`;
    }
  }

  if (portraitUrl) {
    const img = document.getElementById('callPortraitImg');
    img.src = portraitUrl;
    img.onerror = () => {
      portrait.style.display = 'none';
      canvas.style.display = 'block';
      videoBg?.classList.remove('portrait-mode');
      videoBg?.style.removeProperty('--portrait-bg');
      startCallFaceAnimation();
    };
    portrait.style.display = 'flex';
    canvas.style.display = 'none';
    if (videoBg) {
      videoBg.style.setProperty('--portrait-bg', `url('${portraitUrl}')`);
      videoBg.classList.add('portrait-mode');
    }
  } else {
    portrait.style.display = 'none';
    canvas.style.display = 'block';
    videoBg?.classList.remove('portrait-mode');
    videoBg?.style.removeProperty('--portrait-bg');
  }
}

export function startCallFaceAnimation() {
  const canvas = document.getElementById('callFaceCanvas');
  if (canvas.style.display === 'none') return;
  const loop = () => {
    drawCallFace(state.callSpeaking);
    callAnimFrame = requestAnimationFrame(loop);
  };
  callAnimFrame = requestAnimationFrame(loop);
}

export function stopCallFaceAnimation() {
  if (callAnimFrame) { cancelAnimationFrame(callAnimFrame); callAnimFrame = null; }
}
