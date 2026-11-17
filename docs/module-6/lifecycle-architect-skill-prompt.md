# Adapted Lifecycle Architect Prompt

## Prompt used

Review the EventHub Playwright + TypeScript repository and design two independent API-backed lifecycle tests. For each test, identify its API-executable preconditions, create the required isolated resource through the documented API, read it back and assert its state, execute deletion through the API, and verify the postcondition through a subsequent API read. Use the existing environment credentials without printing or committing secrets, ensure cleanup also runs after assertion failures, follow the repository's Playwright imports and TypeScript aliases, and run only the Chromium project. Report findings as a lifecycle table with test, precondition, action, postcondition, cleanup, and validation status. Do not claim success when a test, cleanup, or type-check fails.

## Adaptations made

- Changed generic lifecycle language to EventHub's documented `POST/GET/DELETE /events` and `POST/GET/DELETE /bookings/{id}` endpoints.
- Added bearer-token login using the existing `EMAIL` and `PASSWORD` environment variables.
- Normalized the project's `API_URL` (currently the Swagger docs URL) to the documented `/api` base path.
- Required unique resource names and `finally` cleanup to keep tests independent and safe on failure.
- Limited execution evidence to Chromium and the two newly added API lifecycle cases.
