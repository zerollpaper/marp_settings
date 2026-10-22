// Usage: node scripts/new-project.cjs <project-name>
// Creates talks/<project-name>/ with slide.md, figure/, and the CLI / VS Code settings.
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const name = process.argv[2];
if (!name || !/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(name)) {
  console.error('Usage: node scripts/new-project.cjs <project-name>');
  console.error('       (letters, digits, "-" and "_" only, e.g. seminar_2027_ss)');
  process.exit(1);
}

const talks = path.join(root, 'talks');
const dir = path.join(talks, name);
if (fs.existsSync(dir)) {
  console.error(`Already exists; no files changed: ${dir}`);
  process.exit(1);
}

// A personal template in talks/template.md (your name, lab, ...) wins over the shared one.
const personal = path.join(talks, 'template.md');
const template = fs.existsSync(personal) ? personal : path.join(root, 'templates', 'slide.md');

fs.mkdirSync(path.join(dir, '.vscode'), { recursive: true });
fs.copyFileSync(template, path.join(dir, 'slide.md'));
if (template === personal) {
  // The personal template does not use the sample figure; start with an empty list.
  fs.mkdirSync(path.join(dir, 'figure'));
  fs.writeFileSync(path.join(dir, 'figure', 'README.md'),
    '# Figures\n\nList each image here with its source (paper, page, figure number) and where it is used.\n');
} else {
  // The shared template is also the sample deck; copy the image it uses.
  fs.cpSync(path.join(root, 'templates', 'figure'), path.join(dir, 'figure'), { recursive: true });
}
fs.writeFileSync(path.join(dir, 'marp.config.cjs'),
  "// Delegate to the shared configuration; do not duplicate options here.\nmodule.exports = require('../../marp.config.cjs');\n");
fs.writeFileSync(path.join(dir, '.vscode', 'settings.json'), JSON.stringify({
  'markdown.marp.themes': ['../../themes/seminar.css'],
  'markdown.marp.html': 'all',
}, null, 2) + '\n');

console.log(`Created ${path.relative(root, dir)} (template: ${path.relative(root, template)})`);
