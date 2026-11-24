---
name: automation-architect
description: "Hub skill that orchestrates pom-architect and test-standards for Playwright + TypeScript projects. Use for full architecture enforcement (review + auto-fix) on existing files, or to scaffold new Page Objects, fixtures, and spec files following all agreed patterns. Invoke sub-skills independently for targeted checks."
---

# Automation Architect

Coordinate the POM and test-quality skills for this Playwright + TypeScript project. For a full review, load and apply both `.github/skills/pom-architect/SKILL.md` and `.github/skills/test-standards/SKILL.md`; do not silently skip either. For targeted work, use the relevant sub-skill independently. Detect violations and auto-apply safe fixes while preserving behavior and identifying any manual work.

## Project Context

- `BasePage` is expected at `src/ui/pages/BasePage.ts`, abstract, with a protected `Page` and `async navigate(path = '/')`; Page Objects extend it.
- The requested TypeScript baseline is `target: ES2022` with `useDefineForClassFields: true`; inspect the actual `tsconfig.json` and report mismatches instead of assuming this is configured.
- `baseURL` is expected in `playwright.config.ts` via `process.env.BASE_URL`, loaded by dotenv. Page Objects should navigate with relative paths.
- The target environment module is `src/config/Env.ts`; the target user data module is `src/data/auth.data.ts`. Check actual paths and casing before editing.
- Path aliases are the requested import convention; verify their mappings and test/runtime resolution before replacing imports.

## Invocation Modes

### Mode 1 — Full Pipeline (Default)

Triggered by “aplicar arquitectura”, “apply architecture”, “full review”, or “enforce all rules”.

0. Run `spec-requirements-standard` M0 on `docs/test-cases/**` (report only, no auto-fix except Q13). TCs graded Incomplete are listed as manual items.
1. Identify all relevant specs, Page Objects, components, fixtures, data, and configuration files.
2. Apply the `pom-architect` workflow: detect and auto-fix safe POM violations.
3. Apply the `test-standards` workflow: detect and auto-fix safe test/fixture violations.
4. Apply `lifecycle-architect` workflow for API-backed lifecycle scenarios.
5. Run `api-setup-teardown-standard` workflow for API setup and cleanup, if this project uses the named sub-skill.
6. Run `spec-organisation-standard` on `tests/**/*.spec.ts`:
   - Enforce folder hierarchy, names, TC IDs, describe names, and `test.step()`.
   - Auto-fix safe organisation violations.
7. Run `spec-quality-lifecycle-standard` on `tests/**/*.spec.ts` and `src/ui/pages/**/*.ts`:
   - Detect all TC quality violations.
   - Auto-fix every fixable violation (R3, R4).
   - Collect R1, R2, R5-R10 items as manual fixes.
8. Run focused validation and report remaining manual fixes. Do not claim a sub-skill completed unless its review was actually performed.

### Mode 2 — Structure Only

Triggered by “revisar estructura”, “check structure”, or “verify folders”.

1. Check file ownership and placement against the target folders.
2. Check imports in `src/` and `tests/` against the requested aliases and verify alias configuration.
3. Report only; make no changes unless the user explicitly requests auto-fixes.

### Mode 3 — Scaffold New File

Triggered by “generar”, “crear”, “scaffold”, “nuevo Page Object”, or “new page”.

1. Determine the page name, relative URL path, required locators/actions, and authentication need from the request and nearby code. Ask only for details that cannot be inferred safely.
2. Generate `src/ui/pages/<Name>Page.ts` extending `BasePage`, with locator getters and asynchronous action methods. Do not add a constructor or duplicate `navigate()`.
3. Register the Page Object in `src/fixtures/index.ts`. For unauthenticated pages, use `{ page }` and navigate before `use()`. For authenticated pages, use the existing authenticated fixture contract and do not navigate again.
4. Generate `tests/<name>.spec.ts` importing from `@fixtures` and `@data`, with a descriptive `test.describe()` block.
5. Verify zero relative imports in all generated files, then validate fixture types and the narrowest applicable test/typecheck.

### Mode 7 — TC Quality Review

**Triggers:** `"review tc quality"` · `"check test quality"` · `"scan for flaky patterns"` · `"tc quality"`

**When to use:** After writing or refactoring test cases, or when a test shows intermittent failures. Run before every PR that includes new or modified specs.

1. Load and invoke `spec-quality-lifecycle-standard`.
2. Determine mode:
   - Single file provided → Enforce on that file only.
   - No file provided → Enforce on all `tests/**/*.spec.ts`.
3. Forward all output verbatim.

Requests containing `"assess test cases"`, `"refine test case"`, `"write test case"`, or `"tc coverage"` are forwarded to `spec-requirements-standard` as phase 1 of the TC lifecycle.

**Note:** Load `spec-quality-lifecycle-standard` directly for standalone TC review without activating the hub.

## Sub-Skill Registry

| Skill | Domain | File Scope | Rules / Checks | Added | Status |
|-------|--------|------------|----------------|-------|--------|
| `pom-architect` | Page Object architecture | `src/ui/pages/**/*.ts` | POM structure and locators | M1 | Active |
| `test-standards` | Test structure and fixtures | `tests/**/*.spec.ts` · `src/fixtures/**/*.ts` | Imports, fixtures, independence | M1 | Active |
| `lifecycle-architect` | API-backed resource lifecycle | `tests/**/*.spec.ts` · `src/api/**/*.ts` | Preconditions, read-back assertions, cleanup | M6 | Active |
| `spec-quality-lifecycle-standard` | TC body quality · assertions · selectors · wait strategies · flakiness prevention | `tests/**/*.spec.ts` · `src/ui/pages/**/*.ts` | R1-R10 | M7 | Active |
| `spec-requirements-standard` | TC specification: traceability · preconditions · data · oracles · postconditions · readiness | `docs/test-cases/**/*.md` | Q1-Q13 · M0-M4 | M6 | Active |
| `spec-organisation-standard` | Spec organisation: folder hierarchy · filenames · TC IDs · describe names · test steps | `tests/**/*.spec.ts` | R1-R5 | M6 | Active |

## Scan Scope Ownership

| File / Scope | Owner skill | Concern |
|--------------|-------------|---------|
| `tests/**/*.spec.ts` — preconditions/postconditions | `spec-quality-lifecycle-standard` | R1, R2 |
| `tests/**/*.spec.ts` — assertion quality and waits | `spec-quality-lifecycle-standard` | R3, R4, R6, R9, R10 |
| `tests/**/*.spec.ts` — test independence | `spec-quality-lifecycle-standard` | R7, R8 |
| `src/ui/pages/**/*.ts` — locator resilience | `spec-quality-lifecycle-standard` | R5 |
| `docs/test-cases/**/*.md` — specification content quality | `spec-requirements-standard` | Q1-Q13 |
| `tests/**/*.spec.ts` — organisation and step structure | `spec-organisation-standard` | R1-R5 |

## Sub-Skill Invocation Reference

| Goal | Skill to load | Trigger phrase example |
|------|---------------|------------------------|
| Review TC quality and anti-flakiness patterns | `spec-quality-lifecycle-standard` | `"review tc quality"` |
| Score TC specifications | `spec-requirements-standard` | `"assess test cases"` |
| Upgrade an incomplete TC | `spec-requirements-standard` | `"refine test case TC02"` |
| Prepare a TC for automation | `spec-requirements-standard` | `"automation readiness TC02"` |
| Fix TC folder / naming / step violations | `spec-organisation-standard` | `"check spec structure"` |

## Hub Growth Policy

<!-- Mode slot usage: (7 of 10 slots used) -->

The hub grows by adding new modes as the course progresses (M5 adds Modes 4–6, later modules may add more). To prevent uncontrolled growth and context overload, the following rules are mandatory and must be documented inside `automation-architect` `SKILL.md`:

**Rule 1 — Add a mode only for a real gap.**
A new mode is justified only when no existing mode (1–N) can detect the problem it targets. Before adding a mode, state explicitly which existing modes were considered and why they do not cover the gap.

**Rule 2 — Document the gap in an ADR first.**
Every new mode must be preceded by an ADR in `docs/decisions/` that records: the gap, the options considered (including extending an existing mode vs. adding a new one), and the decision. The mode is not added until the ADR exists.

**Rule 3 — One domain per mode.**
Each mode targets exactly one domain (e.g., git conventions, lifecycle process, refactor guidance). A mode that detects across multiple unrelated domains must be split or merged into the closest existing mode.

**Rule 4 — Maximum 10 modes.**
If a new mode would exceed 10 total modes, the team must first review existing modes for consolidation opportunities before adding. This limit exists to keep the SKILL.md within a size that an LLM agent can process reliably in a single context window.

**Rule 5 — Retire modes that no longer apply.**
When a module's scope is complete and a mode is no longer relevant to the active project, mark it as `[RETIRED]` in the SKILL.md with the reason. Do not delete — the history is part of the ADR record.

These rules are enforced by the team, not by the skill itself. They must appear verbatim in the `## Hub Growth Policy` section of `automation-architect` `SKILL.md`.

## Output

For each violation, preserve the owning skill's required format, file path, line number, severity, and whether a fix was applied. Then provide the unified summary:

```text
[automation-architect] PIPELINE COMPLETE
─────────────────────────────────────────
ui-pom-standard:             X violations found — Y auto-applied
spec-code-standard:          X violations found — Y auto-applied
spec-organisation-standard:  X violations found — Y auto-applied
api-setup-teardown-standard: X violations found — Y auto-applied
spec-quality-lifecycle-standard: X violations found — Y auto-applied
pom-architect:               X violations found — Y auto-applied
test-standards:              X violations found — Y auto-applied
Remaining manual fixes: <list if any, or "none">
[automation-architect] ✅ All rules satisfied.
```

Do not print the final success line if violations remain or validation was blocked; state the blocker and remaining manual fixes instead.

For scaffolding, report:

```text
[automation-architect] SCAFFOLD COMPLETE
─────────────────────────────────────────
Created:  src/ui/pages/<Name>Page.ts
Updated:  src/fixtures/index.ts
Created:  tests/<name>.spec.ts
```