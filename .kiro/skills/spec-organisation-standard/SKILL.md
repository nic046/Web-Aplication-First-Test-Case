---
name: spec-organisation-standard
description: >
  Enforce and auto-apply organisational and lifecycle standards for spec files in
  Playwright + TypeScript projects. Covers folder hierarchy, file naming, TC ID format,
  describe-block naming, and test step definition using test.step().
---

# Spec Organisation Standard

## Project Context

- Spec files live under `tests/ui/{suite}/{feature}/TC{N}-{short-name}.spec.ts`.
- Suites are `smoke` for critical paths and `regression` for edge and negative paths.
- The feature folder names functionality, not a page.
- TC IDs validate format only; they do not verify an external test-management system.
- `TC0` is reserved for exercises or examples outside the main suite.
- One spec file per TC; data-driven variants stay in the same file.
- `test.step()` is the only accepted mechanism for labelling steps.

## Rules

### R1 - FOLDER_STRUCTURE

ERROR, AUTO-FIX. Every `*.spec.ts` must live at
`tests/ui/{suite}/{feature}/TC{N}-{short-name}.spec.ts`. Determine smoke unless the test
is clearly regression-focused, derive a kebab-case feature from functionality, split files
that contain different TC IDs, and update imports.

### R2 - FILE_NAMING_CONVENTION

ERROR, AUTO-FIX. Filename: `TC{N}-{short-kebab-description}.spec.ts`, with a non-negative
integer N and one to five kebab-case words. The N must match the test title.

### R3 - DESCRIBE_MATCHES_FEATURE_FOLDER

ERROR, AUTO-FIX. Convert the feature folder from kebab-case to PascalCase and use that
exact name in `test.describe()`.

### R4 - TC_ID_NAMING_CONVENTION

ERROR, AUTO-FIX. Every `test()` name must start with `TC{N}: `. For data-driven variants,
append ` — <variant>` to the same TC ID.

### R5 - USE_TEST_STEP

ERROR, AUTO-FIX. Remove inline `// Step N:` comments and JSDoc step lists. Wrap logical
action/assertion groups in `await test.step('description', async () => {...})`. Return
values from a step when later steps need them.

## Violation Format

```text
[spec-organisation-standard] SEVERITY — RULE_NAME
File: <relative path>
Line: <line number or —>
Issue: <one sentence>
Fix: <one sentence> | AUTO-APPLIED
```

## Scan Scope

| File glob | Rules |
|-----------|-------|
| `tests/ui/**/*.spec.ts` | R1-R5 |
| `tests/*.spec.ts` | R1 |

