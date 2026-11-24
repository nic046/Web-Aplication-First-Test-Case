### TC7: Create, read, and delete a booking through the API

| Field | Value |
|-------|-------|
| Requirement / AC * | RL-002 · An authenticated user can create, read, and delete a booking |
| Objective * | Verify that a booking lifecycle preserves the event precondition and removes both created resources |
| Priority * | High |
| Suite * | regression |
| Type * | positive |
| Tags | `@mutates-data` |
| Automation * | Automatable |

**Preconditions** *

| # | State | Provisioned by | Scope |
|---|-------|----------------|-------|
| P1 | Authenticated API session is available | fixture | worker |

**Test data** *

| Item | Value or generation rule | Class | Source |
|------|--------------------------|-------|--------|
| eventTitle | `Booking lifecycle ` + random UUID | Transactional | factory |
| eventPayload | Workshop, Online, Remote, 20 days in the future, price 1, 3 seats | Transactional | factory |
| customerName | `Lifecycle API Test` | Transactional | factory |
| customerEmail | Existing application user email | Secret · Environment | env |

**Steps** *

| # | Action | Expected result (oracle) |
|---|--------|--------------------------|
| 1 | POST `/events` with `{eventPayload}` and title `{eventTitle}` | HTTP 201; returned event ID is an integer |
| 2 | POST `/bookings` with `{eventId}`, `{customerName}`, `{customerEmail}`, phone `5550100199`, quantity `1` | HTTP 201; returned success is true and returned booking ID is an integer |
| 3 | GET `/bookings/{bookingId}` | HTTP 200; event ID equals `{eventId}`, quantity equals 1, status equals `confirmed` |
| 4 | DELETE `/bookings/{bookingId}` | HTTP 200 |
| 5 | GET `/bookings/{bookingId}` after deletion | HTTP 404 |
| 6 | DELETE `/events/{eventId}` | HTTP 200 |
| 7 | GET `/events/{eventId}` after deletion | HTTP 404 |

**Postconditions** *

| State after the test | Cleanup | Scope |
|----------------------|---------|-------|
| Booking `{bookingId}` and event `{eventId}` no longer exist | DELETE remaining booking and event in finally cleanup | only resources created by TC7 |

