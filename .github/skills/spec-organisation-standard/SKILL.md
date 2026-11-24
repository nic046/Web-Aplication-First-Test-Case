---
name: spec-organisation-standard
description: >
  Enforce organisational and lifecycle standards for Playwright + TypeScript specs:
  suite/feature folders, TC filenames and IDs, describe blocks, and test.step() labels.
---

# Spec Organisation Standard

## Project Context

- Specs: `tests/ui/{suite}/{feature}/TC{N}-{short-name}.spec.ts`
- Suite: `smoke` or `regression`
- Feature: functionality under test, not page name
- One spec file per TC
- Use `test.step()` for every logical action/assertion group

## Rules

- R1 FOLDER_STRUCTURE (ERROR, AUTO-FIX): use `tests/ui/{suite}/{feature}/`.
- R2 FILE_NAMING_CONVENTION (ERROR, AUTO-FIX): use `TC{N}-{1-to-5-kebab-words}.spec.ts`.
- R3 DESCRIBE_MATCHES_FEATURE_FOLDER (ERROR, AUTO-FIX): describe name equals PascalCase feature folder.
- R4 TC_ID_NAMING_CONVENTION (ERROR, AUTO-FIX): test name starts `TC{N}: ` and matches filename.
- R5 USE_TEST_STEP (ERROR, AUTO-FIX): remove step comments and use `test.step()`.

## Violation Format

```text
[spec-organisation-standard] SEVERITY — RULE_NAME
File: <relative path>
Line: <line number or —>
Issue: <one sentence>
Fix: <one sentence> | AUTO-APPLIED
```

## Scan Scope

`tests/ui/**/*.spec.ts` -> R1-R5
`tests/*.spec.ts` -> R1

