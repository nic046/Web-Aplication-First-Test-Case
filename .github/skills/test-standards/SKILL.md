---
name: test-standards
description: "Enforce and auto-apply test writing and organisation standards for Playwright + TypeScript projects. Covers import hygiene (path aliases), fixture pattern, test structure, test independence, and data hygiene. Load when writing, reviewing, or refactoring spec files or fixture files."
---

# Test Standards

Review Playwright specs, fixtures, test data, and their configuration. Detect violations and apply behavior-preserving fixes when intent is clear. Never report a change as applied unless it was made. Mark uncertain or application-specific changes `MANUAL` rather than guessing.

## Project Context

- Specs live in `tests/`; fixtures in `src/fixtures/`; test data in `src/data/`; environment/configuration in `src/config/`.
- Requested aliases: `@pages/*` -> `src/ui/pages/*`, `@components/*` -> `src/ui/components/*`, `@fixtures` -> `src/fixtures/index`, `@fixtures/*` -> `src/fixtures/*`, `@data/*` -> `src/data/*`, `@config/*` -> `src/config/*`, `@helpers/*` -> `src/helpers/*`, and `@api/*` -> `src/api/*`. Verify `tsconfig.json` and runtime/test configuration resolve aliases before using them.
- The supplied target context expects `src/config/Env.ts` to validate environment variables and `src/data/auth.data.ts` to define `appUser` and site-specific accounts. Verify actual paths and casing before editing imports.
- Use only Playwright Test (`@playwright/test`) as the test framework. Specs import `test` and `expect` from `@fixtures`; the fixture module may re-export Playwright APIs.

## Rules

1. **Path aliases for project imports.** Within `src/` and `tests/`, relative imports (`./`, `../`) are forbidden. Use the aliases above. Confirm they exist in `tsconfig.json`; if missing, add mappings only when the project structure supports them and validate resolution. Do not rewrite external package imports.
2. **Import test APIs from fixtures.** Specs import `test` and `expect` from `@fixtures`, not directly from `@playwright/test`. The fixture entry point itself is the exception and may extend/re-export Playwright APIs.
3. **Fixtures own Page Object setup.** Do not manually instantiate Page Objects in `beforeEach` or individual test bodies. Register them in `src/fixtures/index.ts`. A page fixture depends on `{ page }` and navigates before `use()` when appropriate. An authenticated fixture depends on the established authentication setup and must not navigate away or repeat login afterward.
4. **Always provide the authenticated fixture.** `src/fixtures/index.ts` MUST export an `authenticatedPage` fixture backed by the configured user data and login Page Object. If the repository lacks required authentication data or a login flow, report the missing prerequisite rather than inventing credentials or selectors. Its requested pattern is:

   ```typescript
   authenticatedPage: async ({ page }, use) => {
     const lp = new LoginPage(page);
     await lp.navigate();
     await lp.login(users.appUser.username, users.appUser.password);
     await use(lp);
   }
   ```

   Adapt names and the yielded type to the actual fixture contract; consumers expecting `authenticatedPage.page` require a Page Object, while consumers expecting Playwright APIs require a `Page`. Do not mismatch the fixture's declared type and value. Playwright creates a fresh browser context per test, so logout is not required for isolation.
5. **Group scenarios.** Every `test()` belongs inside a descriptive `test.describe()` named for the feature/page. Test names describe expected behavior, not just an action; replace generic names such as `'test'` when intent is evident.
6. **Keep tests independent.** A spec must pass on its own and in any order. Do not depend on state created by another test; create required state through fixtures, API setup, or the test's own flow.
7. **No imports between specs.** Put shared data in `src/data/` and shared setup in `src/fixtures/`; update imports after moving shared code.
8. **No hardcoded credentials in specs.** Use `users.*` from `@data/auth.data` or the project's validated environment configuration. Never print secrets in reports or commit them into test data.
9. **One test framework.** Do not use Jest, Mocha, Chai, or another runner/assertion library. Replace framework-specific usage only when an equivalent Playwright API preserves behavior; otherwise report it for manual migration.
10. **Deliberate test data.** Use stable, isolated data. Avoid unexplained literals and mutable shared accounts; parameterize values or move reusable data to `src/data/` when this improves clarity.

## Review And Repair Workflow

1. Inspect all relevant specs, fixtures, data, `tsconfig.json`, and Playwright configuration. Treat aliases and file names above as the requested baseline, not proof that the repository already implements them.
2. Report each violation at its source line. Use `HIGH` for secrets, test-order dependence, or broken fixture contracts; `MEDIUM` for framework/import/structure violations; `LOW` for clarity and organization.
3. Apply safe edits while preserving scenario intent and independence. Do not invent credentials, selectors, user accounts, test names, or fixture return contracts.
4. Validate with the narrowest available test/typecheck. If aliases or dependencies are missing, report that blocker instead of installing or changing unrelated infrastructure.
5. Re-scan changed files and identify any manual migration still needed.

## Output Format

Use one entry per violation, in source order:

```text
[test-standards] SEVERITY — RULE NAME
File:  <path>
Line:  <number>
Issue: <one sentence>
Fix:   <one sentence> | AUTO-APPLIED
```

Use `| MANUAL` instead of `| AUTO-APPLIED` when no safe automatic repair was made. If no violations remain, state that explicitly.