/* ═══════════════════════════════════════════════════════════════════
   D&D 5e — Ficha de Personagem  |  Vanilla JS
   ═══════════════════════════════════════════════════════════════════ */

/* ─── DEFAULT DATA ────────────────────────────────────────────────── */
const DEFAULT_SHEET = {
  name:       'nome do personagem',
  class:      'Bárbaro',
  level:      1,
  race:       'Anão',
  player:     'Nome do Jogador',
  background: 'Herói do Povo',
  alignment:  'Caótico e Neutro',
  ac:         15,
  speed:      '9',
  hitDiceCurrent: '1',
  hitDiceTotal:   '1d12',
  hp: { current: 15, max: 15, temp: 0 },
  deathSaves: { successes: [false, false, false], failures: [false, false, false] },
  stats: { str: 18, des: 12, con: 16, int: 8, sab: 10, car: 8 },
  saveProfs:  { str: true, des: false, con: true, int: false, sab: false, car: false },
  skills: {
    acrobatics:      { prof: false, stat: 'des', name: 'Acrobacia' },
    animal_handling: { prof: false, stat: 'sab', name: 'Adestrar Animais' },
    arcana:          { prof: false, stat: 'int', name: 'Arcanismo' },
    athletics:       { prof: true,  stat: 'str', name: 'Atletismo' },
    deception:       { prof: false, stat: 'car', name: 'Enganação' },
    history:         { prof: false, stat: 'int', name: 'História' },
    insight:         { prof: false, stat: 'sab', name: 'Intuição' },
    intimidation:    { prof: true,  stat: 'car', name: 'Intimidação' },
    investigation:   { prof: false, stat: 'int', name: 'Investigação' },
    medicine:        { prof: false, stat: 'sab', name: 'Medicina' },
    nature:          { prof: false, stat: 'int', name: 'Natureza' },
    perception:      { prof: false, stat: 'sab', name: 'Percepção' },
    performance:     { prof: false, stat: 'car', name: 'Atuação' },
    persuasion:      { prof: false, stat: 'car', name: 'Persuasão' },
    religion:        { prof: false, stat: 'int', name: 'Religião' },
    sleight_of_hand: { prof: false, stat: 'des', name: 'Prestidigitação' },
    stealth:         { prof: false, stat: 'des', name: 'Furtividade' },
    survival:        { prof: true,  stat: 'sab', name: 'Sobrevivência' },
  },
  weapons: [
    { name: 'Machado de Batalha de Uma Mão', bonusAtk: '+6', damage: '1d8+4', damageType: 'Cortante', id: 1 },
    { name: 'Machadinha (Arremessável)',      bonusAtk: '+6', damage: '1d6+4', damageType: 'Cortante', id: 2 },
  ],
  equipment:    'Armadura de Couro Batido, Machado de Batalha, 2x Machadinhas, Mochila de Explorador, Rações de Viagem, Saco de Dormir.',
  profAndLangs: 'Idiomas: Comum, Anão.\nProficiência em Ferramentas de Pedreiro.\nArmas Simples e Marciais.',
  features:     'FÚRIA (2x ao dia):\nVantagem em testes de Força e salvamentos de Força. Bônus de dano +2. Resistência a dano de concussão, cortante e perfurante.\n\nDEFESA SEM ARMADURA:\nCA = 10 + Mod DES + Mod CON.\n\nRESILIÊNCIA ANÃ:\nVantagem contra venenos e resistência a dano de veneno.',
  coins: { pc: 0, pp: 0, pe: 0, po: 15, pl: 0 },
};

let sheet       = JSON.parse(JSON.stringify(DEFAULT_SHEET));
let rollHistory = [];

/* ─── HELPERS ─────────────────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const setVal = (id, v) => { const el = $(id); if (el) el.value = v; };

/* ─── AUDIO ───────────────────────────────────────────────────────── */
function playDiceSound() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    for (let i = 0; i < 4; i++) {
      const delay = i * 0.12;
      const osc   = ctx.createOscillator();
      const gain  = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(100 + Math.random() * 80, ctx.currentTime + delay);
      osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + delay + 0.08);
      gain.gain.setValueAtTime(0.15, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.08);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay); osc.stop(ctx.currentTime + delay + 0.08);
    }
  } catch (_) {}
}

/* ─── STORAGE ─────────────────────────────────────────────────────── */
function saveSheet() {
  localStorage.setItem('rpg_sheet', JSON.stringify(sheet));
}
function loadSheet() {
  const raw = localStorage.getItem('rpg_sheet');
  if (raw) {
    try { sheet = { ...DEFAULT_SHEET, ...JSON.parse(raw) }; }
    catch { sheet = JSON.parse(JSON.stringify(DEFAULT_SHEET)); }
  } else {
    sheet = JSON.parse(JSON.stringify(DEFAULT_SHEET));
  }
  renderAll();
}

/* ─── RENDER ALL ──────────────────────────────────────────────────── */
function renderAll() {
  setVal('char-name',      sheet.name);
  setVal('char-class',     sheet.class);
  setVal('char-level',     sheet.level);
  setVal('char-race',      sheet.race);
  setVal('char-player',    sheet.player);
  setVal('char-background',sheet.background);
  setVal('char-alignment', sheet.alignment);
  setVal('combat-ac',      sheet.ac);
  setVal('combat-speed',   sheet.speed);
  setVal('combat-hitdice-current', sheet.hitDiceCurrent);
  setVal('combat-hitdice-total',   sheet.hitDiceTotal);

  for (const s in sheet.stats)    setVal(`val-${s}`, sheet.stats[s]);
  setVal('coin-pc', sheet.coins.pc);
  setVal('coin-pp', sheet.coins.pp);
  setVal('coin-pe', sheet.coins.pe);
  setVal('coin-po', sheet.coins.po);
  setVal('coin-pl', sheet.coins.pl);

  setVal('equipment-text',  sheet.equipment);
  setVal('prof-langs-text', sheet.profAndLangs);
  setVal('features-text',   sheet.features);

  setVal('hp-current', sheet.hp.current);
  setVal('hp-max',     sheet.hp.max);
  setVal('hp-temp',    sheet.hp.temp || 0);

  for (const s in sheet.saveProfs) {
    const cb = $(`save-prof-${s}`);
    if (cb) { cb.checked = sheet.saveProfs[s]; syncSaveDot(s, cb.checked); }
  }
  for (let i = 1; i <= 3; i++) {
    const ds = $(`death-success-${i}`), df = $(`death-fail-${i}`);
    if (ds) ds.checked = sheet.deathSaves.successes[i - 1];
    if (df) df.checked = sheet.deathSaves.failures[i - 1];
  }
  recalcAll();
}

/* ─── RECALC ──────────────────────────────────────────────────────── */
function recalcAll() {
  const level = parseInt(sheet.level) || 1;
  const prof  = Math.ceil(level / 4) + 1;
  const pb = $('prof-bonus'); if (pb) pb.textContent = `+${prof}`;

  const mods = {};
  for (const s in sheet.stats) {
    const val = parseInt(sheet.stats[s]) || 10;
    const mod = Math.floor((val - 10) / 2);
    mods[s]   = mod;
    const el  = $(`mod-${s}`);
    if (el) el.textContent = `${mod >= 0 ? '+' : ''}${mod}`;
  }

  const ci = $('combat-init');
  if (ci) ci.textContent = `${mods.des >= 0 ? '+' : ''}${mods.des}`;

  for (const s in sheet.saveProfs) {
    let total = mods[s];
    if (sheet.saveProfs[s]) total += prof;
    const el = $(`save-val-${s}`);
    if (el) el.textContent = `${total >= 0 ? '+' : ''}${total}`;
  }

  const cur  = parseInt(sheet.hp.current) || 0;
  const max  = parseInt(sheet.hp.max) || 1;
  const temp = parseInt(sheet.hp.temp) || 0;
  const pct  = Math.min(100, Math.max(0, ((cur + temp) / max) * 100));
  const bar  = $('hp-bar'); if (bar) bar.style.width = `${pct}%`;

  renderSkills(mods, prof);
  renderWeapons();
}

function syncSaveDot(stat, checked) {
  const dot = $(`sdot-${stat}`);
  if (!dot) return;
  if (checked) {
    dot.classList.add('active');
  } else {
    dot.classList.remove('active');
  }
}

/* ─── SKILLS ──────────────────────────────────────────────────────── */
function renderSkills(mods, prof) {
  const container = $('skills-list');
  if (!container) return;
  container.innerHTML = '';

  for (const key in sheet.skills) {
    const sk    = sheet.skills[key];
    const total = (mods[sk.stat] || 0) + (sk.prof ? prof : 0);
    const sign  = total >= 0 ? '+' : '';

    const row = document.createElement('div');
    row.className = 'skill-row';
    row.innerHTML = `
      <div class="skill-row-left">
        <span class="prof-dot ${sk.prof ? 'active' : ''}" id="skdot-${key}" data-key="${key}" title="Clique para proficiência"></span>
        <button class="skill-btn" data-name="${sk.name}" data-total="${total}" data-stat="${sk.stat.toUpperCase()}">
          ${sk.name}<span class="skill-attr">(${sk.stat.toUpperCase()})</span>
        </button>
      </div>
      <span style="font-family:'Cinzel',serif;font-weight:700;color:#d4a843;font-size:.75rem;">${sign}${total}</span>
    `;

    // Toggle prof on dot click
    row.querySelector('.prof-dot').addEventListener('click', () => {
      sheet.skills[key].prof = !sheet.skills[key].prof;
      saveSheet(); recalcAll();
    });
    // Roll on button click
    row.querySelector('.skill-btn').addEventListener('click', () => {
      rollSkill(sk.name, total, sk.stat.toUpperCase());
    });

    container.appendChild(row);
  }
}

/* ─── WEAPONS ─────────────────────────────────────────────────────── */
function renderWeapons() {
  const container = $('weapons-list');
  if (!container) return;
  container.innerHTML = '';

  if (!sheet.weapons.length) {
    container.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#64718f;padding:16px;font-style:italic;font-size:.75rem;">Nenhuma arma adicionada.</td></tr>`;
    return;
  }

  sheet.weapons.forEach((w, i) => {
    const tr = document.createElement('tr');
    tr.className = 'weapon-row';
    tr.innerHTML = `
      <td style="padding:8px 4px;">
        <div style="display:flex;align-items:center;gap:6px;">
          <button class="btn-del-weapon" data-idx="${i}" style="color:#ef4444;font-size:.65rem;opacity:.5;background:none;border:none;padding:0;cursor:pointer;transition:opacity .15s;">✕</button>
          <input value="${w.name}" class="weapon-input" style="font-size:.75rem;width:100%;" data-idx="${i}" data-field="name">
        </div>
      </td>
      <td style="padding:8px 4px;text-align:center;">
        <input value="${w.bonusAtk}" class="weapon-input" style="font-size:.75rem;font-weight:700;width:40px;text-align:center;color:#d4a843;" data-idx="${i}" data-field="bonusAtk">
      </td>
      <td style="padding:8px 4px;text-align:center;">
        <div style="display:flex;align-items:center;justify-content:center;gap:4px;">
          <input value="${w.damage}" class="weapon-input" style="font-size:.75rem;font-weight:700;width:52px;text-align:center;" data-idx="${i}" data-field="damage">
          <input value="${w.damageType}" class="weapon-input" style="font-size:.65rem;width:52px;text-align:center;color:#64718f;" data-idx="${i}" data-field="damageType">
        </div>
      </td>
      <td style="padding:8px 4px;text-align:right;">
        <div style="display:flex;justify-content:flex-end;gap:4px;">
          <button class="btn-gold btn-atk" data-name="${w.name}" data-bonus="${w.bonusAtk}" style="padding:3px 8px;">Atacar</button>
          <button class="btn-green btn-dmg" data-name="${w.name}" data-formula="${w.damage}" style="padding:3px 8px;">Dano</button>
        </div>
      </td>
    `;

    // Events
    tr.querySelector('.btn-del-weapon').addEventListener('click', () => {
      sheet.weapons.splice(i, 1); saveSheet(); recalcAll();
    });
    tr.querySelectorAll('.weapon-input').forEach(inp => {
      inp.addEventListener('change', e => {
        const idx   = parseInt(e.target.dataset.idx);
        const field = e.target.dataset.field;
        sheet.weapons[idx][field] = e.target.value;
        saveSheet();
      });
    });
    tr.querySelector('.btn-atk').addEventListener('click', () => rollWeaponAtk(w.name, w.bonusAtk));
    tr.querySelector('.btn-dmg').addEventListener('click', () => rollWeaponDamage(w.name, w.damage));

    container.appendChild(tr);
  });
}

/* ─── STATE MUTATIONS ─────────────────────────────────────────────── */
function updateData(key, value)   { sheet[key] = value; saveSheet(); }
function updateLevel(val)         { sheet.level = parseInt(val) || 1; saveSheet(); recalcAll(); }
function updateCoin(key, val)     { sheet.coins[key] = parseInt(val) || 0; saveSheet(); }
function calcModifier(stat) {
  sheet.stats[stat] = parseInt($(`val-${stat}`)?.value) || 10;
  saveSheet(); recalcAll();
}
function updateSaveProfs() {
  for (const s in sheet.saveProfs) {
    const cb = $(`save-prof-${s}`);
    if (cb) { sheet.saveProfs[s] = cb.checked; syncSaveDot(s, cb.checked); }
  }
  saveSheet(); recalcAll();
}
function updateHP() {
  sheet.hp.current = parseInt($('hp-current')?.value) || 0;
  sheet.hp.max     = parseInt($('hp-max')?.value) || 1;
  sheet.hp.temp    = parseInt($('hp-temp')?.value) || 0;
  saveSheet(); recalcAll();
}
function modifyHP(amount) {
  const cur = parseInt($('hp-current')?.value) || 0;
  const max = parseInt($('hp-max')?.value) || 1;
  const hp  = $('hp-current');
  if (hp) hp.value = Math.min(max, Math.max(0, cur + amount));
  updateHP();
}
function updateDeathSaves() {
  for (let i = 1; i <= 3; i++) {
    const ds = $(`death-success-${i}`), df = $(`death-fail-${i}`);
    if (ds) sheet.deathSaves.successes[i - 1] = ds.checked;
    if (df) sheet.deathSaves.failures[i - 1]  = df.checked;
  }
  saveSheet();
}
function addWeapon() {
  sheet.weapons.push({ name: 'Nova Arma', bonusAtk: '+0', damage: '1d6', damageType: 'Dano', id: Date.now() });
  saveSheet(); recalcAll();
}

/* ─── ROLLING ENGINE ──────────────────────────────────────────────── */
function executeRollAnimation(label, modifier, callback) {
  playDiceSound();
  const dg    = $('dice-graphic');
  const rv    = $('dice-result-val');
  const scene = $('dice-scene');
  if (!dg || !rv) return;
  scene?.classList.remove('dice-crit-glow', 'dice-fail-glow');
  dg.classList.remove('rolling-dice');
  void dg.offsetWidth; // reflow
  dg.classList.add('rolling-dice');

  let spins = 0;
  const intv = setInterval(() => {
    rv.textContent = Math.floor(Math.random() * 20) + 1;
    if (++spins > 6) { clearInterval(intv); callback(); }
  }, 70);
}

function spawnSparks(container) {
  for (let i = 0; i < 8; i++) {
    const sp    = document.createElement('div');
    sp.className = 'crit-spark';
    const angle = (i / 8) * Math.PI * 2;
    const dist  = 40 + Math.random() * 30;
    sp.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
    sp.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
    sp.style.left = '50%'; sp.style.top = '50%';
    sp.style.marginLeft = '-3px'; sp.style.marginTop = '-3px';
    sp.style.background = `hsl(${40 + Math.random() * 20},90%,65%)`;
    container.appendChild(sp);
    setTimeout(() => sp.remove(), 900);
  }
}

function addLogEntry(title, formula, total, naturalRoll) {
  const list = $('roll-log-list');
  if (!list) return;
  const ts      = new Date().toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
  const isCrit  = naturalRoll === 20;
  const isFail  = naturalRoll === 1;
  const natColor= isCrit ? '#10b981' : isFail ? '#ef4444' : '#64718f';
  const bonus   = isCrit ? ' ✦ Crítico!' : isFail ? ' ✕ Falha!' : '';
  const scene   = $('dice-scene');

  if (isCrit) { scene?.classList.add('dice-crit-glow'); spawnSparks(scene); }
  if (isFail)   scene?.classList.add('dice-fail-glow');

  // Remove empty state
  const empty = list.querySelector('.log-empty');
  if (empty) empty.remove();

  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.style.cssText = `background:rgba(5,7,14,.7);border:1px solid ${isCrit ? 'rgba(16,185,129,.22)' : isFail ? 'rgba(239,68,68,.22)' : 'rgba(212,168,67,.1)'};border-radius:8px;padding:7px 9px;`;
  entry.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <span style="font-family:'Cinzel',serif;font-weight:700;color:#d4a843;font-size:.58rem;letter-spacing:.09em;text-transform:uppercase;">${title}</span>
      <span style="font-size:.55rem;color:#64718f;">${ts}</span>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:3px;">
      <span style="font-size:.62rem;color:#64718f;font-style:italic;">${formula}
        <span style="color:${natColor};font-weight:700;"> [d20:${naturalRoll}${bonus}]</span>
      </span>
      <span style="font-family:'Cinzel',serif;font-weight:900;color:${isCrit ? '#10b981' : isFail ? '#ef4444' : '#dde4f0'};font-size:.9rem;">${total}</span>
    </div>
  `;
  list.insertAdjacentElement('afterbegin', entry);
  rollHistory.unshift({ title, formula, total, naturalRoll });
  showToast(title, total, formula, naturalRoll);
}

function showToast(title, total, formula, naturalRoll) {
  const toast  = $('dice-toast');
  if (!toast)  return;
  const isCrit = naturalRoll === 20, isFail = naturalRoll === 1;

  $('toast-dice-result').textContent  = naturalRoll;
  $('toast-dice-title').textContent   = title;
  $('toast-dice-total').textContent   = `Total: ${total}`;
  $('toast-dice-formula').textContent = formula;

  $('toast-dice-result').style.background  = isCrit ? 'rgba(16,185,129,.2)' : isFail ? 'rgba(239,68,68,.2)' : 'rgba(212,168,67,.15)';
  $('toast-dice-result').style.borderColor = isCrit ? 'rgba(16,185,129,.5)' : isFail ? 'rgba(239,68,68,.5)' : 'rgba(212,168,67,.4)';
  $('toast-dice-result').style.color       = isCrit ? '#10b981' : isFail ? '#ef4444' : '#d4a843';
  $('toast-dice-total').style.color        = isCrit ? '#10b981' : isFail ? '#ef4444' : '#10b981';

  toast.classList.add('visible');
  clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => {
    toast.classList.remove('visible');
  }, 4200);
}

function updateDiceDisplay(label, roll, total, formula) {
  const rv = $('dice-result-val');
  const dl = $('dice-label');
  const dt = $('dice-roll-total');
  const df = $('dice-formula');
  if (rv) rv.textContent = roll;
  if (dl) dl.textContent = label;
  if (dt) { dt.textContent = `Total: ${total}`; dt.classList.remove('hidden'); }
  if (df) { df.textContent = formula;            df.classList.remove('hidden'); }
}

/* ─── ROLL TYPES ──────────────────────────────────────────────────── */
function rollStat(statName, statKey) {
  const mod = Math.floor(((parseInt(sheet.stats[statKey]) || 10) - 10) / 2);
  const sign = mod >= 0 ? '+' : '';
  executeRollAnimation(statName, mod, () => {
    const roll = Math.floor(Math.random() * 20) + 1, total = roll + mod;
    updateDiceDisplay(statName, roll, total, `1d20 ${sign} ${mod} (${statName})`);
    addLogEntry(`Atributo: ${statName}`, `1d20 ${sign}${mod}`, total, roll);
  });
}

function rollSave(statName, statKey) {
  const mod  = Math.floor(((parseInt(sheet.stats[statKey]) || 10) - 10) / 2);
  const prof = Math.ceil((parseInt(sheet.level) || 1) / 4) + 1;
  const tot  = mod + (sheet.saveProfs[statKey] ? prof : 0);
  const sign = tot >= 0 ? '+' : '';
  executeRollAnimation(`Salvamento ${statName}`, tot, () => {
    const roll = Math.floor(Math.random() * 20) + 1, total = roll + tot;
    updateDiceDisplay(`Salvar ${statName}`, roll, total, `1d20 ${sign} ${tot}`);
    addLogEntry(`Salvamento: ${statName}`, `1d20 ${sign}${tot}`, total, roll);
  });
}

function rollSkill(skillName, bonusValue, attr) {
  const sign = bonusValue >= 0 ? '+' : '';
  executeRollAnimation(`Perícia ${skillName}`, bonusValue, () => {
    const roll = Math.floor(Math.random() * 20) + 1, total = roll + bonusValue;
    updateDiceDisplay(skillName, roll, total, `1d20 ${sign} ${bonusValue} (${attr})`);
    addLogEntry(`Perícia: ${skillName}`, `1d20 ${sign}${bonusValue}`, total, roll);
  });
}

function rollInitiative() {
  const mod  = Math.floor(((parseInt(sheet.stats.des) || 10) - 10) / 2);
  const sign = mod >= 0 ? '+' : '';
  executeRollAnimation('Iniciativa', mod, () => {
    const roll = Math.floor(Math.random() * 20) + 1, total = roll + mod;
    updateDiceDisplay('Iniciativa', roll, total, `1d20 ${sign} ${mod} (Iniciativa)`);
    addLogEntry('Iniciativa', `1d20 ${sign}${mod}`, total, roll);
  });
}

function rollHitDice() {
  playDiceSound();
  const dg    = $('dice-graphic');
  const scene = $('dice-scene');
  if (!dg) return;
  scene?.classList.remove('dice-crit-glow', 'dice-fail-glow');
  dg.classList.remove('rolling-dice'); void dg.offsetWidth; dg.classList.add('rolling-dice');
  const rv = $('dice-result-val');
  let spins = 0;
  const intv = setInterval(() => {
    if (rv) rv.textContent = Math.floor(Math.random() * 12) + 1;
    if (++spins > 6) {
      clearInterval(intv);
      const roll   = Math.floor(Math.random() * 12) + 1;
      const modCon = Math.floor(((parseInt(sheet.stats.con) || 10) - 10) / 2);
      const total  = roll + modCon;
      updateDiceDisplay('Dados de Vida (d12)', roll, total, `1d12 + ${modCon} (CON)`);
      addLogEntry('Dado de Vida (d12)', `1d12 + ${modCon}`, total, roll);
    }
  }, 70);
}

function rollWeaponAtk(weaponName, bonusText) {
  const bonus = parseInt(bonusText.replace('+', '')) || 0;
  const sign  = bonus >= 0 ? '+' : '';
  executeRollAnimation(`${weaponName} (Ataque)`, bonus, () => {
    const roll = Math.floor(Math.random() * 20) + 1, total = roll + bonus;
    updateDiceDisplay(`Ataque ${weaponName}`, roll, `Total Atq: ${total}`, `1d20 ${sign} ${bonus}`);
    addLogEntry(`Ataque: ${weaponName}`, `1d20 ${sign}${bonus}`, total, roll);
  });
}

function rollWeaponDamage(weaponName, damageFormula) {
  playDiceSound();
  try {
    const clean     = damageFormula.replace(/\s+/g, '').toLowerCase();
    const parts     = clean.split(/([+-])/);
    const ds        = parts[0].split('d');
    const numDice   = parseInt(ds[0]) || 1;
    const diceSides = parseInt(ds[1]) || 6;
    const modifier  = parts.length > 1 ? (parts[1] === '+' ? 1 : -1) * (parseInt(parts[2]) || 0) : 0;

    const dg    = $('dice-graphic');
    const scene = $('dice-scene');
    scene?.classList.remove('dice-crit-glow', 'dice-fail-glow');
    dg.classList.remove('rolling-dice'); void dg.offsetWidth; dg.classList.add('rolling-dice');
    const rv = $('dice-result-val');

    let spins = 0;
    const intv = setInterval(() => {
      if (rv) rv.textContent = Math.floor(Math.random() * diceSides) + 1;
      if (++spins > 6) {
        clearInterval(intv);
        const rolls = []; let diceTotal = 0;
        for (let i = 0; i < numDice; i++) { const r = Math.floor(Math.random() * diceSides) + 1; rolls.push(r); diceTotal += r; }
        const total = diceTotal + modifier, sign = modifier >= 0 ? '+' : '';
        if (rv) rv.textContent = total;

        const dl = $('dice-label'), dt = $('dice-roll-total'), df = $('dice-formula');
        if (dl) dl.textContent = `Dano ${weaponName}`;
        if (dt) { dt.textContent = `${total} Dano`; dt.classList.remove('hidden'); }
        if (df) { df.textContent = `Dados: [${rolls.join(', ')}] ${modifier !== 0 ? sign + modifier : ''}`; df.classList.remove('hidden'); }

        const list  = $('roll-log-list'); if (!list) return;
        const empty = list.querySelector('.log-empty'); if (empty) empty.remove();
        const ts    = new Date().toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.style.cssText = 'background:rgba(5,7,14,.7);border:1px solid rgba(16,185,129,.18);border-radius:8px;padding:7px 9px;';
        entry.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span style="font-family:'Cinzel',serif;font-weight:700;color:#10b981;font-size:.58rem;letter-spacing:.09em;text-transform:uppercase;">Dano: ${weaponName}</span>
            <span style="font-size:.55rem;color:#64718f;">${ts}</span>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:3px;">
            <span style="font-size:.62rem;color:#64718f;font-style:italic;">${damageFormula} (${rolls.join('+')})</span>
            <span style="font-family:'Cinzel',serif;font-weight:900;color:#10b981;font-size:.9rem;">${total}</span>
          </div>`;
        list.insertAdjacentElement('afterbegin', entry);
        rollHistory.unshift({ title: `Dano:${weaponName}`, formula: damageFormula, total, naturalRoll: diceTotal });
        showToast(`Dano: ${weaponName}`, `${total} (${clean})`, `Dados: ${rolls.join('+')} ${modifier !== 0 ? sign + modifier : ''}`, total);
      }
    }, 70);
  } catch { alert("Erro ao ler fórmula de dano. Use formatos como '1d8+4', '2d6', etc."); }
}

function clearRollLog() {
  rollHistory = [];
  const list = $('roll-log-list');
  if (list) list.innerHTML = `<div class="log-empty">Nenhuma rolagem feita ainda.</div>`;
  $('dice-scene')?.classList.remove('dice-crit-glow', 'dice-fail-glow');
}

/* ─── EXPORT / IMPORT / RESET ─────────────────────────────────────── */
function exportSheet() {
  const filename = `Ficha_${sheet.name.replace(/\s+/g, '_')}.json`;
  const blob     = new Blob([JSON.stringify(sheet, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function importSheet(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      sheet = { ...DEFAULT_SHEET, ...JSON.parse(e.target.result) };
      saveSheet(); renderAll();
      showInfoToast('Sucesso!', 'Ficha carregada com sucesso.');
    } catch { showInfoToast('Erro!', 'Não foi possível carregar o JSON.'); }
  };
  reader.readAsText(file);
  // Reset input so same file can be re-imported
  event.target.value = '';
}

function resetToDefault() {
  if (!confirm('Reiniciar para a ficha padrão? Isso apagará as modificações atuais.')) return;
  sheet = JSON.parse(JSON.stringify(DEFAULT_SHEET));
  saveSheet(); renderAll();
}

function showInfoToast(title, text) {
  const tR = $('toast-dice-result'), tT = $('toast-dice-title');
  const tO = $('toast-dice-total'),  tF = $('toast-dice-formula');
  if (tR) { tR.textContent = 'i'; tR.style.background = 'rgba(212,168,67,.15)'; tR.style.borderColor = 'rgba(212,168,67,.4)'; tR.style.color = '#d4a843'; }
  if (tT) tT.textContent = title;
  if (tO) { tO.textContent = text; tO.style.color = '#d4a843'; }
  if (tF) tF.textContent = 'D&D 5e';
  const toast = $('dice-toast');
  if (!toast) return;
  toast.classList.add('visible');
  clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => toast.classList.remove('visible'), 4000);
}

/* ─── BIND ALL INPUTS ─────────────────────────────────────────────── */
function bindInputs() {
  // Character info
  $('char-name')?.addEventListener('input',  e => updateData('name', e.target.value));
  $('char-class')?.addEventListener('input', e => updateData('class', e.target.value));
  $('char-level')?.addEventListener('input', e => updateLevel(e.target.value));
  $('char-race')?.addEventListener('input',  e => updateData('race', e.target.value));
  $('char-player')?.addEventListener('input',     e => updateData('player', e.target.value));
  $('char-background')?.addEventListener('input', e => updateData('background', e.target.value));
  $('char-alignment')?.addEventListener('input',  e => updateData('alignment', e.target.value));

  // Combat
  $('combat-ac')?.addEventListener('input',    e => updateData('ac', e.target.value));
  $('combat-speed')?.addEventListener('input', e => updateData('speed', e.target.value));
  $('combat-hitdice-current')?.addEventListener('input', e => updateData('hitDiceCurrent', e.target.value));
  $('combat-hitdice-total')?.addEventListener('input',   e => updateData('hitDiceTotal', e.target.value));
  $('combat-init')?.addEventListener('click', () => rollInitiative());

  // Stats
  ['str','des','con','int','sab','car'].forEach(s => {
    $(`val-${s}`)?.addEventListener('input', () => calcModifier(s));
    $(`mod-${s}`)?.parentElement?.addEventListener('click', () => {
      const NAMES = { str:'Força', des:'Destreza', con:'Constituição', int:'Inteligência', sab:'Sabedoria', car:'Carisma' };
      rollStat(NAMES[s], s);
    });
  });

  // HP
  $('hp-current')?.addEventListener('input', updateHP);
  $('hp-max')?.addEventListener('input',     updateHP);
  $('hp-temp')?.addEventListener('input',    updateHP);
  $('btn-hp-sub5')?.addEventListener('click', () => modifyHP(-5));
  $('btn-hp-sub1')?.addEventListener('click', () => modifyHP(-1));
  $('btn-hp-add1')?.addEventListener('click', () => modifyHP(1));
  $('btn-hp-add5')?.addEventListener('click', () => modifyHP(5));

  // Death saves
  for (let i = 1; i <= 3; i++) {
    $(`death-success-${i}`)?.addEventListener('change', updateDeathSaves);
    $(`death-fail-${i}`)?.addEventListener('change', updateDeathSaves);
  }

  // Hit dice roll
  $('btn-roll-hitdice')?.addEventListener('click', rollHitDice);

  // Save proficiencies
  ['str','des','con','int','sab','car'].forEach(s => {
    $(`save-prof-${s}`)?.addEventListener('change', updateSaveProfs);
  });

  // Save roll buttons
  const saveNames = { str:'Força', des:'Destreza', con:'Constituição', int:'Inteligência', sab:'Sabedoria', car:'Carisma' };
  ['str','des','con','int','sab','car'].forEach(s => {
    $(`save-roll-${s}`)?.addEventListener('click', () => rollSave(saveNames[s], s));
  });

  // Coins
  ['pc','pp','pe','po','pl'].forEach(k => {
    $(`coin-${k}`)?.addEventListener('input', e => updateCoin(k, e.target.value));
  });

  // Textareas
  $('equipment-text')?.addEventListener('input',  e => updateData('equipment', e.target.value));
  $('prof-langs-text')?.addEventListener('input', e => updateData('profAndLangs', e.target.value));
  $('features-text')?.addEventListener('input',   e => updateData('features', e.target.value));

  // Weapons
  $('btn-add-weapon')?.addEventListener('click', addWeapon);

  // Roll log
  $('btn-clear-log')?.addEventListener('click', clearRollLog);

  // Export / Import / Reset
  $('btn-export')?.addEventListener('click', exportSheet);
  $('btn-import')?.addEventListener('click', () => $('import-file')?.click());
  $('import-file')?.addEventListener('change', importSheet);
  $('btn-reset')?.addEventListener('click', resetToDefault);
}

/* ─── INIT ────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  bindInputs();
  loadSheet();
});
