# Spec Data Prompt Iteration

## Initial prompt

The prompt defines project-agnostic M0-M5 modes and R1-R15. The project had no
`spec-data-standard` skill and no separate environment or data factory for lifecycle events.

## Applied adaptations

1. **Resolved placeholders** to `src/data`, `src/config/env.ts`, `src/fixtures/index.ts`,
   `src/api`, `playwright.config.ts`, and `docs/test-cases`.
2. **Created a typed event factory** in `src/data/events.data.ts`.
3. **Added a stable test-data prefix** and `TEST_DATA_PREFIX` configuration.
4. **Added `TEST_ENV` environment selection** while preserving the existing local `.env`
   fallback.
5. **Tagged mutating lifecycle specs** with `@mutates-data`.
6. **Documented the serial Playwright setting** with the required `spec-data: serial` reason.
7. **Preserved cleanup scope** to delete only IDs created by the scenario.

These changes made the one scenario data-driven and isolated without changing its API behavior.
