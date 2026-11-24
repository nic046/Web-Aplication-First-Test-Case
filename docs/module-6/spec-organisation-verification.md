# Spec Organisation Skill Verification

## Invocation

The repository skill was applied directly at `.github/skills/spec-organisation-standard/SKILL.md`
and mirrored at `.kiro/skills/spec-organisation-standard/SKILL.md` and
`.claude/skills/spec-organisation-standard/SKILL.md`. This runtime did not expose a native
loader for repository-local skills, so the rules were applied as a read-and-edit checklist.

## Findings

| Rule | Result |
|------|--------|
| R1 Folder structure | Fixed: all specs now live under `tests/ui/{suite}/{feature}/`. |
| R2 File naming | Fixed: each TC is in `TC{N}-{kebab-description}.spec.ts`. |
| R3 Describe names | Fixed: `Login`, `Events`, and `Bookings` match their feature folders. |
| R4 TC IDs | Fixed: every test title starts with a filename-matching `TC{N}: `. |
| R5 Test steps | Fixed: all logical action/assertion groups use `test.step()`. |

## API lifecycle cases

The two previous-module API scenarios were preserved as:

| TC | Feature file | Chromium result |
|----|--------------|-----------------|
| TC6 | `tests/ui/regression/events/TC6-event-lifecycle.spec.ts` | 1 passed |
| TC7 | `tests/ui/regression/bookings/TC7-booking-lifecycle.spec.ts` | 1 passed |

Both specification documents were created under `docs/test-cases/regression/`.

## Format validation

The expected violation format was matched for violations that were found and corrected.
The final organisation scan found no remaining R1-R5 violations.

## Requirements M0 baseline

The `spec-requirements-standard` M0 assessment was run against the new
`docs/test-cases/**/*.md` specifications.

| TC | Score | Grade | Top gaps |
|----|-------|-------|----------|
| TC6 | 100% | Ready | none |
| TC7 | 100% | Ready | none |

## Execution evidence

- Focused API run: 2 passed on Chromium
- Complete Chromium suite: 7 passed
- TypeScript check: passed
- HTML report: `playwright-report/index.html`

