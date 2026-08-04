const fs = require('fs');
const script = fs.readFileSync('script.js', 'utf-8');

let inTemplate = false;
let inSingleQ = false;
let inDoubleQ = false;
let inBlockComment = false;
let inLineComment = false;
let lineNum = 1;
let templateStack = [];

for (let i = 0; i < script.length; i++) {
  const ch = script[i];
  const prev = i > 0 ? script[i-1] : '';

  if (ch === '\n') { lineNum++; continue; }

  if (inLineComment && ch === '\n') { inLineComment = false; continue; }
  if (inBlockComment && prev === '*' && ch === '/') { inBlockComment = false; continue; }
  if (inBlockComment || inLineComment) continue;

  if (!inSingleQ && !inDoubleQ && !inTemplate) {
    if (ch === '/' && i+1 < script.length && script[i+1] === '/') { inLineComment = true; i++; continue; }
    if (ch === '/' && i+1 < script.length && script[i+1] === '*') { inBlockComment = true; i++; continue; }
  }

  if (prev === '\') continue; // skip escaped chars

  if (!inDoubleQ && !inTemplate) { if (ch === "'") { inSingleQ = !inSingleQ; continue; } }
  if (!inSingleQ && !inTemplate) { if (ch === '"') { inDoubleQ = !inDoubleQ; continue; } }
  if (!inSingleQ && !inDoubleQ) {
    if (ch === '`') {
      if (inTemplate) {
        templateStack.pop();
        inTemplate = templateStack.length > 0;
      } else {
        templateStack.push(lineNum);
        inTemplate = true;
      }
    }
  }
}

if (templateStack.length > 0) {
  console.log('UNCLOSED template(s) opened at line(s): ' + templateStack.join(', '));
  const lines = script.split('\n');
  templateStack.forEach(l => {
    console.log('  Line ' + l + ': ' + (lines[l-1] || '').trim().substring(0, 120));
  });
} else {
  console.log('OK: All template literals are balanced');
}
