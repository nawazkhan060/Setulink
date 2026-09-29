# MASTER PROMPT — SetuLink Prototype (SIH26129)

Paste everything below the line into Claude Code (or any AI coding assistant).

---

You are a senior full-stack engineer. Build a working **prototype** of **SetuLink**, an interoperability middleware platform for SIH 2026 problem statement **SIH26129: "System integration and interoperability among government digital platforms, resulting in fragmented service delivery."**

## 1. What SetuLink does
It sits between citizens and multiple independent government department systems (each with different data formats) and gives one unified layer: one login, one dashboard, one common data schema, consent-based sharing, configurable approval workflows, and full audit trails. It does NOT replace department systems.

## 2. Hard constraints
- **Stack:** React (Vite) frontend, Node.js + Express backend, **Supabase (Postgres + Auth + Realtime)** as the database, deployed on **Vercel** (serverless).
- **No AI/ML/LLM, no blockchain.** All logic deterministic and rule-based.
- Prototype scope: 3 mock departments, 1 end-to-end workflow, working demo. Don't over-engineer.
- Clean, polished UI (Tailwind CSS). Soft blue/white govtech look. Mobile-responsive.
- JavaScript (not TypeScript) to keep it fast.

## 3. Repo structure (monorepo)
```
setulink/
├── client/                 # React + Vite + Tailwind
│   └── src/ (pages, components, hooks, lib/supabase.js, lib/api.js)
├── api/                    # Vercel serverless entry
│   └── index.js            # exports the Express app
├── server/                 # Express app
│   ├── app.js
│   ├── middleware/         # auth.js, rbac.js, audit.js, errorHandler.js
│   ├── routes/             # gateway, registry, workflows, applications, consent, admin, mock, cron
│   ├── connectors/         # baseConnector.js, healthConnector.js, transportConnector.js, municipalConnector.js, index.js (registry)
│   ├── services/           # matching.js, validation.js, events.js, translation.js
│   └── lib/supabase.js     # service-role client
├── supabase/schema.sql     # tables + RLS + seed
├── vercel.json
└── .env.example
```

## 4. Database (Supabase Postgres) — write `supabase/schema.sql`
Tables:
- `profiles` (id → auth.users, full_name, role ['citizen','clerk','officer','admin'], department, citizen_id)
- `citizens_master` (citizen_id PK, name, dob, address, created_at) — **Master Citizen Registry**
- `department_links` (citizen_id, department, dept_record_id, match_status ['matched','needs_review','rejected'], match_score)
- Mock department tables with **deliberately different schemas**:
  - `mock_health` (patient_id, full_name, dob, address)
  - `mock_transport` (vehicle_owner_id, owner_name, date_of_birth, residential_address)
  - `mock_municipal` (citizen_ref, name, birth_date, addr_line)
- `connectors` (id, name, department, format ['json','xml','csv'], endpoint, field_map jsonb, active)
- `conflicts` (id, citizen_id, field, values jsonb, status ['open','resolved'], resolved_by)
- `workflows` (id, name, department) and `workflow_steps` (id, workflow_id, step_order, name, role_required)
- `applications` (id, citizen_id, workflow_id, current_step, status, data jsonb, created_at)
- `application_history` (id, application_id, step_name, action, actor_id, note, created_at)
- `consents` (citizen_id, department, purpose, granted bool, updated_at)
- `access_logs` (id, citizen_id, accessed_by, department, purpose, created_at)
- `events` (id, type, payload jsonb, processed bool, created_at) and `notifications` (id, user_id, message, read, created_at)
- `audit_logs` (id, actor_id, action, resource, meta jsonb, ip, created_at)
- `exceptions` (id, source, message, context jsonb, resolved, created_at)

Enable **RLS**: citizens read only their own rows; staff read by department; admin all. Server uses the service-role key and enforces RBAC in middleware too.

**Seed:** 20 citizens across the 3 mock tables, with ~5 overlapping people having small mismatches (e.g. "Rahul Sharma" vs "Rahul Sharma." / "R. Sharma", different address formatting, DOB typo) to demo conflict detection. Seed 1 workflow "Address Update": Applicant → Clerk Verify → Officer Approve → Done. Seed users: 1 citizen, 1 clerk, 1 officer, 1 admin.

## 5. Backend modules (Express)
1. **Auth & RBAC** — verify Supabase JWT (`supabase.auth.getUser(token)`), load profile, `requireRole(...roles)` middleware.
2. **Mock department APIs** (`/api/mock/health` → **JSON**, `/api/mock/transport` → **XML**, `/api/mock/municipal` → **CSV**) — simulate real siloed systems with different formats.
3. **Connector architecture** — `BaseConnector` with `fetchRecords()`, `toCommon(raw)`, `fromCommon(common)`. One connector per department, registered in `connectors/index.js`. Adding a department = add one file + one `connectors` row. Use `xml2js` and `papaparse` for parsing.
4. **Gateway** — `GET /api/gateway/citizen/:id` fans out to all active connectors in parallel, translates to the common schema `{citizen_id, name, dob, address, source}`, checks consent before including each department, writes `access_logs` + `audit_logs`, and returns a unified record. Wrap each connector call in try/catch; failures go to `exceptions` and the response still returns partial data.
5. **Matching & dedup** (`services/matching.js`) — deterministic: exact ID match, normalized-name Levenshtein similarity (`fastest-levenshtein`), DOB equality, address token overlap. Score ≥ 0.9 → auto-link; 0.6–0.9 → `needs_review` + `conflicts` row; < 0.6 → separate. **Never silently merge conflicts.**
6. **Data-quality validation** (`services/validation.js`) — required fields, 12-digit mock ID format, DOB not in future, exact-duplicate rejection. Return a clear reason per failure.
7. **Workflow engine** — `POST /api/applications` starts an application at step 1; `POST /api/applications/:id/advance` (role must match `role_required` of current step; actions approve/reject with note) writes `application_history`, updates status, emits an event.
8. **Workflow builder API** — CRUD for `workflows` and `workflow_steps` (admin only).
9. **Events & notifications** — `services/events.js` inserts into `events` on status change and creates `notifications` for the citizen. `GET /api/cron/dispatch` (protected by `CRON_SECRET`) processes unprocessed events. Also push in-app updates through **Supabase Realtime** on `notifications`.
10. **Consent API** — citizen can list access logs and toggle consent per department.
11. **Admin API** — audit logs (filter/search), exceptions list, open conflicts + resolve, metrics (requests per department per day, error rate, pending conflicts, applications by status).
12. **Error handler** — central Express error middleware: log to `exceptions`, return clean JSON, never leak stack traces.

## 6. Frontend (React + Tailwind + react-router)
Pages by role:
- **Login** (Supabase Auth email/password) → redirect by role.
- **Citizen:** Unified Dashboard (department cards with status badges, merged record view), My Applications (progress stepper per application, start new "Address Update"), Consent & Access Log (who accessed what, toggle per department), Notifications bell (Realtime).
- **Clerk/Officer:** Task queue (applications at their step), review panel with approve/reject + note.
- **Admin:** Monitoring dashboard (react-chartjs-2: requests per dept, error rate, applications by status, pending conflicts), Conflict Review (side-by-side values from each dept, resolve button), Workflow Builder (add/reorder/remove steps, assign role — drag-drop with `@dnd-kit` or up/down buttons), Connector Manager (list/enable/disable connectors, view field map), Audit Log (searchable table), Exceptions view.
- **Live Data-Flow view (stretch):** animated SVG showing Citizen → Gateway → 3 departments, lighting up on each real gateway call.
- **Impact panel:** static before/after card — "5 logins, 5 forms, days → 1 login, 1 form, minutes."

## 7. Vercel deployment (serverless)
- `api/index.js`: `import app from '../server/app.js'; export default app;`
- `vercel.json`:
  - `buildCommand`: `cd client && npm install && npm run build`, `outputDirectory`: `client/dist`
  - rewrites: `/api/(.*)` → `/api`; everything else → `/index.html` (SPA fallback)
  - `crons`: `[{ "path": "/api/cron/dispatch", "schedule": "0 0 * * *" }]` (Hobby plan allows daily only; also process events inline on write so notifications feel instant)
- Keep functions stateless; create the Supabase client once per module, no in-memory sessions.
- Env vars (`.env.example` + Vercel dashboard): `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (server only), `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `CRON_SECRET`.
- Never expose the service-role key to the client.

## 8. Build order
1. Scaffold monorepo, Tailwind, Supabase project, `schema.sql` + seed.
2. Auth + RBAC middleware + login page.
3. Mock department endpoints (JSON/XML/CSV) + connectors + gateway.
4. Matching, validation, conflicts.
5. Citizen unified dashboard.
6. Workflow engine + builder + task queue + history.
7. Events, notifications, Realtime bell.
8. Consent + access log page.
9. Admin dashboard, audit log, exceptions, conflict review, connector manager.
10. Data-flow visualization + impact panel + polish.
11. Deploy to Vercel, test on the live URL.

## 9. Acceptance criteria (prototype is done when)
- Citizen logs in once and sees merged records from all 3 departments despite different source formats.
- Overlapping citizens with mismatched data show up in the admin conflict queue, not auto-merged.
- Revoking consent for a department removes it from the unified view and is logged.
- An "Address Update" application moves Applicant → Clerk → Officer, each step restricted to the right role, and the citizen gets a notification on each change.
- Admin can add a new step to the workflow from the UI and see it applied to new applications.
- A deliberately broken connector produces an entry in Exceptions while the gateway still returns partial results.
- Every gateway access and workflow action appears in the audit log.
- App runs on a public Vercel URL.

## 10. Output expectations
Generate complete, runnable code for every file, the SQL schema with seed, setup instructions (Supabase project, env vars, `vercel deploy`), and a short demo script. Keep code commented and simple. Ask me only if something is truly blocking; otherwise make reasonable assumptions and state them.