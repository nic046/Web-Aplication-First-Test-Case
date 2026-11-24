---
name: spec-organisation-standard
description: >
  Enforce spec folder hierarchy, TC filenames and IDs, describe naming, and test.step()
  usage in Playwright + TypeScript projects.
---

# Spec Organisation Standard

## Project Context

- Path: `tests/ui/{suite}/{feature}/TC{N}-{short-name}.spec.ts`
- Suite categories: `smoke`, `regression`
- Feature folders name functionality
- One file per TC
- Use `test.step()` instead of inline step comments

## Rules

- R1 FOLDER_STRUCTURE: correct suite/feature hierarchy
- R2 FILE_NAMING_CONVENTION: TC number plus 1-5 kebab-case words
- R3 DESCRIBE_MATCHES_FEATURE_FOLDER: describe equals PascalCase feature folder
- R4 TC_ID_NAMING_CONVENTION: test title starts with matching `TC{N}: `
- R5 USE_TEST_STEP: logical groups use `test.step()`

All rules are ERROR, AUTO-FIX and apply to `tests/ui/**/*.spec.ts`; `tests/*.spec.ts`
receives R1.

