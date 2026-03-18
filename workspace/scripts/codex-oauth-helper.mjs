import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { loginOpenAICodex } from '/home/laurovitor/.nvm/versions/node/v24.14.0/lib/node_modules/openclaw/node_modules/@mariozechner/pi-ai/dist/oauth.js';

const profileId = process.argv[2];
if (!profileId) {
  console.error('Usage: node codex-oauth-helper.mjs <profileId>');
  process.exit(2);
}

const authPath = '/home/laurovitor/.openclaw/agents/main/agent/auth-profiles.json';

function loadStore() {
  try {
    return JSON.parse(fs.readFileSync(authPath, 'utf8'));
  } catch {
    return { version: 1, profiles: {}, lastGood: {}, usageStats: {} };
  }
}

function saveStore(store) {
  fs.mkdirSync(path.dirname(authPath), { recursive: true });
  fs.writeFileSync(authPath, JSON.stringify(store, null, 2) + '\n');
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function waitForLine(promptText = '') {
  return new Promise((resolve, reject) => {
    if (promptText) process.stdout.write(promptText);
    rl.once('line', (line) => resolve(line.trim()));
    rl.once('close', () => reject(new Error('stdin closed')));
  });
}

try {
  const creds = await loginOpenAICodex({
    onAuth: ({ url }) => {
      console.log('OAUTH_URL:' + url);
      console.log('PASTE_CALLBACK');
    },
    onPrompt: async () => waitForLine('CALLBACK> '),
    onManualCodeInput: async () => waitForLine('CALLBACK> '),
    onProgress: (msg) => console.log('PROGRESS:' + msg),
    originator: 'pi',
  });

  const store = loadStore();
  store.version = store.version || 1;
  store.profiles ||= {};
  store.lastGood ||= {};
  store.usageStats ||= {};

  store.profiles[profileId] = {
    type: 'oauth',
    provider: 'openai-codex',
    access: creds.access,
    refresh: creds.refresh,
    expires: creds.expires,
    accountId: creds.accountId,
  };
  store.lastGood['openai-codex'] = profileId;
  store.usageStats[profileId] ||= { errorCount: 0, lastUsed: 0 };

  saveStore(store);
  console.log('SAVED_PROFILE:' + profileId);
  process.exit(0);
} catch (err) {
  console.error('ERROR:' + (err?.stack || err?.message || String(err)));
  process.exit(1);
} finally {
  rl.close();
}
