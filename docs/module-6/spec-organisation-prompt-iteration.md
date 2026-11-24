# Spec Organisation Prompt Iteration

## Initial prompt

The organisation prompt defines exact folder, filename, describe, TC-ID, and `test.step()`
rules. It was unambiguous for the repository, but the project already contained three root-level
spec files and no `tests/ui` hierarchy.

## Changes applied

1. **Split mixed TC files.** The original sign-in file contained four separate tests, so it was
   split into one spec per TC (TC2-TC5).
2. **Assigned stable TC IDs.** The registration case became TC1; the four sign-in cases became
   TC2-TC5; the two previous-module API lifecycles became TC6-TC7.
3. **Derived feature folders from behaviour.** Authentication specs use `login/`, while API
   lifecycle specs use `events/` and `bookings/`.
4. **Applied `test.step()` without changing behavior.** Actions and assertions were grouped
   into named Playwright steps; API values were returned only where a later step consumed them.
5. **Preserved suite intent.** Login specs are smoke tests; resource lifecycle specs are
   regression tests.

These adaptations produced the prompt's required hierarchy and kept existing test behavior
unchanged.
