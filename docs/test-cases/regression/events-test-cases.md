### TC6: Create, read, and delete an event through the API

| Field | Value |
|-------|-------|
| Requirement / AC * | RL-001 · An authenticated user can create, read, and delete an event |
| Objective * | Verify that event resource lifecycle operations leave the resource unavailable after deletion |
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
| eventTitle | `ENV.testDataPrefix` + `lifecycle` + parallel index + timestamp + UUID | Transactional | `src/data/events.data.ts` factory |
| eventPayload | Workshop, Online, Remote, 20 days in the future, price 1, 3 seats | Transactional | `buildEventPayload()` factory |

**Steps** *

| # | Action | Expected result (oracle) |
|---|--------|--------------------------|
| 1 | POST `/events` with `{eventPayload}` and title `{eventTitle}` | HTTP 201; returned success is true and returned event ID is an integer |
| 2 | GET `/events/{eventId}` | HTTP 200; title equals `{eventTitle}` and category equals `Workshop` |
| 3 | DELETE `/events/{eventId}` | HTTP 200 |
| 4 | GET `/events/{eventId}` after deletion | HTTP 404 |

**Postconditions** *

| State after the test | Cleanup | Scope |
|----------------------|---------|-------|
| Event `{eventId}` no longer exists | DELETE `/events/{eventId}` in finally cleanup if deletion did not complete | only event created by TC6 |

**Automation handoff**

```yaml
tc: TC6
title: Create, read, and delete an event through the API
suite: regression
tags: ['@mutates-data']
automation: automatable
fixtures:
  identity: worker<EventHubApi>
  state: created<Event>
data:
  - name: eventTitle
    class: transactional
    source: buildEventPayload()
  - name: eventPayload
    class: transactional
    source: src/data/events.data.ts
captured: [eventId]
steps:
  - action: POST /events
    oracle: HTTP 201; success is true; event ID is an integer
  - action: GET /events/{eventId}
    oracle: title equals eventTitle and category equals Workshop
  - action: DELETE /events/{eventId}
    oracle: HTTP 200
  - action: GET /events/{eventId}
    oracle: HTTP 404
postconditions:
  - delete only eventId created by TC6
```

