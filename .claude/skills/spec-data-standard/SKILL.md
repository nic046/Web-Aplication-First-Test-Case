---
name: spec-data-standard
description: >
  Enforce hermetic test data, isolation, typed sourcing, environment portability,
  exact expected values, cleanup scope, and parallel robustness.
---

# Spec Data Standard

## Project Context
- Define data in `src/data/**`.
- Own environment variables in `src/config/env.ts`.
- Never read `process.env` in specs.
- Isolate mutable identities per test, worker, or pool.
- Cleanup only resources exclusively owned by the test or worker.

## Modes
- M0 Assess maturity.
- M1 Parallel isolation.
- M2 Data sourcing and data-driven datasets.
- M3 Environment portability.
- M4 Deterministic values.
- M5 Execute robustness evidence.

## Rules
R1 NO_SHARED_MUTABLE_IDENTITY
R2 UNIQUE_CREATED_DATA
R3 TEST_DATA_PREFIXED
R4 PARALLELISM_NOT_SUPPRESSED
R5 NO_GLOBAL_STATE_ASSERTION
R6 TYPED_DATA_SOURCE
R7 DATA_OUTSIDE_SPEC
R8 DATA_DRIVEN_TITLES_UNIQUE
R9 ENV_RESOLVED_FROM_CONFIG
R10 NO_ENV_SPECIFIC_LITERALS
R11 DATA_IMPACT_TAGGED
R12 SCOPED_AND_GUARDED_CLEANUP
R13 EXPECTED_VALUE_FROM_CONTROLLED_SOURCE
R14 MOCK_FOR_UNOWNED_CONTENT
R15 SINGLE_SESSION_PER_IDENTITY

