# Module 6 — Prompt Execution Notes

## Repository

- Branch: `main`
- GitHub: https://github.com/nic046/Web-Aplication-First-Test-Case/tree/main
- Adapted prompt: [lifecycle-architect-skill-prompt.md](./lifecycle-architect-skill-prompt.md)

## Before

The assignment requested two API-executable lifecycle test cases, execution of a lifecycle-architect prompt, invocation of a lifecycle-architect skill, and Chromium test evidence. The repository did not yet contain that prompt, skill, or API lifecycle tests.

## After

The prompt was adapted to the EventHub API and used to implement two independent scenarios:

1. Authenticate and create an event through the API, read it back, delete it, and verify a subsequent read returns `404`.
2. Authenticate and create a temporary event as a booking precondition, create and read a booking through the API, delete it, verify a subsequent read returns `404`, then delete and verify the event.

Both scenarios clean up resources in `finally` blocks. The API client derives the documented `/api` path from the existing `API_URL` value and uses the configured account credentials without printing them.

## Execution evidence

| Check | Result |
|---|---|
| New API lifecycle cases, Chromium | 2 passed |
| Complete Playwright suite, Chromium | 7 passed |
| TypeScript check (`npx tsc --noEmit`) | Passed |
| Playwright HTML report | Generated at `playwright-report/index.html` |

The Chromium run used Node's system certificate store (`NODE_USE_SYSTEM_CA=1`) because the current shell has an invalid `NODE_EXTRA_CA_CERTS` path. TLS verification remained enabled.

Skill review details and the native invocation limitation are recorded in [skill-verification.md](./skill-verification.md). Prompt changes and their rationale are recorded in [prompt-iteration.md](./prompt-iteration.md).
