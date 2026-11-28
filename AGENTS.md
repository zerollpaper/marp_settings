# Marp shared seminar theme

- This repository holds only the shared theme, the starter deck and the scripts. Decks live in the user's own folders outside it (a research project, or a folder that holds a seminar series), which may have their own `AGENTS.md`. `templates/` holds the starter deck, which doubles as the public sample of every layout; it is not a project. Work in the deck named by the user; preserve their edits, speaker scripts and notes.
- Read `README.md` for the supported layouts and workflow.
- For a deck in a research project, run `node <this repository>/scripts/new-project.cjs <name> --workspace <project>`. It creates `<project>/slides/<name>/` from the public template and registers the shared theme for both the project and the deck.
- For a folder that holds only decks (such as a seminar series), add `--flat`: the deck is created directly as `<folder>/<name>/`, using `<folder>/template.md` when present.
- The script refuses to create a deck inside this repository. Never overwrite an existing deck with a template, and do not create deck folders by hand.
- The shared theme is `themes/seminar.css`, named `seminar`. Use it by default; keep `slide.md` focused on content and speaker notes. Do not copy the common CSS into a deck.
- Put reusable visual changes in the shared theme. Use `<deck>/theme.css` only for necessary deck-specific differences: give it a unique `@theme` name and `@import "seminar"`, select it in the deck's front matter, and add it to the deck's `.vscode/settings.json` for the VS Code preview. The CLI registers it automatically.
- Keep styling out of `slide.md`: deck-wide styling goes in `<deck>/theme.css`, and a tweak for one slide may use a short `<style scoped>` block (a few lines). Do not use the front-matter `style:` directive or an unscoped `<style>` block in `slide.md`.
- Root `marp.config.cjs` owns CLI options. Each deck's generated `marp.config.cjs` calls `require('<relative path>/marp.config.cjs').forDeck(__dirname)`; Marp CLI does not search parent directories automatically. Do not duplicate shared options in deck configs.
- VS Code reads the theme through `.vscode/seminar.css`, a symbolic link to the shared theme that the script creates in the deck and in its parent folder, because the extension accepts only paths inside the opened folder.
- Export from a deck folder with `marp slide.md --pdf` or `marp slide.md -o slide.html` (or this repository's `node_modules/.bin/marp`). Live preview: `marp slide.md --preview --watch`. No `--config-file` is required.
- Record the source of every image in the deck's `figure/README.md` (paper, page, figure number, and the slide that uses it).
- After styling changes, render and inspect the affected slides. For refactoring intended to preserve appearance, compare rendered pages before and after.
- Nothing personal or project-specific belongs in this repository: it is public.
- Keep `README.md` aligned with the supported common theme. It is documentation, not a requirement to retain unused features.
