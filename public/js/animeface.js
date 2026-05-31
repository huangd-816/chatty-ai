// Anime face drawing helpers (hair + accessories). Pure ctx+params drawing.
// Extracted from app.js (Phase 2).

export function _drawAnimeHairBack(ctx, cx, faceY, faceW, faceH, st, isMale, preset, hs) {
  ctx.fillStyle = st.h2;
  if (isMale) {
    if (hs === 'spiky') {
      [[-0.45,-0.85],[-0.22,-0.96],[0,-0.99],[0.22,-0.96],[0.45,-0.85]].forEach(([dx,dy]) => {
        ctx.beginPath();
        ctx.moveTo(cx + dx*faceW*0.88, faceY - faceH*0.35);
        ctx.lineTo(cx + dx*faceW*0.52, faceY + dy*faceH*0.28);
        ctx.lineTo(cx + (dx+(dx<0?0.18:-0.18))*faceW*0.82, faceY - faceH*0.35);
        ctx.closePath(); ctx.fill();
      });
    }
    ctx.beginPath(); ctx.arc(cx, faceY - faceH*0.28, faceW*0.6, Math.PI, Math.PI*2); ctx.fill();
    ctx.fillRect(cx - faceW*0.6, faceY - faceH*0.28, faceW*1.2, faceH*0.15);
  } else {
    const drawLong = () => {
      ctx.beginPath();
      ctx.moveTo(cx - faceW*0.62, faceY - faceH*0.15);
      ctx.bezierCurveTo(cx - faceW*0.88, faceY + faceH*0.3, cx - faceW*0.72, faceY + faceH*0.65, cx - faceW*0.4, faceY + faceH*0.9);
      ctx.lineTo(cx + faceW*0.4, faceY + faceH*0.9);
      ctx.bezierCurveTo(cx + faceW*0.72, faceY + faceH*0.65, cx + faceW*0.88, faceY + faceH*0.3, cx + faceW*0.62, faceY - faceH*0.15);
      ctx.closePath(); ctx.fill();
    };
    if (hs === 'twin') {
      [-1,1].forEach(s => {
        ctx.beginPath();
        ctx.moveTo(cx + s*faceW*0.45, faceY - faceH*0.2);
        ctx.bezierCurveTo(cx + s*faceW*0.8, faceY + faceH*0.15, cx + s*faceW*0.85, faceY + faceH*0.55, cx + s*faceW*0.55, faceY + faceH*0.88);
        ctx.lineTo(cx + s*faceW*0.35, faceY + faceH*0.88);
        ctx.bezierCurveTo(cx + s*faceW*0.6, faceY + faceH*0.42, cx + s*faceW*0.55, faceY + faceH*0.05, cx + s*faceW*0.22, faceY - faceH*0.2);
        ctx.closePath(); ctx.fill();
      });
    } else if (hs === 'buns') {
      [[-0.5,-0.46],[0.5,-0.46]].forEach(([dx,dy]) => {
        ctx.beginPath(); ctx.arc(cx + dx*faceW, faceY + dy*faceH, faceW*0.22, 0, Math.PI*2); ctx.fill();
      });
      drawLong();
    } else if (hs === 'bob' || hs === 'short') {
      ctx.beginPath();
      ctx.moveTo(cx - faceW*0.9, faceY - faceH*0.12);
      ctx.bezierCurveTo(cx - faceW*0.95, faceY + faceH*0.28, cx - faceW*0.72, faceY + faceH*0.5, cx - faceW*0.28, faceY + faceH*0.55);
      ctx.lineTo(cx + faceW*0.28, faceY + faceH*0.55);
      ctx.bezierCurveTo(cx + faceW*0.72, faceY + faceH*0.5, cx + faceW*0.95, faceY + faceH*0.28, cx + faceW*0.9, faceY - faceH*0.12);
      ctx.closePath(); ctx.fill();
    } else {
      drawLong();
    }
    ctx.beginPath(); ctx.arc(cx, faceY - faceH*0.3, faceW*0.6, Math.PI, Math.PI*2); ctx.fill();
  }
}

export function _drawAnimeHairFront(ctx, cx, faceY, faceW, faceH, st, isMale, preset, hs) {
  ctx.fillStyle = st.h;
  if (isMale) {
    if (hs === 'swept') {
      ctx.beginPath();
      ctx.moveTo(cx - faceW*0.6, faceY - faceH*0.48);
      ctx.bezierCurveTo(cx - faceW*0.2, faceY - faceH*0.65, cx + faceW*0.4, faceY - faceH*0.62, cx + faceW*0.6, faceY - faceH*0.48);
      ctx.bezierCurveTo(cx + faceW*0.65, faceY - faceH*0.42, cx + faceW*0.55, faceY - faceH*0.35, cx + faceW*0.35, faceY - faceH*0.35);
      ctx.bezierCurveTo(cx - faceW*0.05, faceY - faceH*0.38, cx - faceW*0.2, faceY - faceH*0.32, cx - faceW*0.38, faceY - faceH*0.35);
      ctx.bezierCurveTo(cx - faceW*0.55, faceY - faceH*0.38, cx - faceW*0.62, faceY - faceH*0.43, cx - faceW*0.6, faceY - faceH*0.48);
      ctx.closePath(); ctx.fill();
    } else if (hs === 'messy') {
      ctx.beginPath();
      ctx.moveTo(cx - faceW*0.6, faceY - faceH*0.5);
      ctx.bezierCurveTo(cx - faceW*0.4, faceY - faceH*0.68, cx - faceW*0.15, faceY - faceH*0.35, cx - faceW*0.05, faceY - faceH*0.42);
      ctx.bezierCurveTo(cx + faceW*0.1, faceY - faceH*0.35, cx + faceW*0.28, faceY - faceH*0.65, cx + faceW*0.6, faceY - faceH*0.5);
      ctx.bezierCurveTo(cx + faceW*0.65, faceY - faceH*0.42, cx + faceW*0.55, faceY - faceH*0.35, cx + faceW*0.3, faceY - faceH*0.36);
      ctx.bezierCurveTo(cx + faceW*0.05, faceY - faceH*0.38, cx - faceW*0.05, faceY - faceH*0.32, cx - faceW*0.28, faceY - faceH*0.36);
      ctx.bezierCurveTo(cx - faceW*0.5, faceY - faceH*0.4, cx - faceW*0.6, faceY - faceH*0.44, cx - faceW*0.6, faceY - faceH*0.5);
      ctx.closePath(); ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(cx - faceW*0.6, faceY - faceH*0.48);
      ctx.bezierCurveTo(cx - faceW*0.35, faceY - faceH*0.62, cx + faceW*0.2, faceY - faceH*0.63, cx + faceW*0.6, faceY - faceH*0.5);
      ctx.bezierCurveTo(cx + faceW*0.65, faceY - faceH*0.42, cx + faceW*0.5, faceY - faceH*0.35, cx + faceW*0.35, faceY - faceH*0.35);
      ctx.bezierCurveTo(cx + faceW*0.05, faceY - faceH*0.36, cx - faceW*0.05, faceY - faceH*0.3, cx - faceW*0.3, faceY - faceH*0.35);
      ctx.bezierCurveTo(cx - faceW*0.52, faceY - faceH*0.4, cx - faceW*0.6, faceY - faceH*0.43, cx - faceW*0.6, faceY - faceH*0.48);
      ctx.closePath(); ctx.fill();
    }
  } else {
    // Female bangs
    if (hs === 'twin') {
      ctx.beginPath();
      ctx.moveTo(cx - faceW*0.6, faceY - faceH*0.5);
      ctx.bezierCurveTo(cx - faceW*0.35, faceY - faceH*0.66, cx + faceW*0.1, faceY - faceH*0.68, cx + faceW*0.55, faceY - faceH*0.55);
      ctx.bezierCurveTo(cx + faceW*0.62, faceY - faceH*0.5, cx + faceW*0.62, faceY - faceH*0.38, cx + faceW*0.5, faceY - faceH*0.33);
      ctx.bezierCurveTo(cx + faceW*0.22, faceY - faceH*0.3, cx - faceW*0.08, faceY - faceH*0.27, cx - faceW*0.22, faceY - faceH*0.3);
      ctx.bezierCurveTo(cx - faceW*0.42, faceY - faceH*0.34, cx - faceW*0.6, faceY - faceH*0.44, cx - faceW*0.6, faceY - faceH*0.5);
      ctx.closePath(); ctx.fill();
    } else if (hs === 'braids') {
      // Braids: simple straight bangs
      ctx.beginPath();
      ctx.moveTo(cx - faceW*0.62, faceY - faceH*0.5);
      ctx.bezierCurveTo(cx - faceW*0.38, faceY - faceH*0.66, cx + faceW*0.12, faceY - faceH*0.68, cx + faceW*0.58, faceY - faceH*0.52);
      ctx.bezierCurveTo(cx + faceW*0.64, faceY - faceH*0.45, cx + faceW*0.62, faceY - faceH*0.34, cx + faceW*0.48, faceY - faceH*0.3);
      ctx.bezierCurveTo(cx + faceW*0.22, faceY - faceH*0.28, cx - faceW*0.2, faceY - faceH*0.28, cx - faceW*0.45, faceY - faceH*0.31);
      ctx.bezierCurveTo(cx - faceW*0.6, faceY - faceH*0.36, cx - faceW*0.64, faceY - faceH*0.43, cx - faceW*0.62, faceY - faceH*0.5);
      ctx.closePath(); ctx.fill();
      // Side braids
      ctx.fillStyle = st.h2;
      [-1,1].forEach(s => {
        ctx.beginPath();
        ctx.moveTo(cx + s*faceW*0.38, faceY - faceH*0.3);
        ctx.bezierCurveTo(cx + s*faceW*0.5, faceY + faceH*0.1, cx + s*faceW*0.5, faceY + faceH*0.4, cx + s*faceW*0.42, faceY + faceH*0.7);
        ctx.lineTo(cx + s*faceW*0.3, faceY + faceH*0.7);
        ctx.bezierCurveTo(cx + s*faceW*0.38, faceY + faceH*0.35, cx + s*faceW*0.38, faceY + faceH*0.05, cx + s*faceW*0.26, faceY - faceH*0.3);
        ctx.closePath(); ctx.fill();
      });
      ctx.fillStyle = st.h;
    } else {
      // Long/bob/short/default female bangs
      ctx.beginPath();
      ctx.moveTo(cx - faceW*0.62, faceY - faceH*0.5);
      ctx.bezierCurveTo(cx - faceW*0.35, faceY - faceH*0.67, cx + faceW*0.05, faceY - faceH*0.7, cx + faceW*0.52, faceY - faceH*0.58);
      ctx.bezierCurveTo(cx + faceW*0.62, faceY - faceH*0.52, cx + faceW*0.62, faceY - faceH*0.38, cx + faceW*0.5, faceY - faceH*0.33);
      ctx.bezierCurveTo(cx + faceW*0.22, faceY - faceH*0.3, cx + faceW*0.05, faceY - faceH*0.26, cx - faceW*0.05, faceY - faceH*0.3);
      ctx.bezierCurveTo(cx - faceW*0.2, faceY - faceH*0.32, cx - faceW*0.42, faceY - faceH*0.34, cx - faceW*0.62, faceY - faceH*0.5);
      ctx.closePath(); ctx.fill();
    }
  }
}

export function _drawAnimeAccessories(ctx, cx, faceY, faceW, faceH, st, preset) {
  // Horns (Zero Two)
  if (preset === 'ca_zero2') {
    ctx.fillStyle = '#FF4060';
    [[-0.35,-0.62],[0.35,-0.62]].forEach(([dx,dy]) => {
      ctx.beginPath();
      ctx.moveTo(cx + dx*faceW, faceY + dy*faceH);
      ctx.bezierCurveTo(cx + (dx-0.06)*faceW, faceY + (dy-0.28)*faceH, cx + (dx+0.06)*faceW, faceY + (dy-0.28)*faceH, cx + dx*faceW, faceY + (dy-0.04)*faceH);
      ctx.closePath(); ctx.fill();
    });
  }
  // Fox ears (Ahri)
  if (preset === 'ca_ahri') {
    ctx.fillStyle = st.h;
    [-1,1].forEach(s => {
      ctx.beginPath();
      ctx.moveTo(cx + s*faceW*0.58, faceY - faceH*0.5);
      ctx.lineTo(cx + s*faceW*0.78, faceY - faceH*0.82); ctx.lineTo(cx + s*faceW*0.38, faceY - faceH*0.55);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#FFB0B0';
      ctx.beginPath();
      ctx.moveTo(cx + s*faceW*0.58, faceY - faceH*0.52);
      ctx.lineTo(cx + s*faceW*0.74, faceY - faceH*0.77); ctx.lineTo(cx + s*faceW*0.42, faceY - faceH*0.56);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = st.h;
    });
  }
  // Devil horns (Power)
  if (preset === 'ca_power') {
    ctx.fillStyle = st.h;
    [[-0.28,-0.54],[0.28,-0.54]].forEach(([dx,dy]) => {
      ctx.beginPath();
      ctx.moveTo(cx + dx*faceW, faceY + dy*faceH);
      ctx.lineTo(cx + (dx-0.06)*faceW, faceY + (dy-0.22)*faceH);
      ctx.lineTo(cx + (dx+0.06)*faceW, faceY + (dy-0.22)*faceH);
      ctx.closePath(); ctx.fill();
    });
  }
  // Cat ears (Nyanko)
  if (preset === 'ca_nyanko') {
    ctx.fillStyle = st.h;
    [[-0.45,-0.62],[0.45,-0.62]].forEach(([dx,dy]) => {
      ctx.beginPath();
      ctx.moveTo(cx + dx*faceW, faceY + dy*faceH);
      ctx.lineTo(cx + (dx-0.1)*faceW, faceY + (dy-0.28)*faceH);
      ctx.lineTo(cx + (dx+0.1)*faceW, faceY + (dy-0.28)*faceH);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(255,160,160,0.5)';
      ctx.beginPath();
      ctx.moveTo(cx + dx*faceW, faceY + (dy-0.01)*faceH);
      ctx.lineTo(cx + (dx-0.06)*faceW, faceY + (dy-0.2)*faceH);
      ctx.lineTo(cx + (dx+0.06)*faceW, faceY + (dy-0.2)*faceH);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = st.h;
    });
    // Whiskers
    ctx.strokeStyle = 'rgba(100,80,60,0.45)'; ctx.lineWidth = 1;
    const nY = faceY + faceH*0.12;
    [-1,1].forEach(s => {
      [0.06,0.1,0.14].forEach(dy => {
        ctx.beginPath(); ctx.moveTo(cx + s*faceW*0.08, nY + dy*faceH); ctx.lineTo(cx + s*faceW*0.3, nY + dy*faceH); ctx.stroke();
      });
    });
  }
  // Blindfold (Gojo, 2B)
  if (preset === 'ca_gojo' || preset === 'ca_2b') {
    const eyeY = faceY - faceH*0.07;
    ctx.fillStyle = 'rgba(5,5,10,0.9)';
    ctx.beginPath(); ctx.rect(cx - faceW*0.88, eyeY - faceH*0.2, faceW*1.76, faceH*0.22); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.rect(cx - faceW*0.88, eyeY - faceH*0.2, faceW*1.76, faceH*0.22); ctx.stroke();
  }
  // Glasses (Nanami, Kyoya)
  if (preset === 'ca_nanami' || preset === 'ca_kyoya') {
    const eyeY = faceY - faceH*0.07;
    ctx.strokeStyle = st.h2; ctx.lineWidth = 1.8; ctx.fillStyle = 'rgba(255,255,255,0.04)';
    [cx - faceW*0.3, cx + faceW*0.3].forEach(ex => {
      ctx.beginPath(); ctx.ellipse(ex, eyeY, faceW*0.28, faceH*0.178, 0, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    });
    ctx.beginPath(); ctx.moveTo(cx - faceW*0.02, eyeY); ctx.lineTo(cx + faceW*0.02, eyeY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx - faceW*0.58, eyeY - faceH*0.05); ctx.lineTo(cx - faceW*0.3 - faceW*0.28, eyeY); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + faceW*0.58, eyeY - faceH*0.05); ctx.lineTo(cx + faceW*0.3 + faceW*0.28, eyeY); ctx.stroke();
  }
  // Bamboo mouthpiece (Nezuko)
  if (preset === 'ca_nezuko') {
    const mY = faceY + faceH*0.3;
    ctx.fillStyle = '#4A7028';
    ctx.beginPath(); ctx.rect(cx - faceW*0.28, mY - 4, faceW*0.56, 10); ctx.fill();
    ctx.fillStyle = '#6A9038';
    ctx.beginPath(); ctx.rect(cx - faceW*0.26, mY - 3, faceW*0.52, 4); ctx.fill();
  }
  // Itachi under-eye marks
  if (preset === 'ca_itachi') {
    const eyeY = faceY - faceH*0.07;
    ctx.fillStyle = st.ac;
    [[cx - faceW*0.3, 1],[cx + faceW*0.3, -1]].forEach(([ex]) => {
      [faceH*0.12, faceH*0.18].forEach(dy => { ctx.fillRect(ex - 2.5, eyeY + dy, 5, 2); });
    });
  }
  // Sukuna facial tattoos
  if (preset === 'ca_sukuna') {
    ctx.strokeStyle = st.ac; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(cx - faceW*0.6, faceY - faceH*0.1); ctx.lineTo(cx - faceW*0.2, faceY + faceH*0.05); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + faceW*0.6, faceY - faceH*0.1); ctx.lineTo(cx + faceW*0.2, faceY + faceH*0.05); ctx.stroke();
  }
  // Freckles (Deku)
  if (preset === 'ca_deku') {
    ctx.fillStyle = 'rgba(180,100,60,0.35)';
    [[-0.32,0.06],[-0.2,0.1],[0.2,0.06],[0.32,0.1],[-0.4,0.15],[0.4,0.15]].forEach(([dx,dy]) => {
      ctx.beginPath(); ctx.arc(cx + dx*faceW, faceY + dy*faceH, 2.5, 0, Math.PI*2); ctx.fill();
    });
  }
  // Mask (Kakashi)
  if (preset === 'ca_kakashi') {
    ctx.fillStyle = '#CACACA';
    ctx.beginPath();
    ctx.moveTo(cx - faceW*0.55, faceY + faceH*0.08);
    ctx.bezierCurveTo(cx - faceW*0.64, faceY + faceH*0.14, cx - faceW*0.64, faceY + faceH*0.45, cx - faceW*0.4, faceY + faceH*0.58);
    ctx.bezierCurveTo(cx - faceW*0.15, faceY + faceH*0.64, cx + faceW*0.15, faceY + faceH*0.64, cx + faceW*0.4, faceY + faceH*0.58);
    ctx.bezierCurveTo(cx + faceW*0.64, faceY + faceH*0.45, cx + faceW*0.64, faceY + faceH*0.14, cx + faceW*0.55, faceY + faceH*0.08);
    ctx.bezierCurveTo(cx + faceW*0.3, faceY + faceH*0.02, cx - faceW*0.3, faceY + faceH*0.02, cx - faceW*0.55, faceY + faceH*0.08);
    ctx.closePath(); ctx.fill();
  }
  // Eye scar (Zoro)
  if (preset === 'ca_zoro') {
    ctx.strokeStyle = 'rgba(180,80,80,0.62)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(cx - faceW*0.42, faceY - faceH*0.28); ctx.lineTo(cx - faceW*0.22, faceY + faceH*0.12); ctx.stroke();
  }
  // Under-eye scar (Luffy)
  if (preset === 'ca_luffy') {
    ctx.strokeStyle = 'rgba(180,80,80,0.68)'; ctx.lineWidth = 1.8;
    const eyeY = faceY - faceH*0.07;
    ctx.beginPath(); ctx.moveTo(cx - faceW*0.3, eyeY + faceH*0.12); ctx.lineTo(cx - faceW*0.24, eyeY + faceH*0.22); ctx.stroke();
  }
  // Hat brim (Chuuya)
  if (preset === 'ca_chuuya') {
    ctx.fillStyle = st.h2;
    ctx.beginPath(); ctx.ellipse(cx, faceY - faceH*0.56, faceW*0.72, faceH*0.06, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = st.h;
    ctx.beginPath(); ctx.ellipse(cx, faceY - faceH*0.58, faceW*0.5, faceH*0.14, 0, 0, Math.PI*2); ctx.fill();
  }
  // Flower hairpin (Yor)
  if (preset === 'ca_yor') {
    const px = cx - faceW*0.55, py = faceY - faceH*0.38;
    ctx.fillStyle = st.ac;
    for (let a = 0; a < Math.PI*2; a += Math.PI/3) {
      ctx.beginPath(); ctx.ellipse(px + Math.cos(a)*5, py + Math.sin(a)*5, 4, 3, a, 0, Math.PI*2); ctx.fill();
    }
    ctx.fillStyle = '#FFE080';
    ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI*2); ctx.fill();
  }
  // Hair clip (Toga, Nijika)
  if (preset === 'ca_toga' || preset === 'ca_nijika') {
    ctx.fillStyle = st.ac;
    ctx.beginPath(); ctx.rect(cx - faceW*0.5, faceY - faceH*0.42, 10, 5); ctx.fill();
  }
}



