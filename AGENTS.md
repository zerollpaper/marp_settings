# Marp presentation workspace

- Presentation projects live in `talks/<name>/` (personal, git-ignored here; may be a separate private repository with its own `AGENTS.md`). `templates/` holds the starter deck, which doubles as the public sample of every layout; it is not a project. Work in the project named by the user; preserve their edits, speaker scripts and notes.
- Read `README.md` for the supported layouts and workflow.
- For a new project, run `node scripts/new-project.cjs <name>` from this directory (or by its absolute path). It creates `talks/<name>/` and uses `talks/template.md` if present, otherwise `templates/slide.md` with `templates/figure/`. Never overwrite an existing project with a template, and do not create project folders by hand.
- The shared theme is `themes/seminar.css`, named `seminar`. Use it by default; keep `slide.md` focused on content and speaker notes. Do not copy the common CSS into a project.
- Put reusable visual changes in the shared theme. Use `<project>/theme.css` only for necessary project-specific differences: give it a unique `@theme` name and `@import "seminar"`. Register that file in both root and project `.vscode/settings.json`, and select its theme in the project's front matter. The shared CLI config automatically discovers `theme.css` in each project under `talks/`.
- Root `marp.config.cjs` owns CLI options. Each project needs only `module.exports = require('../../marp.config.cjs');` in its own `marp.config.cjs`; Marp CLI does not search parent directories automatically. Do not duplicate shared options in project configs.
- Support VS Code opened at either the root or the individual project. Keep the corresponding theme registrations consistent.
- Export from a project with `marp slide.md --pdf` or `marp slide.md -o slide.html` (or `npx marp ...` when installed locally). Live preview: `marp slide.md --preview --watch`. No `--config-file` is required.
- Record the source of every image in the project's `figure/README.md` (paper, page, figure number, and the slide that uses it).
- After styling changes, render and inspect the affected slides. For refactoring intended to preserve appearance, compare rendered pages before and after.
- Nothing personal or project-specific belongs outside `talks/`: this root is a public repository.
- Keep `README.md` aligned with the supported common theme. It is documentation, not a requirement to retain unused features.
