# Module 6 — Prompt Iteration

## Initial prompt

The assignment's initial prompt asked for two API-executable preconditions and postconditions, a lifecycle-architect skill run, and Chromium Playwright evidence. It did not identify EventHub's API routes, authentication, required data, cleanup behavior, output schema, or this repository's environment configuration.

## Adaptations

1. **Bounded the task to two independent resource lifecycles.** The first covers event create/read/delete; the second covers a booking created against a temporary event. This maps directly to the assignment while avoiding order-dependent tests.
2. **Specified documented routes and bearer authentication.** Live API verification showed that the event and booking endpoints require a token from `POST /auth/login`.
3. **Accounted for the configured API URL.** The repository's `API_URL` points to the Swagger docs path (`/api/docs/`), while the documented API base is `/api`; the helper normalizes the path without changing `.env` or printing environment values.
4. **Required isolated data and unconditional cleanup.** Unique event titles and `finally` cleanup prevent the tests from leaving persistent records if an assertion fails.
5. **Defined evidence and output shape.** The adapted prompt asks for a per-scenario lifecycle table and runs the Chromium project plus a TypeScript check.

These changes made the prompt executable against the actual project instead of relying on guessed routes or payloads. The final adapted prompt is in [lifecycle-architect-skill-prompt.md](./lifecycle-architect-skill-prompt.md).
