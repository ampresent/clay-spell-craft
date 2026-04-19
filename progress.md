# Progress — clay-spell-craft

## Original Prompt
User wants to improve the clay-spell-craft (泥灵界/Clayrealm) WebGL game project using the openai/develop-web-game skill guidelines.

## Changes Made

### 1. Testing Infrastructure (develop-web-game skill) — js/main.js
- [x] Added `window.render_game_to_text()` — exposes full game state as JSON:
  - Player position, level, HP, attack
  - Clay amount, assistants, enemies (alive only), NPCs
  - Current zone, active quests, current tool
- [x] Added `window.advanceTime(ms)` — deterministic time-stepping hook
  - Advances all game systems in controlled increments
  - Works without real-time rendering
  - Re-renders scene after each step
- [x] Added `window.getGameTime()` / `window.setGameTime(t)` — time control for testing
- [x] Added `window.isGameStarted()` — state query for test scripts

### 2. Fullscreen Toggle — js/main.js, index.html
- [x] `F` key toggles fullscreen on/off (develop-web-game skill requirement)
- [x] Shop key moved from `F` to `G`
- [x] `Esc` exits fullscreen first, then handles other closures
- [x] Canvas auto-resizes on fullscreenchange event
- [x] Updated title screen controls text to show new bindings

### 3. Playwright Testing Setup
- [x] `package.json` — Playwright dev dependency
- [x] `scripts/web_game_playwright_client.js` — Full Playwright test client
    - Action burst support (keyboard + mouse per-frame)
    - Screenshot capture per iteration
    - Console/page error collection
    - Game state reading via render_game_to_text
    - CLI options: --url, --actions-file, --actions-json, --iterations, --headed
- [x] `references/action_payloads.json` — Example action payloads
- [x] `scripts/test.js` — Simple test runner (starts HTTP server + runs tests)

### 4. Bug Fixes
- [x] `js/enemies.js` — Enemy attacks now actually deal damage via `Player.takeDamage()`
- [x] `js/save.js` — Updated to v2 save format (matching main.js's doSave)
    - Preserves player stats (level, hp, maxHP)
    - Preserves inventory, achievements
    - Fixed getSaveInfo to handle both clay/clayAmount fields

### 5. Minor Fixes
- [x] `js/character.js` — Updated NPC dialog to reference G key for shop
- [x] `.gitignore` — Added test-screenshots/ and playwright-report/

## Files Changed
- `js/main.js` — Core changes: testing hooks, fullscreen, key bindings
- `js/enemies.js` — Player.takeDamage fix
- `js/save.js` — v2 save format
- `js/character.js` — Key binding update
- `index.html` — Title screen controls text
- `package.json` (new)
- `scripts/web_game_playwright_client.js` (new)
- `scripts/test.js` (new)
- `references/action_payloads.json` (new)
- `progress.md` (new)

## TODOs for Next Agent
- [ ] Add more Playwright test scenarios (combat, crafting, quest completion)
- [ ] Add visual regression tests with screenshot comparison
- [ ] Performance profiling with render_game_to_text data
- [ ] Mobile controls testing
- [ ] Add WebGL fallback message for unsupported browsers
- [ ] Add pause/resume functionality for deterministic testing
- [ ] Boss attack damage should also use Player.takeDamage (check bosses.js — already fixed)
