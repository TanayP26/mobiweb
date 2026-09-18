# MOBiLON Contact integration

Uses the existing mobiweb project `ockzsptkidacudfcfqcl` at
`https://ockzsptkidacudfcfqcl.supabase.co`. No replacement project or deployment
is needed to configure the frontend.

## Browser configuration

`.env.local` is Git-ignored and contains the correct project URL and configured
publishable key. For a fresh checkout, set `VITE_SUPABASE_ANON_KEY` to the project's
publishable key. Never use a secret/service-role key. Restart Vite after changing env
variables. Set the same two variables in the hosting build environment and rebuild.

Native fetch calls `/functions/v1/submit-contact` using JSON and `apikey`.
No SDK, login, Authorization bearer token or direct table access is required.
The deployed function has `verify_jwt = false`. Do not send `Idempotency-Key`:
the deployed CORS policy does not allow that header.

## Verified remote contract (2026-09-18)

Active function version 3 accepts `name`, `email`, `organisation`, `inquiryType`,
`message` and the `website` honeypot. The frontend sends canonical labels:
Collaborations, Sponsorships, Workshops, Technical Partnerships, Student Opportunities.
The function maps `inquiryType` to `inquiry_type` in `public.contact_messages`.
The database manages `id`, `status` (default `new`) and `created_at`.

The function generates required `dedupe_key` as SHA-256 of normalized email,
canonical inquiry label, trimmed message and the Unix minute bucket, joined by
U+001F. A unique constraint prevents duplicates within the same minute bucket.
This is not a rolling window: retries across a minute boundary can create another
record. The frontend in-flight ref prevents rapid duplicate submissions. There
are no automatic retries. Requests time out after 15 seconds and retain input.

Read-only remote queries confirmed RLS, field constraints, category/status/time
indexes and the unique dedupe constraint. Browser roles have no table grants.
Legacy `contact_submissions` and its data are untouched.

## Local source and migration differences

The modular local handler and REST adapter use the same payload, canonical labels,
aliases, dedupe algorithm and destination table. Storage uses atomic
`ON CONFLICT (dedupe_key) DO NOTHING` and leaves IDs to the database.

Local source retains its stricter checks: JSON content type, unknown fields,
bounded streaming reads, generic errors, honeypot rejection and the
`CONTACT_ALLOWED_ORIGINS` allowlist. The deployed version uses wildcard CORS and
silently accepts honeypots without inserting. Both avoid honeypot writes.
Local source is not byte-for-byte identical to production and was not redeployed.

Before a future intentional deployment of local source, configure
`CONTACT_ALLOWED_ORIGINS` with comma-separated exact origins, including
`http://localhost:8443,http://127.0.0.1:8443` and the real production origin
(scheme and host, no path/trailing slash). Missing origins fail closed.
Hosted wildcard CORS currently permits both local origins; their preflights passed.
Supabase supplies server credentials in the Edge Function runtime; never add them
to `.env.local`. CORS is not authentication or a distributed rate limiter.

The existing local `20260916183425_create_contact_messages.sql` now includes
required unique `dedupe_key`. It is a local schema definition, not an unapplied
production change. Remote history records the table under `20260916185450` and
also contains `20260916185548_secure_set_updated_at_search_path`. The historical
`20260915000000_create_contact_submissions.sql` is retained. Do not run `db push`
against the existing project from this history. Reconcile migration history
separately before future schema work. No migration was applied during this task.

## Verification

Use Node.js 22+ and npm:

```sh
npm install
npm run build
npx tsc --noEmit
deno check supabase/functions/submit-contact/index.ts
deno test supabase/functions/submit-contact/handler_test.ts
```

On 2026-09-18, install (zero reported vulnerabilities), build, TypeScript, Deno
checks and handler tests passed. Browser tests covered validation, five categories,
double submission, malformed responses, keyboard submission, failure recovery,
timeout and missing configuration. Requests were intercepted locally. Contact
screenshots at 1440, 768 and 390 pixels matched the pre-change screenshots.
Navigation and Contact link attributes were checked; an anchor check does not
guarantee external website availability.

Existing success copy is **MESSAGE RECEIVED**; it and the visual styles are preserved.
The final live browser test from `http://localhost:8443/#contact` made exactly one
POST to the deployed function. HTTP 200 returned `{"success":true}`; the UI showed
Sending... then MESSAGE RECEIVED, with no reload, redirect, dialog or runtime error.
The request sent the publishable key only in `apikey`, no Authorization header,
and only the six expected frontend fields. A read-only query confirmed exactly one
matching `MOBiLON E2E Test` / `MOBiLON Development Test` record, status `new`,
inquiry type `Technical Partnerships`, created at `2026-09-18 17:03:40.252466+00`.
The labelled test row remains. No schema, migration history or function deployment
was changed. This integration stores messages; it does not send email.

References: [function authorization](https://supabase.com/docs/guides/functions/auth),
[CORS](https://supabase.com/docs/guides/functions/cors).

## Cleanup

Removed `.tmp-contact-baseline/`, `.tmp-contact-build/`, `.tmp-contact-tools/` and
`.tmp-contact-baseline.config.ts` after verification. The permanent regression tests
in `supabase/functions/submit-contact/handler_test.ts` are retained (seven passing).
Existing App/Contact/Footer formatter differences and Vite future-config warnings
were left unchanged; the contact helper and Edge Function files pass formatting.
