#!/usr/bin/env node
/**
 * test.js — Simple test runner for clay-spell-craft
 *
 * Starts a local HTTP server and runs Playwright tests against it.
 *
 * Usage: node scripts/test.js [--headed] [--iterations N] [--port PORT]
 */

const { spawn } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const port = args.includes('--port') ? args[args.indexOf('--port') + 1] : '5173';
const extraArgs = args.filter(a => a !== '--port' && a !== port);

// Start HTTP server
console.log(`[test] Starting HTTP server on port ${port}...`);
const server = spawn('python3', ['-m', 'http.server', port], {
  cwd: path.join(__dirname, '..'),
  stdio: 'pipe',
});

// Wait for server to start, then run tests
setTimeout(() => {
  console.log('[test] Server ready. Running tests...');
  const testArgs = [
    path.join(__dirname, 'web_game_playwright_client.js'),
    '--url', `http://localhost:${port}`,
    ...extraArgs,
  ];

  const test = spawn('node', testArgs, {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
  });

  test.on('exit', code => {
    server.kill();
    process.exit(code || 0);
  });
}, 2000);

server.on('error', err => {
  console.error('[test] Server error:', err);
  process.exit(1);
});
