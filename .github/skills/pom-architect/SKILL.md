---
name: pom-architect
description: "Enforce and auto-apply Page Object Model rules for Playwright + TypeScript projects. Detects violations and fixes them: locators as getters, actions as async methods, no direct page usage in test bodies, assertions only in specs, navigate() using baseURL. Load when creating, reviewing, or refactoring Page Objects or spec files."
---

# POM Architect

Review and improve Playwright Page Objects and their specs. Detect violations and apply small, behavior-preserving fixes when the intended behavior is clear. Never claim a fix was applied unless the file was actually changed. If a transformation could change test behavior or requires missing application details, leave it unchanged and mark it `MANUAL`.

## Project Context

- `BasePage` is expected at `src/ui/pages/BasePage.ts`, as an abstract class with `protected readonly page: Page` and `async navigate(path = '/')`. All Page Objects extend it.
- The requested TypeScript baseline is `target: ES2022` with `useDefineForClassFields: true`. Verify `tsconfig.json` before stating it is configured. Locators are getters by convention and must not access `this.page` during field initialization.
- `baseURL` is expected to be configured in `playwright.config.ts` from `process.env.BASE_URL`, loaded by dotenv. Verify the actual configuration rather than hardcoding an origin.
- The supplied project context expects `src/config/Env.ts` and `src/data/auth.data.ts`; check actual casing and paths before editing imports.

## Rules

1. **All Page Objects extend BasePage.** A Page Object must not define its own constructor or duplicate `navigate()`. Keep Page Objects to locator getters and asynchronous action methods. A constructor in `BasePage` is expected. If `BasePage` is missing or incompatible, report that prerequisite rather than adding duplicate navigation logic to each page.
2. **Locators are getters.** Use getter properties, never constructor-initialized locator fields. Convert fields when the selectors and ownership are unambiguous.
3. **Interactions belong in Page Objects.** Encapsulate UI interactions in descriptive `async` methods. Specs should express scenario intent, not repeat selector/action sequences. Extract actions only when their page ownership and behavior are clear.
4. **No direct `page.*` interactions in test bodies.** Specs must not call `goto`, `locator`, `getBy*`, `click`, `fill`, `press`, or similar interaction APIs directly. The only exception is `page.goto()` in `beforeEach` when no fixture handles navigation; use `'/'` or a relative path, never a hardcoded full URL.
5. **Assertions stay in specs.** Page Objects must not import or call `expect`. Expose the state needed for assertions as public locator getters. Do not add assertion methods as a workaround.
6. **Navigation uses `baseURL`.** Page Objects pass `'/'` or a relative path to `navigate()` and never hardcode a domain.
7. **Correct file placement.** Page Objects: `src/ui/pages/`; components: `src/ui/components/`; fixtures: `src/fixtures/`; test data: `src/data/`; config/environment: `src/config/`. Move files only when ownership is clear and all imports can be updated safely.
8. **No hardcoded credentials or reusable test data in Page Objects.** Accept values as method parameters or use the established data/config layer. Never move secrets into source files.

## Review And Repair Workflow

1. Inspect relevant specs, Page Objects, BasePage, fixtures, and TypeScript/Playwright configuration before deciding a violation exists.
2. Report each violation at its source line. Use `HIGH` for leaked secrets or broken core framework contracts, `MEDIUM` for POM violations, and `LOW` for maintainability issues.
3. Apply safe local fixes. Preserve test intent, names, selectors, and behavior. When extracting interactions, keep assertions in specs and expose only the locators needed by those assertions.
4. Run the narrowest available typecheck or relevant test after edits. If validation cannot run, say so and do not imply success.
5. Re-scan the changed scope and summarize remaining manual work.

## Output Format

Use one entry per violation, in source order:

```text
[pom-architect] SEVERITY — RULE NAME
File:  <path>
Line:  <number>
Issue: <one sentence>
Fix:   <one sentence> | AUTO-APPLIED
```

Use `| MANUAL` instead of `| AUTO-APPLIED` when no safe automatic repair was made. If no violations remain, state that explicitly.