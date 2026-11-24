---
name: spec-requirements-standard
description: >
  Write, assess, and refine high-quality test case specifications for Playwright +
  TypeScript projects. Governs docs/test-cases/** with traceability, provisioned
  preconditions, classified data, exact oracles, postconditions, independence,
  coverage variants, and automation readiness.
---

# Spec Requirements Standard

## Project Context

- TC specifications live in `<tc-docs-dir>/{feature}-test-cases.md`, one `###` section per TC.
- A specification is ready when another engineer or agent can automate it without questions.
- Oracle: exact deterministic verifiable expected result.
- Captured value: reuse with `{name}`.
- Steps use relative paths; environment configuration supplies the base URL.
- Data classes: Reference, Environment, Transactional, Secret, and Simulated.

## TC template

```markdown
### TC{N}: <Imperative title> *

| Field | Value |
|-------|-------|
| Requirement / AC * | <REQ-ID> · <acceptance criterion> |
| Objective * | <behaviour verified and why> |
| Priority * | High · Medium · Low |
| Suite * | smoke · regression |
| Type * | positive · negative · boundary · data-driven |
| Tags | `@mutates-data` · `@read-only` · `@env:<name>` |
| Automation * | Automatable · Partial (<workaround>) · Manual (<reason>) |

**Preconditions** *

| # | State | Provisioned by | Scope |
|---|-------|----------------|-------|
| P1 | <exact state> | API · fixture · mock · UI | test · worker · shared read-only |

**Test data** *

| Item | Value or generation rule | Class | Source |
|------|--------------------------|-------|--------|
| <name> | <exact value / generation rule> | Reference · Environment · Transactional · Secret · Simulated | dataset · factory · discovery · mock · env |

**Steps** *

| # | Action | Expected result (oracle) |
|---|--------|--------------------------|
| 1 | <one action> | <exact deterministic result> |

**Postconditions** *

| State after the test | Cleanup | Scope |
|----------------------|---------|-------|
| <final state> | <removal method> | only data created by this TC |
```

## Modes

- M0 Assess (default): discover docs/test-cases, apply Q1-Q13 read-only, score and grade.
- M1 Write: collect context, write one TC per AC, use `TBD:` for unknowns, append.
- M2 Refine: baseline, rewrite, log changes, and re-score.
- M3 Coverage: build the requirement × TC matrix and derive missing variants.
- M4 Automation Readiness: require Ready, map fixtures and data, append handoff YAML.

## Rules

| ID | Rule | Severity | Violation |
|----|------|----------|------------|
| Q1 | TC_METADATA_COMPLETE | ERROR | Missing AC, priority, suite, type, or automation |
| Q2 | OBJECTIVE_STATED | WARNING | Missing or title-repeating objective |
| Q3 | PRECONDITIONS_PROVISIONED | ERROR | State lacks provision and scope |
| Q4 | TEST_DATA_DECLARED | ERROR | Inline/example/static/clear-secret data |
| Q5 | ONE_ACTION_PER_STEP | WARNING | Multiple actions or missing result |
| Q6 | EXACT_ORACLE | ERROR | Presence-only or unbounded oracle |
| Q7 | DETERMINISTIC_ORACLE | ERROR | `or`, `e.g.`, `should`, `some`, or `any` |
| Q8 | VERIFIABLE_ORACLE | ERROR | Oracle lacks reference evidence |
| Q9 | POSTCONDITIONS_DEFINED | ERROR | Mutation lacks final state or cleanup |
| Q10 | INDEPENDENT_TC | ERROR | Cross-TC state/data dependency |
| Q11 | ENV_AGNOSTIC_STEPS | WARNING | Absolute URL, host, or environment ID |
| Q12 | AUTOMATION_DECISION | WARNING | Missing decision or workaround |
| Q13 | STEP_REFERENCES_VALID | ERROR | Broken numbering or captured references |

Score = 100 x passed weight / total weight. ERROR = 3, WARNING = 1.
Ready >= 90, Needs refinement 60-89, Incomplete < 60.

## Scan scope

`docs/test-cases/**/*.md` -> Q1-Q13.

Q13 formatting fixes are auto-applied. M2 applies meaningful fixes with a change log.

