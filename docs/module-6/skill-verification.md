# Module 6 — Lifecycle Architect Skill Verification

## Invocation and scope

The repository skill was added at `.github/skills/lifecycle-architect/SKILL.md`. A native skill-loader invocation was attempted, but the available runtime skill catalog does not expose repository-local skills; it returned `Skill "lifecycle-architect" not found`. The skill rules were therefore applied directly as a review checklist against the implemented API client and tests, then verified with Chromium execution and TypeScript checking. This is a direct review, not a claim that the runtime loaded the custom skill.

## Findings in the expected lifecycle format

| Scenario | API precondition | Lifecycle action and read-back | API postcondition | Cleanup | Result |
|---|---|---|---|---|---|
| Event lifecycle | Bearer authentication; create a unique event with `POST /events` | Read `GET /events/{id}` and compare its title/category with the created event | Delete with `DELETE /events/{id}`; confirm `GET /events/{id}` returns `404` | `finally` cleanup if the expected deletion did not complete | Passed on Chromium |
| Booking lifecycle | Bearer authentication; create a unique event with `POST /events` | Create the booking with `POST /bookings`; read `GET /bookings/{id}` and verify event, quantity, and confirmed status | Delete with `DELETE /bookings/{id}` and verify `GET /bookings/{id}` returns `404`; also delete and verify the temporary event | `finally` cleanup for remaining booking/event records | Passed on Chromium |

## Format and validation

- Expected output: one lifecycle row per scenario with API precondition, action/read-back, postcondition, cleanup, and result.
- Actual output: the two-row lifecycle table above; **format matched**.
- Focused API run: **2/2 passed** on Chromium.
- Full Playwright run: **7/7 passed** on Chromium.
- `npx tsc --noEmit`: **passed**.
- HTML report: `playwright-report/index.html`.

The API client uses the system trust store for the test run (`NODE_USE_SYSTEM_CA=1`) because the shell's configured extra CA bundle path is invalid. Certificate verification was not disabled.
