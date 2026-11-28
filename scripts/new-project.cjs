// Usage: node scripts/new-project.cjs <name> --workspace <directory> [--flat]
//   --workspace: create the deck in <directory>/slides/<name> (a research project outside this repository).
//   --flat:      create it directly in <directory>/<name> (a folder that holds only decks, such as a seminar series).
//                A template.md in that directory is used as the starter deck when present.
// Decks always live outside this repository; it holds only the shared theme, template and scripts.
const fs = require('node:fs');
const path = require('node:path');

const root = fs.realpathSync(path.resolve(__dirname, '..'));
const theme = path.join(root, 'themes', 'seminar.css');

function reference(from, to) {
  const relative = path.relative(from, to).split(path.sep).join('/');
  return relative.startsWith('.') || path.isAbsolute(relative) ? relative : './' + relative;
}

function inside(parent, child) {
  const rel = path.relative(parent, child);
  return rel === '' || !(rel === '..' || rel.startsWith('..' + path.sep) || path.isAbsolute(rel));
}

function create(args) {
  const [name, flag, location, extra] = args;
  const flat = extra === '--flat';
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(name || '') ||
      !((args.length === 3 && flag === '--workspace' && location) ||
        (args.length === 4 && flag === '--workspace' && location && flat))) {
    throw new Error('Usage: node scripts/new-project.cjs <name> --workspace <directory> [--flat]\nName: letters, digits, "-" and "_", starting with a letter or digit.');
  }
  const workspace = fs.realpathSync(location);
  const parent = flat ? workspace : path.join(workspace, 'slides');
  if (inside(root, workspace) || (fs.existsSync(parent) && fs.realpathSync(parent) !== parent)) {
    throw new Error('Use a folder outside the Marp repository (with a local slides/ directory unless --flat).');
  }
  const personal = path.join(workspace, 'template.md');
  const usePersonal = flat && fs.existsSync(personal);
  const template = usePersonal ? personal : path.join(root, 'templates', 'slide.md');
  const dir = path.join(parent, name);
  fs.mkdirSync(parent, { recursive: true });
  fs.mkdirSync(dir); // Exclusive creation also protects existing decks on concurrent runs.
  try {
    fs.copyFileSync(template, path.join(dir, 'slide.md'));
    const figure = path.join(dir, 'figure');
    if (usePersonal) {
      fs.mkdirSync(figure);
      fs.writeFileSync(path.join(figure, 'README.md'),
        '# Figures\n\nList each image here with its source (paper, page, figure number) and where it is used.\n');
    } else {
      fs.cpSync(path.join(root, 'templates', 'figure'), figure, { recursive: true });
    }

    const config = reference(dir, path.join(root, 'marp.config.cjs'));
    fs.writeFileSync(path.join(dir, 'marp.config.cjs'), `module.exports = require(${JSON.stringify(config)}).forDeck(__dirname);\n`);
    const editorDir = path.join(dir, '.vscode');
    fs.mkdirSync(editorDir);
    fs.symlinkSync(reference(editorDir, theme), path.join(editorDir, 'seminar.css'), 'file');
    fs.writeFileSync(path.join(dir, '.vscode', 'settings.json'), JSON.stringify({
      'markdown.marp.themes': ['./.vscode/seminar.css'],
      'markdown.marp.html': 'all',
    }, null, 2) + '\n');

    require('./workspace-settings.cjs').registerTheme(workspace, theme);
  } catch (error) {
    fs.rmSync(dir, { recursive: true, force: true });
    throw error;
  }
  console.log(`Created ${dir}`);
}

try {
  create(process.argv.slice(2));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
