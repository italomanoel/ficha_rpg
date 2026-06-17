// --- 1. CONFIGURAÇÕES & DADOS DO PERSONAGEM (D&D 5E TEMPLATE COM DADOS DO USUÁRIO) ---
const DEFAULT_SHEET = {
    name: "nome do personagem",
    class: "Bárbaro",
    level: 1,
    race: "Anão",
    player: "Nome do Jogador",
    background: "Herói do Povo",
    alignment: "Caótico e Neutro",
    ac: 15, // Armadura natural/bárbara ou escudos
    speed: "9",
    hitDiceCurrent: "1",
    hitDiceTotal: "1d12",
    hp: {
        current: 15,
        max: 15,
        temp: 0
    },
    deathSaves: {
        successes: [false, false, false],
        failures: [false, false, false]
    },
    stats: {
        str: 18,
        des: 12,
        con: 16,
        int: 8,
        sab: 10,
        car: 8
    },
    saveProfs: {
        str: true, // Bárbaro tem proficiência em Força e Constituição
        des: false,
        con: true,
        int: false,
        sab: false,
        car: false
    },
    skills: {
        acrobatics: { prof: false, stat: 'des', name: "Acrobacia" },
        animal_handling: { prof: false, stat: 'sab', name: "Adestrar Animais" },
        arcana: { prof: false, stat: 'int', name: "Arcanismo" },
        athletics: { prof: true, stat: 'str', name: "Atletismo" },
        deception: { prof: false, stat: 'car', name: "Enganação" },
        history: { prof: false, stat: 'int', name: "História" },
        insight: { prof: false, stat: 'sab', name: "Intuição" },
        intimidation: { prof: true, stat: 'car', name: "Intimidação" },
        investigation: { prof: false, stat: 'int', name: "Investigação" },
        medicine: { prof: false, stat: 'sab', name: "Medicina" },
        nature: { prof: false, stat: 'int', name: "Natureza" },
        perception: { prof: false, stat: 'sab', name: "Percepção" },
        performance: { prof: false, stat: 'car', name: "Atuação" },
        persuasion: { prof: false, stat: 'car', name: "Persuasão" },
        religion: { prof: false, stat: 'int', name: "Religião" },
        sleight_of_hand: { prof: false, stat: 'des', name: "Prestidigitação" },
        stealth: { prof: false, stat: 'des', name: "Furtividade" },
        survival: { prof: true, stat: 'sab', name: "Sobrevivência" }
    },
    weapons: [
        { name: "Machado de Batalha de Uma Mão", bonusAtk: "+6", damage: "1d8+4", damageType: "Cortante", id: 1 },
        { name: "Machadinha (Arremessável)", bonusAtk: "+6", damage: "1d6+4", damageType: "Cortante", id: 2 }
    ],
    equipment: "Armadura de Couro Batido, Machado de Batalha, 2x Machadinhas, Mochila de Explorador, Rações de Viagem, Saco de Dormir.",
    profAndLangs: "Idiomas: Comum, Anão.\nProficiência em Ferramentas de Pedreiro.\nArmas Simples e Marciais.",
    features: "FÚRIA (2x ao dia):\nNo seu turno, você pode entrar em fúria como uma ação bônus. Vantagem em testes de Força e salvamentos de Força. Bônus de dano de Fúria (+2). Resistência a dano de concussão, cortante e perfurante.\n\nDEFESA SEM ARMADURA:\nQuando não estiver usando armadura, sua Classe de Armadura é 10 + Mod DES + Mod CON.\n\nRESILIÊNCIA ANÃ:\nVantagem contra venenos e resistência a dano de veneno.",
    coins: {
        pc: 0,
        pp: 0,
        pe: 0,
        po: 15,
        pl: 0
    }
};

let currentSheet = {};

// --- 2. WEB AUDIO API - EFEITO DE SOM DE DADO SINTETIZADO ---
function playDiceSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        // Simula 3 a 4 pequenos barulhos de chacoalhar do dado
        for (let i = 0; i < 4; i++) {
            const delay = i * 0.12;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(100 + Math.random() * 80, ctx.currentTime + delay);
            osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + delay + 0.08);
            
            gain.gain.setValueAtTime(0.15, ctx.currentTime + delay);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.08);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + delay);
            osc.stop(ctx.currentTime + delay + 0.08);
        }
    } catch (e) {
        console.log("Audio not allowed / error: ", e);
    }
}

// --- 3. INICIALIZAÇÃO DA FICHA ---
window.onload = function() {
    loadSheet();
}

function loadSheet() {
    // const saved = localStorage.getItem('rpg_character_sheet_data');
    const saved = sessionStorage.getItem('rpg_character_sheet_data');
    if (saved) {
        try {
            currentSheet = JSON.parse(saved);
            // Garantir compatibilidade com novos campos se existirem
            currentSheet = { ...DEFAULT_SHEET, ...currentSheet };
        } catch (e) {
            currentSheet = JSON.parse(JSON.stringify(DEFAULT_SHEET));
        }
    } else {
        currentSheet = JSON.parse(JSON.stringify(DEFAULT_SHEET));
    }
    renderAll();
}

function saveSheetToStorage() {
    // localStorage.setItem('rpg_character_sheet_data', JSON.stringify(currentSheet));
    sessionStorage.setItem('rpg_character_sheet_data', JSON.stringify(currentSheet));
}

// --- 4. RENDERIZAÇÃO DA PÁGINA COM DADOS ---
function renderAll() {
    // Inputs Textos Gerais
    document.getElementById('char-name').value = currentSheet.name;
    document.getElementById('char-class').value = currentSheet.class;
    document.getElementById('char-level').value = currentSheet.level;
    document.getElementById('char-race').value = currentSheet.race;
    document.getElementById('char-player').value = currentSheet.player;
    document.getElementById('char-background').value = currentSheet.background;
    document.getElementById('char-alignment').value = currentSheet.alignment;

    // Combat stats
    document.getElementById('combat-ac').value = currentSheet.ac;
    document.getElementById('combat-speed').value = currentSheet.speed;
    document.getElementById('combat-hitdice-current').value = currentSheet.hitDiceCurrent;
    document.getElementById('combat-hitdice-total').value = currentSheet.hitDiceTotal;

    // Atributos
    for (let stat in currentSheet.stats) {
        document.getElementById(`val-${stat}`).value = currentSheet.stats[stat];
    }

    // Moedas
    document.getElementById('coin-pc').value = currentSheet.coins.pc;
    document.getElementById('coin-pp').value = currentSheet.coins.pp;
    document.getElementById('coin-pe').value = currentSheet.coins.pe;
    document.getElementById('coin-po').value = currentSheet.coins.po;
    document.getElementById('coin-pl').value = currentSheet.coins.pl;

    // Textareas
    document.getElementById('equipment-text').value = currentSheet.equipment;
    document.getElementById('prof-langs-text').value = currentSheet.profAndLangs;
    document.getElementById('features-text').value = currentSheet.features;

    // Checkbox Saves
    for (let save in currentSheet.saveProfs) {
        document.getElementById(`save-prof-${save}`).checked = currentSheet.saveProfs[save];
    }

    // Vida
    document.getElementById('hp-current').value = currentSheet.hp.current;
    document.getElementById('hp-max').value = currentSheet.hp.max;
    document.getElementById('hp-temp').value = currentSheet.hp.temp || 0;

    // Death saves
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`death-success-${i}`).checked = currentSheet.deathSaves.successes[i-1];
        document.getElementById(`death-fail-${i}`).checked = currentSheet.deathSaves.failures[i-1];
    }

    // Atualizar os cálculos dinâmicos dependentes
    recalculateAll();
}

function recalculateAll() {
    // Nível e Proficiência
    const level = parseInt(currentSheet.level) || 1;
    const profBonus = Math.ceil(level / 4) + 1;
    document.getElementById('prof-bonus').textContent = `+${profBonus}`;

    // Calcular modificadores
    const mods = {};
    for (let stat in currentSheet.stats) {
        const val = parseInt(currentSheet.stats[stat]) || 10;
        const mod = Math.floor((val - 10) / 2);
        mods[stat] = mod;
        
        // Renderizar mod de Atributo
        const sign = mod >= 0 ? '+' : '';
        document.getElementById(`mod-${stat}`).textContent = `${sign}${mod}`;
    }

    // Atualizar Iniciativa baseada em DES
    const initSign = mods.des >= 0 ? '+' : '';
    document.getElementById('combat-init').textContent = `${initSign}${mods.des}`;

    // Atualizar Salvamentos (Testes de Resistência)
    for (let stat in currentSheet.saveProfs) {
        let totalSave = mods[stat];
        if (currentSheet.saveProfs[stat]) {
            totalSave += profBonus;
        }
        const saveSign = totalSave >= 0 ? '+' : '';
        document.getElementById(`save-val-${stat}`).textContent = `${saveSign}${totalSave}`;
    }

    // Barra de vida
    const currentHP = parseInt(currentSheet.hp.current) || 0;
    const maxHP = parseInt(currentSheet.hp.max) || 1;
    const tempHP = parseInt(currentSheet.hp.temp) || 0;
    const percent = Math.min(100, Math.max(0, ((currentHP + tempHP) / maxHP) * 100));
    document.getElementById('hp-bar').style.width = `${percent}%`;

    // Atualizar Lista de Perícias
    renderSkills(mods, profBonus);

    // Atualizar Lista de Armas
    renderWeapons();
}

// --- 5. RENDER DINÂMICO DE PERÍCIAS ---
function renderSkills(mods, profBonus) {
    const container = document.getElementById('skills-list');
    container.innerHTML = '';

    for (let skillKey in currentSheet.skills) {
        const skill = currentSheet.skills[skillKey];
        const isProf = skill.prof;
        const statMod = mods[skill.stat] || 0;
        const totalBonus = statMod + (isProf ? profBonus : 0);
        const sign = totalBonus >= 0 ? '+' : '';

        const div = document.createElement('div');
        div.className = "flex items-center justify-between bg-rpg-bg p-2 rounded border border-rpg-border/40 group hover:border-rpg-accent/40 transition text-xs";
        div.innerHTML = `
            <div class="flex items-center gap-2">
                <input type="checkbox" onchange="toggleSkillProf('${skillKey}')" ${isProf ? 'checked' : ''} class="w-4 h-4 rounded bg-rpg-bg border-rpg-border accent-rpg-accent">
                <button onclick="rollSkill('${skill.name}', ${totalBonus}, '${skill.stat.toUpperCase()}')" class="font-semibold text-left group-hover:text-rpg-accent transition">
                    ${skill.name} <span class="text-[9px] text-rpg-muted font-normal">(${skill.stat.toUpperCase()})</span>
                </button>
            </div>
            <span class="font-serif font-bold text-rpg-accent">${sign}${totalBonus}</span>
        `;
        container.appendChild(div);
    }
}

// --- 6. RENDER DINÂMICO DE ARMAS / ATAQUES ---
function renderWeapons() {
    const container = document.getElementById('weapons-list');
    container.innerHTML = '';

    if (currentSheet.weapons.length === 0) {
        container.innerHTML = `<tr><td colspan="4" class="text-center text-rpg-muted py-4 italic">Nenhuma arma adicionada.</td></tr>`;
        return;
    }

    currentSheet.weapons.forEach((weapon, index) => {
        const tr = document.createElement('tr');
        tr.className = "border-b border-rpg-border/50 hover:bg-rpg-bg/30 transition";
        tr.innerHTML = `
            <td class="py-2.5">
                <div class="flex items-center gap-2">
                    <button onclick="deleteWeapon(${index})" class="text-xs text-rpg-danger hover:underline">✕</button>
                    <input type="text" value="${weapon.name}" onchange="editWeapon(${index}, 'name', this.value)" class="bg-transparent border-b border-transparent hover:border-rpg-border focus:border-rpg-accent text-rpg-text focus:outline-none w-full text-xs">
                </div>
            </td>
            <td class="py-2.5 text-center">
                <input type="text" value="${weapon.bonusAtk}" onchange="editWeapon(${index}, 'bonusAtk', this.value)" class="bg-transparent text-center border-b border-transparent hover:border-rpg-border focus:border-rpg-accent text-rpg-text focus:outline-none w-12 text-xs">
            </td>
            <td class="py-2.5 text-center">
                <div class="flex items-center justify-center gap-1">
                    <input type="text" value="${weapon.damage}" onchange="editWeapon(${index}, 'damage', this.value)" class="bg-transparent text-center border-b border-transparent hover:border-rpg-border focus:border-rpg-accent text-rpg-text focus:outline-none w-16 text-xs font-bold">
                    <input type="text" value="${weapon.damageType}" onchange="editWeapon(${index}, 'damageType', this.value)" class="bg-transparent text-center border-b border-transparent hover:border-rpg-border focus:border-rpg-accent text-rpg-muted focus:outline-none w-16 text-[10px]">
                </div>
            </td>
            <td class="py-2.5 text-right">
                <div class="flex justify-end gap-1.5">
                    <button onclick="rollWeaponAtk('${weapon.name}', '${weapon.bonusAtk}')" class="px-2 py-1 bg-rpg-bg hover:bg-rpg-accent hover:text-rpg-bg text-[10px] rounded font-bold border border-rpg-border transition">Atacar</button>
                    <button onclick="rollWeaponDamage('${weapon.name}', '${weapon.damage}')" class="px-2 py-1 bg-rpg-bg hover:bg-emerald-600 hover:text-white text-[10px] rounded font-bold border border-rpg-border transition">Dano</button>
                </div>
            </td>
        `;
        container.appendChild(tr);
    });
}

// --- 7. MÉTODOS DE EDIÇÃO DE ESTADO ---
function updateData(key, value) {
    currentSheet[key] = value;
    saveSheetToStorage();
}

function updateLevel(val) {
    currentSheet.level = parseInt(val) || 1;
    saveSheetToStorage();
    recalculateAll();
}

function updateCoin(key, val) {
    currentSheet.coins[key] = parseInt(val) || 0;
    saveSheetToStorage();
}

function calcModifier(stat) {
    const val = parseInt(document.getElementById(`val-${stat}`).value) || 10;
    currentSheet.stats[stat] = val;
    saveSheetToStorage();
    recalculateAll();
}

function toggleSkillProf(skillKey) {
    currentSheet.skills[skillKey].prof = !currentSheet.skills[skillKey].prof;
    saveSheetToStorage();
    recalculateAll();
}

function updateSavesAndSkills() {
    for (let stat in currentSheet.saveProfs) {
        currentSheet.saveProfs[stat] = document.getElementById(`save-prof-${stat}`).checked;
    }
    saveSheetToStorage();
    recalculateAll();
}

function updateHP() {
    currentSheet.hp.current = parseInt(document.getElementById('hp-current').value) || 0;
    currentSheet.hp.max = parseInt(document.getElementById('hp-max').value) || 1;
    currentSheet.hp.temp = parseInt(document.getElementById('hp-temp').value) || 0;
    saveSheetToStorage();
    recalculateAll();
}

function modifyHP(amount) {
    const current = parseInt(document.getElementById('hp-current').value) || 0;
    const max = parseInt(document.getElementById('hp-max').value) || 1;
    let newVal = current + amount;
    if (newVal > max) newVal = max;
    if (newVal < 0) newVal = 0;
    
    document.getElementById('hp-current').value = newVal;
    updateHP();
}

function updateDeathSaves() {
    for (let i = 1; i <= 3; i++) {
        currentSheet.deathSaves.successes[i-1] = document.getElementById(`death-success-${i}`).checked;
        currentSheet.deathSaves.failures[i-1] = document.getElementById(`death-fail-${i}`).checked;
    }
    saveSheetToStorage();
}

function editWeapon(index, field, value) {
    currentSheet.weapons[index][field] = value;
    saveSheetToStorage();
}

function addWeapon() {
    currentSheet.weapons.push({
        name: "Nova Arma",
        bonusAtk: "+0",
        damage: "1d6",
        damageType: "Dano",
        id: Date.now()
    });
    saveSheetToStorage();
    recalculateAll();
}

function deleteWeapon(index) {
    currentSheet.weapons.splice(index, 1);
    saveSheetToStorage();
    recalculateAll();
}

// --- 8. SISTEMA DE ROLAGEM DE DADOS (COM SONS & ANIMAÇÃO) ---
let rollHistory = [];

function executeRollAnimation(label, modifier, callback) {
    playDiceSound();
    const diceGraphic = document.getElementById('dice-graphic');
    const resultVal = document.getElementById('dice-result-val');
    const diceLabel = document.getElementById('dice-label');
    
    diceGraphic.classList.remove('rolling-dice');
    void diceGraphic.offsetWidth; // Trigger reflow
    diceGraphic.classList.add('rolling-dice');

    let spins = 0;
    const interval = setInterval(() => {
        resultVal.textContent = Math.floor(Math.random() * 20) + 1;
        spins++;
        if (spins > 6) {
            clearInterval(interval);
            callback();
        }
    }, 70);
}

function addLogEntry(title, formula, total, naturalRoll) {
    const list = document.getElementById('roll-log-list');
    if (rollHistory.length === 0) {
        list.innerHTML = '';
    }

    const timestamp = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    const natClass = naturalRoll === 20 ? 'text-emerald-400 font-extrabold' : (naturalRoll === 1 ? 'text-red-500 font-extrabold' : 'text-rpg-muted');
    const bonusText = naturalRoll === 20 ? ' (Crítico!)' : (naturalRoll === 1 ? ' (Falha Crítica!)' : '');

    const entryHtml = `
        <div class="bg-rpg-bg p-2 rounded border border-rpg-border/60 hover:border-rpg-accent/30 transition text-xs flex flex-col justify-between">
            <div class="flex justify-between items-center text-[10px]">
                <span class="font-bold text-rpg-accent uppercase">${title}</span>
                <span class="text-[9px] text-rpg-muted">${timestamp}</span>
            </div>
            <div class="flex justify-between items-end mt-1">
                <span class="text-[10px] text-rpg-muted italic">${formula} <span class="${natClass}">[d20: ${naturalRoll}${bonusText}]</span></span>
                <span class="text-sm font-black text-emerald-400">${total}</span>
            </div>
        </div>
    `;
    
    list.insertAdjacentHTML('afterbegin', entryHtml);
    rollHistory.unshift({ title, formula, total, naturalRoll });

    // Mostrar toast flutuante (Mobile Friendly)
    showToast(title, total, formula, naturalRoll);
}

function showToast(title, total, formula, naturalRoll) {
    const toast = document.getElementById('dice-toast');
    const tResult = document.getElementById('toast-dice-result');
    const tTitle = document.getElementById('toast-dice-title');
    const tTotal = document.getElementById('toast-dice-total');
    const tFormula = document.getElementById('toast-dice-formula');

    tResult.textContent = naturalRoll;
    tTitle.textContent = title;
    tTotal.textContent = `Total: ${total}`;
    tFormula.textContent = formula;

    // Cores baseadas em crítico
    if (naturalRoll === 20) {
        tResult.className = "bg-emerald-500 text-rpg-bg font-black rounded-full w-10 h-10 flex items-center justify-center text-lg shadow-inner animate-bounce";
    } else if (naturalRoll === 1) {
        tResult.className = "bg-rose-500 text-white font-black rounded-full w-10 h-10 flex items-center justify-center text-lg shadow-inner";
    } else {
        tResult.className = "bg-rpg-accent text-rpg-bg font-black rounded-full w-10 h-10 flex items-center justify-center text-lg shadow-inner";
    }

    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.remove('opacity-0', 'translate-y-20');
    }, 50);

    // Hide after 4 seconds
    clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-20');
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 4000);
}

function rollStat(statName, statKey) {
    const val = parseInt(currentSheet.stats[statKey]) || 10;
    const mod = Math.floor((val - 10) / 2);
    executeRollAnimation(statName, mod, () => {
        const roll = Math.floor(Math.random() * 20) + 1;
        const total = roll + mod;
        const sign = mod >= 0 ? '+' : '';
        
        document.getElementById('dice-result-val').textContent = roll;
        document.getElementById('dice-label').textContent = statName;
        document.getElementById('dice-roll-total').textContent = `Total: ${total}`;
        document.getElementById('dice-roll-total').classList.remove('hidden');
        document.getElementById('dice-formula').textContent = `1d20 ${sign} ${mod} (${statName})`;
        document.getElementById('dice-formula').classList.remove('hidden');

        addLogEntry(`Atributo: ${statName}`, `1d20 ${sign}${mod}`, total, roll);
    });
}

function rollSave(statName, statKey) {
    const val = parseInt(currentSheet.stats[statKey]) || 10;
    const mod = Math.floor((val - 10) / 2);
    const level = parseInt(currentSheet.level) || 1;
    const profBonus = Math.ceil(level / 4) + 1;
    const hasProf = currentSheet.saveProfs[statKey];
    
    const totalMod = mod + (hasProf ? profBonus : 0);

    executeRollAnimation(`Salvamento ${statName}`, totalMod, () => {
        const roll = Math.floor(Math.random() * 20) + 1;
        const total = roll + totalMod;
        const sign = totalMod >= 0 ? '+' : '';

        document.getElementById('dice-result-val').textContent = roll;
        document.getElementById('dice-label').textContent = `Salvar ${statName}`;
        document.getElementById('dice-roll-total').textContent = `Total: ${total}`;
        document.getElementById('dice-roll-total').classList.remove('hidden');
        document.getElementById('dice-formula').textContent = `1d20 ${sign} ${totalMod}`;
        document.getElementById('dice-formula').classList.remove('hidden');

        addLogEntry(`Salvamento: ${statName}`, `1d20 ${sign}${totalMod}`, total, roll);
    });
}

function rollSkill(skillName, bonusValue, attr) {
    executeRollAnimation(`Perícia ${skillName}`, bonusValue, () => {
        const roll = Math.floor(Math.random() * 20) + 1;
        const total = roll + bonusValue;
        const sign = bonusValue >= 0 ? '+' : '';

        document.getElementById('dice-result-val').textContent = roll;
        document.getElementById('dice-label').textContent = skillName;
        document.getElementById('dice-roll-total').textContent = `Total: ${total}`;
        document.getElementById('dice-roll-total').classList.remove('hidden');
        document.getElementById('dice-formula').textContent = `1d20 ${sign} ${bonusValue} (${attr})`;
        document.getElementById('dice-formula').classList.remove('hidden');

        addLogEntry(`Perícia: ${skillName}`, `1d20 ${sign}${bonusValue}`, total, roll);
    });
}

function rollInitiative() {
    const val = parseInt(currentSheet.stats.des) || 10;
    const mod = Math.floor((val - 10) / 2);
    executeRollAnimation("Iniciativa", mod, () => {
        const roll = Math.floor(Math.random() * 20) + 1;
        const total = roll + mod;
        const sign = mod >= 0 ? '+' : '';

        document.getElementById('dice-result-val').textContent = roll;
        document.getElementById('dice-label').textContent = "Iniciativa";
        document.getElementById('dice-roll-total').textContent = `Total: ${total}`;
        document.getElementById('dice-roll-total').classList.remove('hidden');
        document.getElementById('dice-formula').textContent = `1d20 ${sign} ${mod} (Iniciativa)`;
        document.getElementById('dice-formula').classList.remove('hidden');

        addLogEntry("Iniciativa", `1d20 ${sign}${mod}`, total, roll);
    });
}

function rollHitDice() {
    playDiceSound();
    const diceGraphic = document.getElementById('dice-graphic');
    const resultVal = document.getElementById('dice-result-val');
    
    diceGraphic.classList.remove('rolling-dice');
    void diceGraphic.offsetWidth;
    diceGraphic.classList.add('rolling-dice');

    let spins = 0;
    const interval = setInterval(() => {
        resultVal.textContent = Math.floor(Math.random() * 12) + 1;
        spins++;
        if (spins > 6) {
            clearInterval(interval);
            const roll = Math.floor(Math.random() * 12) + 1;
            const valCon = parseInt(currentSheet.stats.con) || 10;
            const modCon = Math.floor((valCon - 10) / 2);
            const total = roll + modCon;

            document.getElementById('dice-result-val').textContent = roll;
            document.getElementById('dice-label').textContent = "Dados de Vida (d12)";
            document.getElementById('dice-roll-total').textContent = `Total: ${total}`;
            document.getElementById('dice-roll-total').classList.remove('hidden');
            document.getElementById('dice-formula').textContent = `1d12 + ${modCon} (CON)`;
            document.getElementById('dice-formula').classList.remove('hidden');

            addLogEntry("Dado de Vida (d12)", `1d12 + ${modCon}`, total, roll);
        }
    }, 70);
}

function rollWeaponAtk(weaponName, bonusText) {
    // Analisa o bônus de ataque (Ex: "+6" ou "-1" ou "6")
    const bonus = parseInt(bonusText.replace('+', '')) || 0;
    executeRollAnimation(`${weaponName} (Ataque)`, bonus, () => {
        const roll = Math.floor(Math.random() * 20) + 1;
        const total = roll + bonus;
        const sign = bonus >= 0 ? '+' : '';

        document.getElementById('dice-result-val').textContent = roll;
        document.getElementById('dice-label').textContent = "Ataque " + weaponName;
        document.getElementById('dice-roll-total').textContent = `Total Atq: ${total}`;
        document.getElementById('dice-roll-total').classList.remove('hidden');
        document.getElementById('dice-formula').textContent = `1d20 ${sign} ${bonus}`;
        document.getElementById('dice-formula').classList.remove('hidden');

        addLogEntry(`Ataque: ${weaponName}`, `1d20 ${sign}${bonus}`, total, roll);
    });
}

function rollWeaponDamage(weaponName, damageFormula) {
    playDiceSound();
    // Suporta fórmulas de dano simples como "1d8+4", "2d6+3", "1d12"
    try {
        const cleanFormula = damageFormula.replace(/\s+/g, '').toLowerCase();
        const parts = cleanFormula.split(/([+-])/);
        const dicePart = parts[0]; // e.g. "1d8"
        const diceSplit = dicePart.split('d');
        const numDice = parseInt(diceSplit[0]) || 1;
        const diceSides = parseInt(diceSplit[1]) || 6;
        
        let modifier = 0;
        if (parts.length > 1) {
            const sign = parts[1];
            const modValue = parseInt(parts[2]) || 0;
            modifier = sign === '+' ? modValue : -modValue;
        }

        const diceGraphic = document.getElementById('dice-graphic');
        diceGraphic.classList.remove('rolling-dice');
        void diceGraphic.offsetWidth;
        diceGraphic.classList.add('rolling-dice');

        let spins = 0;
        const interval = setInterval(() => {
            document.getElementById('dice-result-val').textContent = Math.floor(Math.random() * diceSides) + 1;
            spins++;
            if (spins > 6) {
                clearInterval(interval);
                
                let rolls = [];
                let diceTotal = 0;
                for (let i = 0; i < numDice; i++) {
                    const r = Math.floor(Math.random() * diceSides) + 1;
                    rolls.push(r);
                    diceTotal += r;
                }
                const total = diceTotal + modifier;
                const sign = modifier >= 0 ? '+' : '';

                document.getElementById('dice-result-val').textContent = total;
                document.getElementById('dice-label').textContent = "Dano " + weaponName;
                document.getElementById('dice-roll-total').textContent = `${total} Dano`;
                document.getElementById('dice-roll-total').classList.remove('hidden');
                document.getElementById('dice-formula').textContent = `Rolagens: [${rolls.join(', ')}] ${modifier !== 0 ? sign + modifier : ''}`;
                document.getElementById('dice-formula').classList.remove('hidden');

                // No log de rolagem
                const list = document.getElementById('roll-log-list');
                if (rollHistory.length === 0) list.innerHTML = '';
                const timestamp = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                const entryHtml = `
                    <div class="bg-rpg-bg p-2 rounded border border-emerald-500/30 hover:border-emerald-500/50 transition text-xs flex flex-col justify-between">
                        <div class="flex justify-between items-center text-[10px]">
                            <span class="font-bold text-emerald-400 uppercase">Dano: ${weaponName}</span>
                            <span class="text-[9px] text-rpg-muted">${timestamp}</span>
                        </div>
                        <div class="flex justify-between items-end mt-1">
                            <span class="text-[10px] text-rpg-muted italic">${damageFormula} (Dados: ${rolls.join('+')})</span>
                            <span class="text-sm font-black text-emerald-400">${total}</span>
                        </div>
                    </div>
                `;
                list.insertAdjacentHTML('afterbegin', entryHtml);
                rollHistory.unshift({ title: `Dano: ${weaponName}`, formula: damageFormula, total, naturalRoll: diceTotal });
                
                // Mostrar Toast
                showToast(`Dano: ${weaponName}`, `${total} (${cleanFormula})`, `Dados: ${rolls.join('+')} ${modifier !== 0 ? sign + modifier : ''}`, total);
            }
        }, 70);
    } catch (err) {
        alert("Erro ao ler fórmula de dano. Use formatos como '1d8+4', '2d6', etc.");
    }
}

function clearRollLog() {
    rollHistory = [];
    document.getElementById('roll-log-list').innerHTML = `
        <div class="text-rpg-muted italic text-center py-4">Nenhuma rolagem feita ainda.</div>
    `;
}

// --- 9. IMPORTAÇÃO / EXPORTAÇÃO & RESET ---
function exportSheet() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentSheet, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `Ficha_${currentSheet.name.replace(/\s+/g, '_')}.json`);
    dlAnchorElem.click();
}

function importSheet(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            currentSheet = { ...DEFAULT_SHEET, ...imported };
            saveSheetToStorage();
            renderAll();
            showCustomMessage("Sucesso!", "Sua ficha foi carregada com sucesso.");
        } catch (err) {
            showCustomMessage("Erro!", "Não foi possível carregar o arquivo JSON.");
        }
    };
    reader.readAsText(file);
}

function resetToDefault() {
    if (confirm("Tem certeza que deseja reiniciar para a ficha padrão de Pequeno Fumaça? Isso apagará as modificações atuais.")) {
        currentSheet = JSON.parse(JSON.stringify(DEFAULT_SHEET));
        saveSheetToStorage();
        renderAll();
    }
}

// Modal Customizado para Avisos/Mensagens
function showCustomMessage(title, text) {
    const toast = document.getElementById('dice-toast');
    const tResult = document.getElementById('toast-dice-result');
    const tTitle = document.getElementById('toast-dice-title');
    const tTotal = document.getElementById('toast-dice-total');
    const tFormula = document.getElementById('toast-dice-formula');

    tResult.textContent = "i";
    tResult.className = "bg-rpg-accent text-rpg-bg font-black rounded-full w-10 h-10 flex items-center justify-center text-lg shadow-inner";
    tTitle.textContent = title;
    tTotal.textContent = text;
    tFormula.textContent = "D&D 5e";

    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.remove('opacity-0', 'translate-y-20');
    }, 50);

    clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-20');
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 4000);
}
