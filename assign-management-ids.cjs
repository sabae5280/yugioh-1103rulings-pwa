#!/usr/bin/env node
// Assign persistent, globally unique IDs to new static Q&A records before publishing.
// Run from the repository root with: node assign-management-ids.cjs
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');

const root = __dirname;
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const sources = [...index.matchAll(/<script\s+src=["']\.\/([^"']+\.js)["']/g)]
  .map((match) => match[1])
  .filter((name) => /^(?:rulings|corrections?|.*-overview-fixes)[\w-]*\.js$/i.test(name));
if (!sources.length) throw new Error('index.html から裁定データのJSファイルを確認できません。');

const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const usedIds = new Set();
for (const name of sources) {
  const text = fs.readFileSync(path.join(root, name), 'utf8');
  for (const match of text.matchAll(/\bR-[A-Z2-9]{10}\b/g)) usedIds.add(match[0]);
}
function createId() {
  let id;
  do {
    const bytes = crypto.randomBytes(10);
    id = `R-${Array.from(bytes, (byte) => alphabet[byte & 31]).join('')}`;
  } while (usedIds.has(id));
  usedIds.add(id);
  return id;
}

function tokenize(text) {
  const tokens = [];
  for (let i = 0; i < text.length;) {
    const start = i;
    const c = text[i];
    if (/\s/.test(c)) { i++; continue; }
    if (c === '/' && text[i + 1] === '/') {
      i += 2;
      while (i < text.length && text[i] !== '\n') i++;
      continue;
    }
    if (c === '/' && text[i + 1] === '*') {
      i += 2;
      while (i < text.length && !(text[i] === '*' && text[i + 1] === '/')) i++;
      i = Math.min(text.length, i + 2);
      continue;
    }
    if (c === '"' || c === "'") {
      const quote = c;
      i++;
      while (i < text.length) {
        if (text[i] === '\\') { i += 2; continue; }
        if (text[i++] === quote) break;
      }
      const raw = text.slice(start, i);
      let value = raw.slice(1, -1);
      if (quote === '"') {
        try { value = JSON.parse(raw); } catch {}
      }
      tokens.push({ type: 'string', value, start, end: i });
      continue;
    }
    if (c === '`') {
      i++;
      while (i < text.length) {
        if (text[i] === '\\') { i += 2; continue; }
        if (text[i++] === '`') break;
      }
      const raw = text.slice(start, i);
      tokens.push({ type: raw.includes('${') ? 'dynamic-template' : 'string', start, end: i });
      continue;
    }
    if (/[A-Za-z_$]/.test(c)) {
      i++;
      while (i < text.length && /[\w$]/.test(text[i])) i++;
      tokens.push({ type: 'identifier', value: text.slice(start, i), start, end: i });
      continue;
    }
    tokens.push({ type: 'punct', value: c, start, end: ++i });
  }
  return tokens;
}

function findUnidentifiedStaticQa(text) {
  const tokens = tokenize(text);
  const stack = [];
  const pairs = [];
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].value === '{') stack.push(i);
    else if (tokens[i].value === '}') {
      const open = stack.pop();
      if (open !== undefined) pairs.push([open, i]);
    }
  }
  const targets = [];
  for (const [open, close] of pairs) {
    let depth = 0;
    const properties = new Map();
    for (let i = open + 1; i < close; i++) {
      const token = tokens[i];
      if (token.value === '{') { depth++; continue; }
      if (token.value === '}') { depth--; continue; }
      if (depth !== 0 || !['identifier', 'string'].includes(token.type)) continue;
      const key = token.value;
      if (!['question', 'answer', 'managementId'].includes(key) || tokens[i + 1]?.value !== ':') continue;
      properties.set(key, tokens[i + 2]);
    }
    if (properties.has('question') && properties.has('answer') && !properties.has('managementId') &&
        properties.get('question')?.type === 'string' && properties.get('answer')?.type === 'string') {
      targets.push({ position: tokens[close].start, trailingComma: tokens[close - 1]?.value === ',' });
    }
  }
  return targets;
}

const changed = new Map();
let added = 0;
for (const name of sources) {
  let text = fs.readFileSync(path.join(root, name), 'utf8');
  const targets = findUnidentifiedStaticQa(text).sort((a, b) => b.position - a.position);
  for (const target of targets) {
    const property = `${target.trailingComma ? '' : ','} managementId: "${createId()}"`;
    text = text.slice(0, target.position) + property + text.slice(target.position);
    added++;
  }
  changed.set(name, text);
}

// Validate the composed site data before writing: every active Q&A must have a
// valid ID, and no ID may be shared even when one ruling is copied to another card.
const context = { window: {} };
vm.createContext(context);
for (const name of sources) vm.runInContext(changed.get(name), context, { filename: name });
const active = (context.window.RULINGS || []).flatMap((card) => (card.qa || []).map((qa) => ({ card: card.name, qa })));
const seen = new Set();
const errors = [];
for (const { card, qa } of active) {
  if (!/^R-[A-Z2-9]{10}$/.test(qa.managementId || '')) errors.push(`${card}: 管理IDなし`);
  else if (seen.has(qa.managementId)) errors.push(`${card}: 管理ID重複 ${qa.managementId}`);
  else seen.add(qa.managementId);
}
if (errors.length) throw new Error(`検証失敗（${errors.length}件）:\n${errors.slice(0, 20).join('\n')}`);

for (const [name, text] of changed) fs.writeFileSync(path.join(root, name), text);
console.log(`確認した裁定JS: ${sources.join(', ')}`);
console.log(`新規ID付与: ${added}件 / 実装中Q&A: ${active.length}件 / 重複: 0件`);
