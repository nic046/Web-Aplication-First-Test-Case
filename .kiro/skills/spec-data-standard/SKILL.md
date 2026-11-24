---
name: spec-data-standard
description: >
  Enforce test data robustness: classification, isolation, typed sourcing,
  environment portability, exact expected values, cleanup scope, and verification.
---

# Spec Data Standard

## Project Context
- Hermetic tests control their data and dependencies.
- `src/data/**` defines typed data and factories.
- `src/config/env.ts` owns environment variables.
- Specs do not read `process.env`.
- Worker fixture data uses stable `parallelIndex` partitioning.
- Cleanup must delete only resources owned by the test or worker.

## Modes
- M0 Maturity Assessment: read-only inventory and maturity score.
- M1 Parallel Isolation: R1-R5.
- M2 Data Sourcing: R6-R8.
- M3 Environment Portability: R9-R12.
- M4 Deterministic Values: R13-R14.
- M5 Robustness Verification: execute parallel repeat and environment evidence.

## Rules
- R1 NO_SHARED_MUTABLE_IDENTITY (ERROR)
- R2 UNIQUE_CREATED_DATA (ERROR, AUTO-FIX)
- R3 TEST_DATA_PREFIXED (WARNING, AUTO-FIX)
- R4 PARALLELISM_NOT_SUPPRESSED (WARNING)
- R5 NO_GLOBAL_STATE_ASSERTION (WARNING)
- R6 TYPED_DATA_SOURCE (ERROR, AUTO-FIX)
- R7 DATA_OUTSIDE_SPEC (ERROR, AUTO-FIX)
- R8 DATA_DRIVEN_TITLES_UNIQUE (ERROR, AUTO-FIX)
- R9 ENV_RESOLVED_FROM_CONFIG (ERROR, AUTO-FIX)
- R10 NO_ENV_SPECIFIC_LITERALS (ERROR)
- R11 DATA_IMPACT_TAGGED (WARNING, AUTO-FIX)
- R12 SCOPED_AND_GUARDED_CLEANUP (ERROR)
- R13 EXPECTED_VALUE_FROM_CONTROLLED_SOURCE (WARNING)
- R14 MOCK_FOR_UNOWNED_CONTENT (WARNING)
- R15 SINGLE_SESSION_PER_IDENTITY (ERROR)

Use exact created/mock/dataset/discovery values for assertions. Use `@mutates-data` for
persistence tests and `qa_`-prefixed unique transactional values.

