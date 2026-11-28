// DESIGN.md holds roles and rules only; values live in the CSS variables of themes/seminar.css.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const design = fs.readFileSync(path.join(root, 'DESIGN.md'), 'utf8');
const css = fs.readFileSync(path.join(root, 'themes', 'seminar.css'), 'utf8');

test('DESIGN.md writes no color or size values', () => {
  assert.deepEqual(design.match(/#[0-9a-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|pt|em|rem)\b/g) ?? [], []);
});

test('every CSS variable named in DESIGN.md is defined in the theme', () => {
  const named = [...new Set(design.match(/--[a-z][a-z0-9-]*/g))];
  assert.ok(named.length > 0);
  const missing = named.filter(name => !css.includes(`${name}:`));
  assert.deepEqual(missing, []);
});

test('every emphasis class in DESIGN.md is styled in the theme', () => {
  for (const name of ['accent', 'box', 'panel']) {
    assert.ok(design.includes(`class="${name}"`), name);
    assert.match(css, new RegExp(`\\.${name}\\b`), name);
  }
});
