---
name: spec-data-standard
description: >
  Enforce test data robustness for Playwright and TypeScript projects:
  classify data, isolate parallel workers, provide typed data sources,
  protect environments, use controlled expected values, and verify hermetic runs.
---

# Spec Data Standard

## Project Context

- Hermetic test: depends on nothing it does not control.
- Playwright workers are separate processes. Use `testInfo.parallelIndex` for stable worker partitioning.
- Fixtures may use `{ scope: 'worker' }` for expensive shared identities.
- Specs never read `process.env`; use `src/config/env.ts`.
- Credentials remain owned by `spec-code-standard`.

Resolved project conventions:
- `<data-dir>`: `src/data`
- `<config-module>`: `src/config/env.ts`
- `<fixtures-module>`: `src/fixtures/index.ts`
- `<api-layer>`: `src/api`
- `<runner-config>`: `playwright.config.ts`
- `<tc-docs-dir>`: `docs/test-cases`

## Data Classes

| Class | Strategy |
|-------|----------|
| Reference | Share; discover through a controller |
| Environment | Typed environment config |
| Transactional | Create per test or worker; isolate; clean |
| Secret | Environment or CI secret |
| Simulated | Typed `mock<Resource>` fixture |

Lifecycle: DEFINE -> PROVISION -> USE -> CLEAN.

Maturity:
- 0 Hardcoded
- 1 Externalised
- 2 Per environment
- 3 Isolated
- 4 Self-provisioned

## Modes

M0 is the default.

### M0 - Maturity Assessment

Discover data, config, fixtures, runner, and specs. Classify all data and report the highest
fully met maturity level, blockers, and the next mode. Read-only.

Output:
```text
[spec-data-standard] MATURITY ASSESSMENT
Site: <site> Level: <0-4> - <name>
Blockers to level <n+1>: <issue> -> M<n> / R<n>
Recommended next mode: M<n>
```

### M1 - Parallel Isolation

Run R1-R5. Choose per-test creation, worker identity, fixed-account pool, reference sharing,
mock data, or serial execution with justification.

### M2 - Data Sourcing and Data-Driven

Run R6-R8. Move inline datasets and literal expected values to typed modules and merge
copy-pasted data-only variants into `test.each` or loops.

### M3 - Environment Portability

Run R9-R12. Use `TEST_ENV`, typed validation, runtime discovery, environment maps, mutation
tags, and guarded scoped cleanup.

### M4 - Deterministic Data and Assertions

Run R13-R14. Assert exact values from created data, mocks, dataset rows, or API discovery.

### M5 - Robustness Verification

Execute the requested scope with parallel repeat runs and configured environments. Never modify
code. Report workers, repeats, orphan count, failures by cause, and hermetic verdict.

## Rules

| ID | Rule | Severity | Scope |
|----|------|----------|-------|
| R1 | NO_SHARED_MUTABLE_IDENTITY | ERROR | M1 |
| R2 | UNIQUE_CREATED_DATA | ERROR, auto-fix | M1 |
| R3 | TEST_DATA_PREFIXED | WARNING, auto-fix | M1 |
| R4 | PARALLELISM_NOT_SUPPRESSED | WARNING | M1 |
| R5 | NO_GLOBAL_STATE_ASSERTION | WARNING | M1 |
| R6 | TYPED_DATA_SOURCE | ERROR, auto-fix | M2 |
| R7 | DATA_OUTSIDE_SPEC | ERROR, auto-fix | M2 |
| R8 | DATA_DRIVEN_TITLES_UNIQUE | ERROR, auto-fix | M2 |
| R9 | ENV_RESOLVED_FROM_CONFIG | ERROR, auto-fix | M3 |
| R10 | NO_ENV_SPECIFIC_LITERALS | ERROR | M3 |
| R11 | DATA_IMPACT_TAGGED | WARNING, auto-fix | M3 |
| R12 | SCOPED_AND_GUARDED_CLEANUP | ERROR | M1/M3 |
| R13 | EXPECTED_VALUE_FROM_CONTROLLED_SOURCE | WARNING | M4 |
| R14 | MOCK_FOR_UNOWNED_CONTENT | WARNING | M4 |
| R15 | SINGLE_SESSION_PER_IDENTITY | ERROR | M1 |

R1: shared identities with mutable state require per-test, worker, or pooled isolation.

R2: unique fields use a factory combining the data prefix, parallel index, timestamp, and random
suffix.

R3: generated transactional values start with `ENV.testDataPrefix` (default `qa_`).

R4: `workers: 1`, serial mode, or disabled parallelism requires
`// spec-data: serial - <reason>`.

R5: never assert shared collection totals; assert owned records or mock the collection.

R6: JSON/CSV sources need typed interfaces and fail-fast validation.

R7: move inline datasets and literal data-bearing expectations out of specs.

R8: data-driven test titles include a unique row ID.

R9: specs and fixtures never read `process.env`; config validates and selects `TEST_ENV`.

R10: replace absolute hosts, IDs, UUIDs, SKUs, and seeded names with discovery or environment maps.

R11: persistence tests use `@mutates-data`; environment-only tests use `@env:<name>`.

R12: cleanup deletes only identifiers created or exclusively owned by the test or worker, and
guards destructive cleanup with environment policy.

R13: exact data-bearing assertions use created payloads, mocks, dataset rows, or API discovery,
not unexplained literals or presence-only checks.

R14: for unowned rendering or edge data, provide a typed `mock<Resource>` payload and assert
its fields.

R15: one fixture owns the auth token or session for an identity within a test.

## Violation Output

```text
[spec-data-standard] SEVERITY — RULE_NAME (M<n>)
File: <relative path>
Line: <line number>
Issue: <one sentence>
Fix: <one sentence> | AUTO-APPLIED | MANUAL-FIX
```

## Scan Scope

| File glob | Rules |
|-----------|-------|
| `src/fixtures/**/*.ts` | R1-R3, R12, R15 |
| `src/data/**` | R2, R3, R6, R10 |
| `src/config/**/*.ts` | R9 |
| `playwright.config.ts` | R4 |
| `tests/**/*.spec.ts` | R4-R14 |

