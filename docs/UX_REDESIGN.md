# Medica UX redesign

## Version workflow

- `main` — protected baseline containing every implemented capability before the redesign.
- `design/v1-clinical-calm` — first design direction, and the **extended** scope version.
- `design/v1-spec-baseline` — **base** scope version: business requirements + `MEDICA_SPEC.md` only. Same design language as v1; scope differs.
- Further directions should use `design/v2-*`, `design/v3-*`, and so on.
- A chosen direction returns to `main` only after desktop/mobile QA and a capability parity check.

**Scope rule.** "No business capability may be removed" applies within a scope version, not across them. Many capabilities in the inventory below were never in the business requirements — see [SCOPE.md](./SCOPE.md) for the item-by-item split and which version each one lives in. Removing them on `design/v1-spec-baseline` is deliberate, not a regression.

## Official brand materials

V1 uses the official Medica logo and the hospital logos available on the official Medica, Elisha, RMC and Raphael sites. The product palette is based on the official deep purple (`#462E79`), lavender, turquoise (`#12CBCA`) and blue-grey neutrals. Asset provenance is documented in `public/brand/SOURCES.md`.

## Capability inventory (extended version)

### Doctor

- OTP login and verification.
- Personal and combined surgery schedules.
- Day and month views, date navigation, hospital blocks and free slots.
- Managed-surgeon search and selection.
- Create, view, edit, swap and delete surgery flows.
- Patient lookup, surgery details, requirements, equipment, fees and documents.
- All-surgeries table, filters, summaries, discharge letters and spreadsheet export.

### Patient

- OTP login and verification.
- Upcoming appointments separated into tests/surgeries and specialists.
- Appointment details, preparation checklist and summons document.
- Instructions drawer, SMS handoff, home Check-in and attendance confirmation.
- Prior-image/document upload, calendar sync, reschedule and cancellation request.
- Results split into tests/imaging and specialist/surgery summaries.
- Date filtering, unread/new state, document download and MyVue handoff.
- Medical-document search and type filtering.
- Unified account menu with personal details, accessibility/language preferences, notification settings, privacy and logout.
- Persistent appointment-booking action in the patient header.

## Direction 1 — Clinical Calm

Design goals:

1. High-trust private medicine: official Medica purple, restrained turquoise, warm whites, precise typography and restrained shadows.
2. Shared product language: the same brand, controls, surfaces and feedback for both audiences.
3. Audience-specific density: calm guided cards for patients; compact operational information for doctors.
4. Progressive disclosure: primary tasks stay visible; secondary actions live in drawers and modals.
5. Stable orientation: persistent navigation and consistent page titles on every route.

Reference traits retained:

- Clear side/top navigation from Jobber, Canva and Employment Hero.
- Calendar hierarchy and low-noise grids from Adobe Express and Clockwise.
- Focused modal and drawer flows from Uxcel, Navan and Time2Book.
- Simple date/slot selection and strong progression from Walmart and Amie.

## Evaluation checklist

- No capability from the inventory disappears.
- The primary action on each screen is identifiable in under five seconds.
- Patient screens remain usable at 390px width.
- Doctor schedule remains usable at desktop operational density.
- Keyboard focus, dialog roles, labels and minimum touch targets remain intact.
- Production build completes without TypeScript or browser errors.
