#!/usr/bin/env node
/**
 * web_game_playwright_client.js — Playwright-based test client for clay-spell-craft
 *
 * Usage:
 *   node scripts/web_game_playwright_client.js --url http://localhost:5173 [options]
 *
 * Options:
 *   --url <url>           Game URL (required)
 *   --actions-file <path> JSON file with action payload
 *   --actions-json <str>  Inline JSON action payload
 *   --click-selector <s>  Click a DOM element before running actions
 *   --iterations <n>      Number of burst iterations (default: 1)
 *   --pause-ms <ms>       Pause between iterations (default: 500)
 *   --screenshot-dir <dir> Directory for screenshots (default: ./test-screenshots)
 *   --timeout <ms>        Page load timeout (default: 30000)
 *   --headed              Run in headed mode (visible browser)
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Parse CLI args
function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    url: null,
    actionsFile: null,
    actionsJson: null,
    clickSelector: null,
    iterations: 1,
    pauseMs: 500,
    screenshotDir: './test-screenshots',
    timeout: 30000,
    headed: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--url': opts.url = args[++i]; break;
      case '--actions-file': opts.actionsFile = args[++i]; break;
      case '--actions-json': opts.actionsJson = args[++i]; break;
      case '--click-selector': opts.clickSelector = args[++i]; break;
      case '--iterations': opts.iterations = parseInt(args[++i], 10); break;
      case '--pause-ms': opts.pauseMs = parseInt(args[++i], 10); break;
      case '--screenshot-dir': opts.screenshotDir = args[++i]; break;
      case '--timeout': opts.timeout = parseInt(args[++i], 10); break;
      case '--headed': opts.headed = true; break;
    }
  }

  if (!opts.url) {
    console.error('Error: --url is required');
    process.exit(1);
  }

  return opts;
}

// Load actions from file or inline JSON
function loadActions(opts) {
  if (opts.actionsFile) {
    return JSON.parse(fs.readFileSync(opts.actionsFile, 'utf8'));
  }
  if (opts.actionsJson) {
    return JSON.parse(opts.actionsJson);
  }
  return { steps: [{ buttons: [], frames: 60 }] }; // default: wait 1 second
}

// Map button names to Playwright key names
const KEY_MAP = {
  'left': 'a',
  'right': 'd',
  'up': 'w',
  'down': 's',
  'space': ' ',
  'e': 'e',
  'f': 'f',
  'g': 'g',
  'q': 'q',
  'i': 'i',
  'r': 'r',
  'p': 'p',
  'u': 'u',
  'm': 'm',
  'v': 'v',
  't': 't',
  'digit1': '1',
  'digit2': '2',
  'digit3': '3',
  'digit4': '4',
  'digit5': '5',
};

async function main() {
  const opts = parseArgs();
  const actions = loadActions(opts);

  // Ensure screenshot dir exists
  fs.mkdirSync(opts.screenshotDir, { recursive: true });

  console.log(`[test] Launching browser (headed=${opts.headed})...`);
  const browser = await chromium.launch({ headless: !opts.headed });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();

  // Collect console messages
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // Collect page errors
  const pageErrors = [];
  page.on('pageerror', err => {
    pageErrors.push(err.message);
  });

  console.log(`[test] Navigating to ${opts.url}...`);
  await page.goto(opts.url, { waitUntil: 'domcontentloaded', timeout: opts.timeout });

  // Wait for game to load (title screen should be visible)
  console.log('[test] Waiting for game to load...');
  try {
    await page.waitForSelector('#title-screen', { state: 'visible', timeout: opts.timeout });
    console.log('[test] Title screen loaded.');
  } catch (e) {
    console.log('[test] Title screen not found, continuing...');
  }

  // Click start button if it exists
  try {
    const startBtn = await page.$('#start-btn');
    if (startBtn) {
      console.log('[test] Clicking start button...');
      await startBtn.click();
      await page.waitForTimeout(2000); // Wait for game to initialize
    }
  } catch (e) {
    console.log('[test] No start button found or already started.');
  }

  // Click the specified selector if given
  if (opts.clickSelector) {
    try {
      console.log(`[test] Clicking ${opts.clickSelector}...`);
      await page.click(opts.clickSelector);
      await page.waitForTimeout(500);
    } catch (e) {
      console.log(`[test] Could not click ${opts.clickSelector}: ${e.message}`);
    }
  }

  // Request pointer lock (simulate canvas click)
  try {
    await page.click('#game-canvas');
    await page.waitForTimeout(500);
  } catch (e) {
    console.log('[test] Could not click canvas for pointer lock.');
  }

  // Run action iterations
  for (let iter = 0; iter < opts.iterations; iter++) {
    console.log(`[test] === Iteration ${iter + 1}/${opts.iterations} ===`);

    for (const step of actions.steps) {
      const pressedKeys = [];

      // Press keys
      if (step.buttons) {
        for (const btn of step.buttons) {
          if (btn === 'left_mouse_button') {
            // Mouse click at position
            const cx = (step.mouse_x ?? 0.5) * 1280;
            const cy = (step.mouse_y ?? 0.5) * 720;
            await page.mouse.click(cx, cy);
          } else {
            const key = KEY_MAP[btn] || btn;
            await page.keyboard.down(key);
            pressedKeys.push(key);
          }
        }
      }

      // Advance frames (each frame = 16.67ms at 60fps)
      const frames = step.frames || 1;
      const msPerFrame = 16.67;
      for (let f = 0; f < frames; f++) {
        await page.evaluate(`window.advanceTime(${msPerFrame})`);
      }

      // Release keys
      for (const key of pressedKeys) {
        await page.keyboard.up(key);
      }
    }

    // Capture game state
    try {
      const state = await page.evaluate('window.render_game_to_text()');
      const parsed = JSON.parse(state);
      console.log(`[test] State: mode=${parsed.mode}, player=(${parsed.player?.x}, ${parsed.player?.z}), enemies=${parsed.enemies?.length || 0}, zone=${parsed.zone?.name || 'N/A'}`);
    } catch (e) {
      console.log('[test] Could not read game state:', e.message);
    }

    // Capture screenshot
    const screenshotPath = path.join(opts.screenshotDir, `iteration-${iter + 1}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`[test] Screenshot saved: ${screenshotPath}`);

    // Pause between iterations
    if (iter < opts.iterations - 1) {
      await page.waitForTimeout(opts.pauseMs);
    }
  }

  // Final screenshot of the full page
  const finalPath = path.join(opts.screenshotDir, 'final.png');
  await page.screenshot({ path: finalPath, fullPage: false });
  console.log(`[test] Final screenshot: ${finalPath}`);

  // Report errors
  console.log('\n[test] === Results ===');
  console.log(`[test] Iterations: ${opts.iterations}`);
  console.log(`[test] Console errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    consoleErrors.slice(0, 10).forEach((e, i) => {
      console.log(`[test]   ${i + 1}. ${e}`);
    });
  }
  console.log(`[test] Page errors: ${pageErrors.length}`);
  if (pageErrors.length > 0) {
    pageErrors.slice(0, 10).forEach((e, i) => {
      console.log(`[test]   ${i + 1}. ${e}`);
    });
  }

  // Final game state dump
  try {
    const finalState = await page.evaluate('window.render_game_to_text()');
    console.log(`[test] Final state: ${finalState}`);
  } catch (e) {
    console.log('[test] Could not get final state.');
  }

  await browser.close();
  console.log('[test] Done.');

  // Exit with error code if there were page errors
  if (pageErrors.length > 0) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error('[test] Fatal error:', err);
  process.exit(1);
});
