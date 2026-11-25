const fs = require('node:fs');
const path = require('node:path');

// Folders whose immediate subdirectories are presentation projects.
const PROJECT_ROOTS = ['talks'];

// A project may add its own theme as <project>/theme.css; register all of them.
// Absolute paths keep the themes available from the root or any project.
const projectThemes = PROJECT_ROOTS
  .map(root => path.join(__dirname, root))
  .filter(dir => fs.existsSync(dir))
  .flatMap(dir => fs.readdirSync(dir, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
    .map(entry => path.join(dir, entry.name, 'theme.css')))
  .filter(file => fs.existsSync(file));

function configuration(projectThemes) {
  return {
    themeSet: [path.join(__dirname, 'themes', 'seminar.css'), ...projectThemes],
    html: true,
    allowLocalFiles: true,
    imageScale: 2,
  };
}

module.exports = configuration(projectThemes);
// Provide an external deck's config without exposing a new option to Marp CLI.
Object.defineProperty(module.exports, 'forDeck', {
  value(dir) {
    const theme = path.join(dir, 'theme.css');
    return configuration(fs.existsSync(theme) ? [theme] : []);
  },
});
