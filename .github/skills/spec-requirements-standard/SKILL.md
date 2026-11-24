---
name: spec-requirements-standard
description: >
  Write, assess, and refine high-quality test case specifications for Playwright +
  TypeScript projects. Governs docs/test-cases/**: traceability, provisioned
  preconditions, classified test data, one action with an exact deterministic
  expected result per step, postconditions, independence, coverage variants, and
  automation readiness.
---

# Spec Requirements Standard

## Project Context

- TC specifications live in `<tc-docs-dir>/{feature}-test-cases.md`, with one `###` section per TC.
- A specification is ready when another engineer or agent can automate it without asking a question.
- **Oracle:** the exact expected result compared against a step.
- **Captured value:** a value read during the test and reused later; name it with braces (`{itemTitle}`).
- Steps use relative paths (`/items`). The base URL comes from the environment.
- Data classes: Reference, Environment, Transactional, Secret, and Simulated.

| Concern | Owner | Interaction |
|---------|-------|-------------|
| TC lifecycle orchestration | `spec-quality-lifecycle-standard` | Invokes this skill as phase 1 |
| Test data implementation | `spec-data-standard` | Consumes the M4 handoff `data` block |
| Code generation | `spec-quality-lifecycle-standard` Create | Consumes the M4 handoff `steps` block |
| Row sync in docs | `automation-architect` Mode 5 | Existence only; never content |
| TC ID format in code | `spec-organisation-standard` R4 | Same `TC{N}` ID in doc and spec |

## TC specification template

Every TC section follows this template. Fields marked `*` are mandatory.

```markdown
### TC{N}: <Imperative title> *

| Field | Value |
|-------|-------|
| Requirement / AC * | <REQ-ID> · <acceptance criterion it verifies> |
| Objective * | <one sentence: behaviour verified and why it matters> |
| Priority * | High · Medium · Low |
| Suite * | smoke · regression |
| Type * | positive · negative · boundary · data-driven |
| Tags | `@mutates-data` · `@read-only` · `@env:<name>` |
| Automation * | Automatable · Partial (<reason + workaround>) · Manual (<reason>) |

**Preconditions** *

| # | State | Provisioned by | Scope |
|---|-------|----------------|-------|
| P1 | <exact state> | API · fixture · mock · UI | test · worker · shared read-only |

**Test data** *

| Item | Value or generation rule | Class | Source |
|------|--------------------------|-------|--------|
| <name> | <exact value / `qa_` + unique suffix / first entry from API> | Reference · Transactional · ... | dataset · factory · discovery · mock · env |

**Steps** *

| # | Action | Expected result (oracle) |
|---|--------|--------------------------|
| 1 | <one user action> | <exact, deterministic, verifiable result> |

**Postconditions** *

| State after the test | Cleanup | Scope |
|----------------------|---------|-------|
| <final state> | <what is removed and how> | only data created by this TC |

**Risks / notes** — parallel, environment, or product constraints (optional)
```

## Modes

M0 is the default when no mode is specified.

### M0 — Assess (read-only)

Triggers: `"assess test cases"` · `"tc spec review"` · `"spec requirements"`

1. Discover `docs/test-cases/**/*.md` and split into TC sections.
2. Apply Q1-Q13 to each TC.
3. Score: `100 × passed weight / total weight`, with ERROR worth 3 and WARNING worth 1.
4. Grade: Ready >= 90, Needs refinement 60-89, Incomplete < 60.
5. Do not modify files.

Report files, TC scores, top gaps, average, ready count, frequent gaps, and the recommended M2 target.

### M1 — Write

Triggers: `"write test case"` · `"new tc spec"` · `"spec from requirement"`

Collect the requirement or story, acceptance criteria, feature, site, and known business rules. Infer the rest, ask only for missing items, and:

1. Create one TC per acceptance criterion, with coverage variants where M3 applies.
2. Fill the template and mark unknown values `TBD: <question>`; never invent an oracle.
3. Run Q1-Q13. A TC containing `TBD` cannot be Ready.
4. Append to `<tc-docs-dir>/{feature}-test-cases.md` with the next free `TC{N}`.

### M2 — Refine

Triggers: `"refine test case"` · `"improve tc"` · `"make tc robust"`

1. Run M0 on the target TC for its baseline.
2. Rewrite it in the template and fix every failed rule.
3. Preserve the TC ID and original intent. If the intent is untestable, propose a split and flag it.
4. Add `Change log: Qn — <what changed and why>` under the TC.
5. Re-run M0 and report before -> after.

### M3 — Coverage

Triggers: `"tc coverage"` · `"derive negative cases"` · `"traceability matrix"`

Use equivalence partitioning, boundaries, state transitions, role/auth variants, error guessing, and data-driven rows.

1. Build the requirement/AC × TC matrix.
2. List missing variants for every AC.
3. Put variants that differ only in data into one data-driven TC.
4. Write new TCs through M1.

### M4 — Automation Readiness

Triggers: `"automation readiness"` · `"handoff tc"` · `"ready to automate"`

Precondition: the TC is Ready by M0 (>= 90, no `TBD`) and Q12 is resolved.

1. Confirm the automation decision; for Partial, state the workaround.
2. Map preconditions to fixture types: `worker<Resource>`, `created<Resource>`, `clean<Resource>`, `mock<Resource>`, or `<resource>Controller`.
3. Map data items to a `spec-data-standard` strategy.
4. Emit and append the handoff block under the TC.

```yaml
tc: TC{N}
title: <title>
suite: smoke
tags: ['@mutates-data']
automation: automatable
fixtures:
  identity: worker<Resource>
  state: clean<Resource>
data:
  - name: item
    class: reference
    source: discovery
captured: [itemTitle]
steps:
  - action: open /items
    oracle: heading = "<exact text>"; first row title = item.title
postconditions:
  - only items created by this TC are removed
```

## Rules

| ID | Rule | Severity | Violation | Fix |
|----|------|----------|------------|-----|
| Q1 | TC_METADATA_COMPLETE | ERROR | Requirement/AC, priority, suite, type, or automation missing | Fill it; unknown -> `TBD:` |
| Q2 | OBJECTIVE_STATED | WARNING | Objective absent or repeats title | State behaviour and value |
| Q3 | PRECONDITIONS_PROVISIONED | ERROR | State lacks provision method or scope | Add API/fixture/mock/UI and scope |
| Q4 | TEST_DATA_DECLARED | ERROR | Values inline or e.g./static/clear secret | Move to data table with class and source |
| Q5 | ONE_ACTION_PER_STEP | WARNING | Several actions or no oracle | Split into one action and one oracle |
| Q6 | EXACT_ORACLE | ERROR | Presence-only oracle where value is known | State exact value or equal expression |
| Q7 | DETERMINISTIC_ORACLE | ERROR | Oracle contains or/e.g./should/some/any | Choose one outcome |
| Q8 | VERIFIABLE_ORACLE | ERROR | Oracle references unavailable evidence | Add dataset, mock, or API discovery |
| Q9 | POSTCONDITIONS_DEFINED | ERROR | Mutation lacks final state or cleanup scope | Add scoped cleanup |
| Q10 | INDEPENDENT_TC | ERROR | Relies on another TC or shared destructive state | Provision and isolate |
| Q11 | ENV_AGNOSTIC_STEPS | WARNING | Absolute URL, host, or environment ID | Use relative path and Environment data |
| Q12 | AUTOMATION_DECISION | WARNING | Missing decision or workaround | Use Automatable/Partial/Manual with reason |
| Q13 | STEP_REFERENCES_VALID | ERROR | Broken numbering/format or invalid step reference | Renumber and use `{capturedName}` |

## Violation output

```text
[spec-requirements-standard] SEVERITY — RULE_NAME
File: docs/test-cases/<site>/<feature>-test-cases.md
TC: TC{N} · step <n> (if applicable)
Issue: <problem>
Fix: <fix> | AUTO-APPLIED | MANUAL-FIX
```

Q13 numbering and formatting fixes are AUTO-APPLIED. M2 applies all other fixes with a change log.

## Scan scope

| File glob | Rules |
|-----------|-------|
| `docs/test-cases/**/*.md` | Q1-Q13 |

