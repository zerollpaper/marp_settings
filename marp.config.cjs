const fs = require('node:fs');
const path = require('node:path');

// Shared CLI options. Decks live outside this repository and load this file
// through their own marp.config.cjs: require('<path>/marp.config.cjs').forDeck(__dirname).
function configuration(projectThemes) {
  return {
    themeSet: [path.join(__dirname, 'themes', 'seminar.css'), ...projectThemes],
    html: true,
    allowLocalFiles: true,
    imageScale: 2,
  };
}

// Running marp in this directory (for example on templates/slide.md) uses the shared theme only.
module.exports = configuration([]);
// A deck may add its own theme as <deck>/theme.css; forDeck registers it.
// Non-enumerable, so Marp CLI does not see it as an option.
Object.defineProperty(module.exports, 'forDeck', {
  value(dir) {
    const theme = path.join(dir, 'theme.css');
    return configuration(fs.existsSync(theme) ? [theme] : []);
  },
});
