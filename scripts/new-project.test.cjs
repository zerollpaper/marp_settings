const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { parse } = require('jsonc-parser');

test('external decks register workspace-local links and preserve existing settings and slides', t => {
  const root = path.resolve(__dirname, '..');
  const project = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'marp 研究-')));
  t.after(() => fs.rmSync(project, { recursive: true, force: true }));
  fs.mkdirSync(path.join(project, '.vscode'));
  const settings = path.join(project, '.vscode', 'settings.json');
  fs.writeFileSync(settings, '{\n  "editor.tabSize": 8,\n  "markdown.marp.themes": [\n    "./other.css", // existing theme\n  ], // theme list\n}\n');
  const create = name => spawnSync(process.execPath, [
    path.join(__dirname, 'new-project.cjs'), name, '--workspace', '.',
  ], { cwd: project, encoding: 'utf8' });

  for (const name of ['first', 'second']) {
    const result = create(name);
    assert.equal(result.status, 0, result.stderr);
  }
  const deck = path.join(project, 'slides', 'first');
  for (const folder of [project, deck]) {
    const config = parse(fs.readFileSync(path.join(folder, '.vscode', 'settings.json'), 'utf8'));
    const [link] = config['markdown.marp.themes'];
    assert.equal(link, './.vscode/seminar.css');
    assert.equal(fs.realpathSync(path.join(folder, link)), path.join(root, 'themes', 'seminar.css'));
    assert.equal(config['markdown.marp.html'], 'all');
  }
  const saved = fs.readFileSync(settings, 'utf8');
  assert.ok(saved.includes('"./other.css", // existing theme'));
  assert.ok(saved.includes('], // theme list'));
  assert.equal(parse(saved)['editor.tabSize'], 8);
  assert.equal(parse(saved)['markdown.marp.themes'].length, 2);
  assert.equal(fs.readFileSync(path.join(deck, 'slide.md'), 'utf8'), fs.readFileSync(path.join(root, 'templates', 'slide.md'), 'utf8'));
  const localTheme = path.join(deck, 'theme.css');
  fs.writeFileSync(localTheme, '/* @theme test */');
  assert.deepEqual(require(path.join(deck, 'marp.config.cjs')).themeSet, [path.join(root, 'themes', 'seminar.css'), localTheme]);
  fs.writeFileSync(path.join(deck, 'slide.md'), '編集済み');
  assert.notEqual(create('first').status, 0);
  assert.equal(fs.readFileSync(path.join(deck, 'slide.md'), 'utf8'), '編集済み');
  assert.equal(fs.readFileSync(settings, 'utf8'), saved);
});

test('--flat creates the deck directly in the workspace and uses its template.md', t => {
  const root = path.resolve(__dirname, '..');
  const series = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'marp 輪講-')));
  t.after(() => fs.rmSync(series, { recursive: true, force: true }));
  fs.writeFileSync(path.join(series, 'template.md'), '---\nmarp: true\ntheme: seminar\n---\n\n# 自分のひな形\n');
  const result = spawnSync(process.execPath, [path.join(__dirname, 'new-project.cjs'), 'talk_1', '--workspace', '.', '--flat'],
    { cwd: series, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const deck = path.join(series, 'talk_1');
  assert.equal(fs.readFileSync(path.join(deck, 'slide.md'), 'utf8'), fs.readFileSync(path.join(series, 'template.md'), 'utf8'));
  assert.ok(fs.existsSync(path.join(deck, 'figure', 'README.md')));
  assert.ok(!fs.existsSync(path.join(series, 'slides')));
  assert.deepEqual(require(path.join(deck, 'marp.config.cjs')).themeSet, [path.join(root, 'themes', 'seminar.css')]);
  assert.equal(fs.realpathSync(path.join(series, '.vscode', 'seminar.css')), path.join(root, 'themes', 'seminar.css'));
});

test('a deck is never created inside this repository', () => {
  const root = path.resolve(__dirname, '..');
  const result = spawnSync(process.execPath, [path.join(__dirname, 'new-project.cjs'), 'inside'], { cwd: root, encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /--workspace/);
  assert.ok(!fs.existsSync(path.join(root, 'talks')));
  const nested = spawnSync(process.execPath, [path.join(__dirname, 'new-project.cjs'), 'inside', '--workspace', '.', '--flat'],
    { cwd: path.join(root, 'templates'), encoding: 'utf8' });
  assert.notEqual(nested.status, 0);
  assert.ok(!fs.existsSync(path.join(root, 'templates', 'inside')));
});
