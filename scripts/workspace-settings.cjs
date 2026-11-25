const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { parse, modify, applyEdits } = require('jsonc-parser');

function registerTheme(workspace, theme) {
  const dir = path.join(workspace, '.vscode');
  fs.mkdirSync(dir, { recursive: true });
  if (fs.realpathSync(dir) !== dir) throw new Error('Expected a workspace-local .vscode directory');
  const file = path.join(dir, 'settings.json');
  const existing = fs.lstatSync(file, { throwIfNoEntry: false });
  if (existing && !existing.isFile()) throw new Error(`Expected a regular file: ${file}`);
  const original = existing ? fs.readFileSync(file, 'utf8') : '{}\n';
  const bom = original.startsWith('\uFEFF') ? '\uFEFF' : '';
  let source = original.slice(bom.length);
  const errors = [];
  const settings = parse(source, errors, { allowTrailingComma: true });
  if (errors.length || !settings || typeof settings !== 'object' || Array.isArray(settings)) {
    throw new Error(`Check the JSONC in ${file}`);
  }
  const key = 'markdown.marp.themes';
  const themes = settings[key];
  if (themes !== undefined && !Array.isArray(themes)) throw new Error(`Expected an array for ${key} in ${file}`);
  const edit = (keys, value) => {
    const formattingOptions = { insertSpaces: true, tabSize: 2, eol: source.includes('\r\n') ? '\r\n' : '\n' };
    source = applyEdits(source, modify(source, keys, value, { formattingOptions, getInsertionIndex: () => 0, isArrayInsertion: true }));
  };
  const localTheme = './.vscode/seminar.css';
  if (!themes) edit([key], [localTheme]);
  else if (!themes.includes(localTheme)) edit([key, 0], localTheme);
  if (settings['markdown.marp.html'] !== 'all') edit(['markdown.marp.html'], 'all');
  const updated = bom + source;
  // The extension accepts local paths only inside the opened workspace.
  const link = path.join(dir, 'seminar.css');
  try {
    fs.symlinkSync(path.relative(dir, theme), link, 'file');
  } catch (error) {
    if (error.code !== 'EEXIST' || fs.realpathSync(link) !== theme) {
      throw new Error(`Cannot link the shared theme at ${link}: ${error.message}`);
    }
  }
  if (updated === original) return;
  const tmp = path.join(dir, `.marp-${randomUUID()}.tmp`);
  try {
    fs.writeFileSync(tmp, updated, { flag: 'wx', mode: existing?.mode });
    if (existing ? fs.readFileSync(file, 'utf8') !== original : fs.existsSync(file)) {
      throw new Error(`Settings changed during generation, retry: ${file}`);
    }
    fs.renameSync(tmp, file);
  } finally {
    fs.rmSync(tmp, { force: true });
  }
}

module.exports = { registerTheme };
