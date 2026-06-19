# D&D 5e — Ficha de Personagem (Vanilla)

Ficha de personagem D&D 5e completamente estática — sem build, sem React, sem dependências de
Node.js. Basta abrir o `index.html` em qualquer navegador.

## Estrutura

```
index.html          ← Página principal (markup semântico)
src/
  styles.css        ← Todo o CSS (tokens, layout, componentes)
  sheet.js          ← Toda a lógica (dados, rolagem, import/export)
```

## Como usar

```bash
# Opção 1 — abrir direto
open index.html

# Opção 2 — servidor local (evita restrições de CORS em alguns browsers)
npx serve .
# ou
python3 -m http.server
```

## Formato JSON da Ficha

Ao clicar em **Exportar JSON** o arquivo gerado segue esta estrutura:

```json
{
  "name": "Nome do Personagem",
  "class": "Bárbaro",
  "level": 1,
  "race": "Anão",
  "player": "Nome do Jogador",
  "background": "Herói do Povo",
  "alignment": "Caótico e Neutro",
  "ac": 15,
  "speed": "9",
  "hitDiceCurrent": "1",
  "hitDiceTotal": "1d12",
  "hp": { "current": 15, "max": 15, "temp": 0 },
  "deathSaves": {
    "successes": [false, false, false],
    "failures":  [false, false, false]
  },
  "stats": { "str": 18, "des": 12, "con": 16, "int": 8, "sab": 10, "car": 8 },
  "saveProfs": { "str": true, "des": false, "con": true, "int": false, "sab": false, "car": false },
  "skills": {
    "athletics": { "prof": true, "stat": "str", "name": "Atletismo" }
    /* ... 18 perícias no total */
  },
  "weapons": [
    { "name": "Machado", "bonusAtk": "+6", "damage": "1d8+4", "damageType": "Cortante", "id": 1 }
  ],
  "equipment": "...",
  "profAndLangs": "...",
  "features": "...",
  "coins": { "pc": 0, "pp": 0, "pe": 0, "po": 15, "pl": 0 }
}
```

O JSON pode ser editado manualmente e reimportado — útil para preparar fichas antes da sessão.

---

## Sugestões de Evolução

### 🟢 Rápidas (< 1h cada)

| Melhoria | Como fazer |
|----------|-----------|
| **Suporte a múltiplos personagens** | Salvar no `localStorage` com chave por nome; adicionar select no header para trocar entre fichas |
| **Impressão / PDF** | O CSS já tem `@media print`. Adicionar um botão "Imprimir" que chama `window.print()` |
| **Modo escuro / claro** | Adicionar classe `.light` no `<html>` e redefinir os tokens CSS; toggle no header |
| **Rolagem customizada** | Campo de texto livre (ex: `2d6+3`) + botão "Rolar" que chama o engine existente em `sheet.js` |
| **Fórmulas de dano automáticas** | No `rollWeaponAtk`, se for crítico, rolar o dano dobrado automaticamente |

### 🟡 Médias (algumas horas)

| Melhoria | Como fazer |
|----------|-----------|
| **Magia / Slots** | Adicionar ao JSON: `spells[]` e `spellSlots{}`. Nova seção HTML colapsável. Lógica simples de contagem em `sheet.js` |
| **Notas de sessão** | Campo `notes` no JSON + textarea na ficha. Diferente de "features": aqui é livre para anotar durante o jogo |
| **Histórico persistente de rolagens** | Salvar `rollHistory` no `localStorage` junto com a ficha; limitar a 50 entradas |
| **Validação de fórmula de dano** | Regex ou parser simples em `rollWeaponDamage` para avisar formatos inválidos antes de rolar |
| **Compartilhamento via URL** | Codificar o JSON em Base64 e colocar como hash (`#data=...`) — sem servidor |

### 🔵 Avançadas

| Melhoria | Como fazer |
|----------|-----------|
| **Suporte a outras sistemas (Pathfinder, CoC)** | Separar `DEFAULT_SHEET` em arquivos de configuração por sistema. O engine de rolagem já é genérico |
| **Sincronização entre jogadores** | Usar a [BroadcastChannel API](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel) para compartilhar o log de rolagem em tempo real entre abas da mesma origem |
| **PWA offline** | Adicionar `manifest.json` e um `service-worker.js` básico. O app já é 100% offline — só falta o ícone e instalação |
| **Condições e estados** | Array `conditions` no JSON com checkboxes para Abalado, Cego, Enfeitiçado, etc. |

---

## O que foi removido do React

- React, ReactDOM, Vite, TypeScript — zero runtime
- shadcn/ui (50+ componentes) — tudo substituído por CSS próprio
- Tailwind v4 — substituído por classes CSS semânticas em `styles.css`
- `sessionStorage` → `localStorage` (dados persistem após fechar o browser)
- Todos os `onChange` JSX → `addEventListener` nativo
- `useEffect` → `DOMContentLoaded`
- `window.assign` de funções globais → binding direto por ID em `bindInputs()`
