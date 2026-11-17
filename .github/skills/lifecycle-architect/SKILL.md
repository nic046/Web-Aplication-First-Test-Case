---
name: lifecycle-architect
description: "Design and verify independent API-backed lifecycle tests in Playwright projects, including executable preconditions, state assertions, cleanup, and postconditions."
---

# Lifecycle Architect

Use this skill when creating or reviewing tests that exercise an application's resource lifecycle through its API.

## Rules

1. Inspect the repository's API base URL configuration, authentication flow, endpoint definitions, and request/response shapes before writing tests.
2. Make each test independent. Create its precondition in the test itself using documented API calls and isolated data.
3. Assert the resource state by reading it through the API after creation or mutation; do not infer success solely from the mutation response.
4. Execute cleanup through the API in a `finally` path so assertion failures do not leave test records behind.
5. Verify the postcondition by reading the deleted or transitioned resource through the API.
6. Never print or hardcode credentials. Fail explicitly when required configuration or authentication is missing.
7. Use the project's Playwright fixture, import, naming, and TypeScript conventions.
8. Run the narrowest applicable browser project and a TypeScript check. Report failures and cleanup errors explicitly.

## Verification output

Report one row per scenario with its API precondition, lifecycle action, read-back assertion, postcondition, and execution result. State whether the tests and type-check passed; never claim an unexecuted check passed.
