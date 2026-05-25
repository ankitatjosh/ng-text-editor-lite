# Contribution Guide

Thank you for contributing to `ng-text-editor-lite`. This guide covers local setup, development workflow, testing, and the pull request process.

---

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | 18+ |
| npm | 9+ |
| Angular CLI | 18+ (via `npx`) |

---

## Local setup

```bash
git clone https://github.com/your-org/ng-text-editor-lite.git
cd ng-text-editor-lite
npm install
```

---

## Project structure

```
ng-text-editor-lite/
  projects/
    ng-text-editor-lite/   ← the library source
      src/lib/
        components/        ← EditorComponent, ToolbarComponent, EditableSurfaceComponent
        services/          ← SanitizerService, MarkdownParserService, etc.
        models/            ← EditorConfig, EditorEventPayload interfaces
      src/public-api.ts    ← package export surface
    demo/                  ← local development playground app
  docs/                    ← documentation (this directory)
  dist/                    ← build output (git-ignored)
```

---

## Development workflow

### Run the demo app

```bash
npx @angular/cli serve demo
```

Open [http://localhost:4200](http://localhost:4200). The demo app hot-reloads on source changes to both the library and the demo app.

> **Note:** The demo app imports the library from `dist/`. Run `npm run build:lib` after library changes to see them reflected in the demo.

### Build the library

```bash
npx @angular/cli build ng-text-editor-lite
# or
npm run build
```

Output is written to `dist/ng-text-editor-lite`.

---

## Running tests

### All library tests

```bash
npx @angular/cli test ng-text-editor-lite --watch=false
```

### All demo app tests

```bash
npx @angular/cli test demo --watch=false
```

### Watch mode (during development)

```bash
npx @angular/cli test ng-text-editor-lite
```

### Run a single spec file

```bash
npx @angular/cli test ng-text-editor-lite --include="**/sanitizer.service.spec.ts"
```

### Coverage target

The project requires a minimum of **85% coverage**. Coverage is reported at the end of each test run.

---

## Linting

```bash
npx @angular/cli lint ng-text-editor-lite
```

All lint rules must pass before a PR is merged.

---

## What to contribute

### Bug fixes

1. Open an issue describing the bug with a minimal reproduction.
2. Reference the issue in your PR.
3. Add or update a spec that fails before your fix and passes after.

### New features

1. Open an issue or discussion before starting — some features are intentionally out of scope for v1 (see the [PRD non-goals](../CLAUDE.md)).
2. Keep scope minimal. One feature per PR.
3. Add specs covering the new behaviour.
4. Update the relevant doc in `docs/` if the feature changes the public API or behaviour.

### Documentation

Doc-only PRs are welcome. Edit the relevant file in `docs/` and open a PR.

---

## Coding standards

- **Standalone-first**: new components use `standalone: true`. No NgModules for library internals.
- **No external editor engines**: the editor is built on `contenteditable` only. PRs that introduce ProseMirror, Quill, TipTap, or similar will not be accepted.
- **Sanitization is mandatory**: all HTML entering the editor must go through `SanitizerService`. Do not bypass it.
- **Tree-shaking**: services use `providedIn: 'root'` or component-level providers. Never force-register via a shared NgModule.
- **Angular Signals**: prefer `signal()` for internal reactive state where compatible with Angular 18+.
- **No comments explaining what the code does**: only add comments for non-obvious constraints, workarounds, or subtle invariants.
- **No `any`**: TypeScript strict mode is enabled. Use proper types or generics.

---

## Pull request checklist

- [ ] All tests pass (`ng test ng-text-editor-lite --watch=false`)
- [ ] No lint errors (`ng lint ng-text-editor-lite`)
- [ ] Library builds cleanly (`ng build ng-text-editor-lite`)
- [ ] New behaviour is covered by specs
- [ ] Relevant `docs/` pages updated if the public API or behaviour changed
- [ ] PR description explains the problem and the approach

---

## Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **PATCH** — bug fixes, no API changes
- **MINOR** — new backwards-compatible features
- **MAJOR** — breaking API changes

---

## Related

- [Installation →](./installation.md)
- [Angular setup examples →](./angular-setup.md)
- [Security notes →](./security.md)
