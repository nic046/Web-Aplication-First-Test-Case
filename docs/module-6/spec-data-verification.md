# Spec Data Standard Verification

## Invocation

The `spec-data-standard` skill was applied directly from
`.github/skills/spec-data-standard/SKILL.md` and mirrored in the Kiro and Claude skill trees.
Repository-local native skill loading was not available in this runtime.

## M0 - Maturity assessment

Before the refactor, transactional event and booking payloads were created inside specs.
The suite had fixed account assumptions and a local-only environment loader.

| Site | Inventory | Baseline level | Blockers |
|------|-----------|----------------|----------|
| EventHub | Reference: 0 · Environment: 4 · Transactional: 2 · Secret: 2 · Simulated: 0 | 2 - Per environment | R7 inline payloads · R9 fixed environment loading · R11 mutation tags |

## TC6 application

| Rule | Result |
|------|--------|
| R2 Unique data | `buildEventPayload()` combines prefix, parallel index, timestamp, and UUID. |
| R3 Prefix | Event titles use `env.testDataPrefix`, default `qa_`. |
| R7 Data outside spec | TC6 payload construction moved to `src/data/events.data.ts`. |
| R9 Environment config | `src/config/env.ts` selects `TEST_ENV` and validates required variables. |
| R11 Mutation tag | TC6 and TC7 use Playwright `{ tag: '@mutates-data' }`. |
| R12 Cleanup | TC6 deletes only `eventId`; TC7 deletes only created booking and event IDs. |
| R13 Exact values | Assertions compare created and API-read titles, categories, statuses, quantities, and IDs. |

## M5 evidence

- Parallel stress: 2 workers × 2 repeats → 4/4 passed on Chromium.
- Focused TC6/TC7 run: 2/2 passed on Chromium.
- Complete Chromium suite: 7 passed.
- TypeScript check: passed.
- Only local environment was configured, so M5 environment comparison used the M3
  readiness-map limitation rather than inventing a second environment run.

## Violation output

```text
[spec-data-standard] WARNING — R3 TEST_DATA_PREFIXED (M1)
File: tests/ui/regression/events/TC6-event-lifecycle.spec.ts
Issue: Baseline event titles were generated without a detectable data prefix.
Fix: Moved payload generation to src/data/events.data.ts using env.testDataPrefix. | AUTO-APPLIED
```

```text
[spec-data-standard] ERROR — R7 DATA_OUTSIDE_SPEC (M2)
File: tests/ui/regression/events/TC6-event-lifecycle.spec.ts
Issue: The event payload shape and title generation were inline in the spec.
Fix: Exported buildEventPayload() from src/data/events.data.ts and imported it. | AUTO-APPLIED
```
