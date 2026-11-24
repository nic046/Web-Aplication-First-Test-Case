---
name: spec-requirements-standard
description: >
  Write, assess, and refine high-quality test case specifications for Playwright +
  TypeScript projects. Governs docs/test-cases/**: traceability, provisioned
  preconditions, classified test data, exact deterministic oracles, postconditions,
  independence, coverage variants, and automation readiness.
---

# Spec Requirements Standard

## Project Context

- TC specifications live in `<tc-docs-dir>/{feature}-test-cases.md`, with one `###` section per TC.
- A ready TC is automatable without asking a question.
- An oracle is the exact expected result. A step without an exact deterministic verifiable oracle is not complete.
- Captured values use `{name}`. Steps use relative paths, and environments supply the base URL.
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

M0 is the default.

- **M0 Assess:** discover `docs/test-cases/**/*.md`, score Q1-Q13 read-only, and report grades.
- **M1 Write:** collect requirement context, write one TC per AC, use `TBD:` for unknowns, append it.
- **M2 Refine:** baseline, rewrite, log `Qn — change`, and re-score.
- **M3 Coverage:** create requirement × TC traceability and derive missing variants.
- **M4 Automation Readiness:** require Ready (>= 90, no `TBD`), map fixtures/data, append handoff YAML.

## Rules

Apply these rules to `docs/test-cases/**/*.md`.

| ID | Rule | Severity | Violation |
|----|------|----------|------------|
| Q1 | TC_METADATA_COMPLETE | ERROR | Missing AC, priority, suite, type, or automation |
| Q2 | OBJECTIVE_STATED | WARNING | Missing or title-repeating objective |
| Q3 | PRECONDITIONS_PROVISIONED | ERROR | State lacks provisioning and scope |
| Q4 | TEST_DATA_DECLARED | ERROR | Inline/example/static/clear-secret data |
| Q5 | ONE_ACTION_PER_STEP | WARNING | Multiple actions or missing result |
| Q6 | EXACT_ORACLE | ERROR | Presence-only or unbounded oracle |
| Q7 | DETERMINISTIC_ORACLE | ERROR | `or`, `e.g.`, `should`, `some`, or `any` |
| Q8 | VERIFIABLE_ORACLE | ERROR | Oracle lacks dataset/mock/API reference |
| Q9 | POSTCONDITIONS_DEFINED | ERROR | Mutation lacks cleanup or final state |
| Q10 | INDEPENDENT_TC | ERROR | Cross-TC state/data dependency |
| Q11 | ENV_AGNOSTIC_STEPS | WARNING | Absolute URLs, hosts, or environment IDs |
| Q12 | AUTOMATION_DECISION | WARNING | Missing decision or workaround |
| Q13 | STEP_REFERENCES_VALID | ERROR | Broken numbering or references |

M0 uses ERROR weight 3 and WARNING weight 1. Ready >= 90, Needs refinement 60-89, Incomplete < 60.

## Violation output

```text
[spec-requirements-standard] SEVERITY — RULE_NAME
File: docs/test-cases/<site>/<feature>-test-cases.md
TC: TC{N} · step <n> (if applicable)
Issue: <one sentence>
Fix: <one sentence> | AUTO-APPLIED | MANUAL-FIX
```

