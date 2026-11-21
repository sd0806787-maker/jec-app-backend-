# JEC Student App

An Expo / React Native companion app for JEC students. It pulls attendance data
from the college portal, serves timetable / syllabus / library / announcement
content from a GitHub-hosted JSON bucket, and talks to a small Express + MongoDB
backend for campus issues, lost & found posts, and optional auth.

> This is an unofficial student project, not an official JEC application.

## Tech stack

| Layer | Choice |
| --- | --- |
| App framework | Expo SDK 58, React Native 0.88, React 19.3 |
| Language | TypeScript (strict) |
| Navigation | React Navigation 7 (native stack + bottom tabs) |
| Storage | `@react-native-async-storage/async-storage` |
| Backend | Node.js + Express 5 + Mongoose 9 (`jec-backend/`) |
| Database | MongoDB |

## Repository layout

```text
.
├── App.tsx                  # Providers + NavigationContainer
├── index.ts                 # Expo entry point
├── src/
│   ├── components/          # Shared UI components
│   ├── context/             # Theme, Student and Auth contexts
│   ├── data/                # Bundled mock/offline data
│   ├── navigation/          # AppNavigator + route param types
│   ├── screens/             # All application screens
│   ├── services/            # API client, config and image helpers
│   ├── theme/               # Theme tokens
│   └── utils/               # Shared helpers
├── jec-backend/             # Express + MongoDB API
└── assets/                  # Icons and images
```

Navigation is defined in `src/navigation/AppNavigator.tsx`:

- Root stack: `Login` → `MainApp` (tabs), plus `Register` and `Announcements`.
- Tabs: `Home`, `Academics`, `Holiday`, `Profile`.
- `Academics` is a nested stack containing attendance, CIE marks, timetable,
  notes, syllabus, toppers, study planner, library, hostel, medical leave, SOS,
  campus issues and lost & found.

## Getting started

```bash
# install app dependencies
npm install

# copy environment defaults
cp .env.example .env

# start the Expo dev server
npx expo start
```

Useful scripts:

```bash
npm run lint        # ESLint (expo lint)
npm run typecheck   # tsc --noEmit
npx expo-doctor     # dependency / config checks
```

Most native modules used here ship with Expo Go. If you add a library with
custom native code, create a development build with `npx expo run:android` /
`npx expo run:ios`, or `eas build --profile development`.

## Environment variables

Expo inlines `EXPO_PUBLIC_*` variables at build time, so they are **not secret**
and must be referenced statically. Copy `.env.example` to `.env` and override as
needed:

| Variable | Default | Used for |
| --- | --- | --- |
| `EXPO_PUBLIC_API_URL` | `https://jec-backend.onrender.com` | Campus backend (issues, lost & found, auth) |
| `EXPO_PUBLIC_ATTENDANCE_API_URL` | `https://attendance.jecassam.ac.in` | Read-only student attendance reports |
| `EXPO_PUBLIC_CONTENT_BASE_URL` | GitHub raw `jec-app-data` bucket | Timetable, syllabus, library, announcements, holidays, professors, students |

All base URLs are centralised in `src/services/api.ts`; screens never hard-code
hostnames. `apiRequest()` adds the `ngrok-skip-browser-warning` header (harmless
for non-ngrok hosts), parses JSON safely, applies a timeout, and throws a typed
`ApiError`.

Release builds should use a hosted backend you own (see `render.yaml`). A dev
tunnel URL is fine locally but must **never** be baked into a release build by
accident: the moment the tunnel or the developer's machine goes down the app
shows "campus server is currently offline". As a safety net,
`src/services/api.ts` ignores ngrok URLs in non-development bundles and falls
back to the hosted URL.

If you deliberately want a tunnel-backed APK (e.g. no hosted backend is
available), set BOTH variables in the Expo Services environment for that build
profile:

```
EXPO_PUBLIC_API_URL=https://stalling-staunch-untimely.ngrok-free.dev
EXPO_PUBLIC_ALLOW_TUNNEL=true
```

`EXPO_PUBLIC_ALLOW_TUNNEL=true` is the explicit opt-in that bypasses the safety
net. That APK only works while the backend and ngrok are running on this
machine — it is a temporary bridge, not a permanent fix.

### Current production bridge (temporary)

The Render service at `https://jec-backend.onrender.com` is still running an
older build that does not expose the `/api/*` routes, so the `production` EAS
environment currently points at the ngrok tunnel instead:

```
EXPO_PUBLIC_API_URL=https://stalling-staunch-untimely.ngrok-free.dev
EXPO_PUBLIC_ALLOW_TUNNEL=true
```

An OTA update with these values has been published to the `production` channel.
It only works while the local backend (port 3000) and the ngrok tunnel are
online. To return to a permanent setup, redeploy `jec-backend/` to Render with
the current code, then set `EXPO_PUBLIC_API_URL` back to the Render URL, remove
`EXPO_PUBLIC_ALLOW_TUNNEL`, and publish another update.

## Features

### Login and student data

- Roll-number-only login. There is no password prompt in the app.
- `LoginScreen` calls `POST /api/auth/login-roll` on the campus backend. The
  backend fetches live data from the college portal (and falls back to the last
  saved record if the portal is unavailable), then the app maps the response
  into `StudentContext` and caches it in AsyncStorage (`@jec_roll`, `@jec_data`).
- On the next launch the cached profile is shown immediately and refreshed in
  the background.
- `RegisterScreen` can create a separate backend account, but the roll-only
  login does not require it.

### Attendance and academics

- Attendance overview, subject breakdown, CIE marks, animated CIE analytics,
  attendance calculator, timetable, syllabus, toppers, notes/resources, and a
  local study planner (persisted with AsyncStorage).

### Content screens

Timetable, syllabus, library, announcements, holidays, professors and topper
lists are fetched from `${CONTENT_BASE_URL}/*.json` with a local cache/fallback:

| File | Consumers |
| --- | --- |
| `timetable.json` | Timetable |
| `syllabus.json` | Syllabus |
| `library.json` | Library |
| `announcements.json` | Announcements |
| `holidays.json` | Holiday calendar |
| `professors.json` | Medical leave recipients |
| `students.json` | Toppers |

### Campus issues (`/api/issues`)

- `GET /api/issues/all` — list (images excluded server-side).
- `GET /api/issues/:id` — detail (includes `imageBase64`).
- `POST /api/issues/report` — create.

`IssuesScreen` seeds the list with bundled dummy data, then replaces it with
live data when the request succeeds. `ReportIssueScreen` resizes the photo,
converts it to a base64 data URI, and submits it. If the network fails the user
sees an error and can retry.

### Lost & found (`/api/lostfound`)

- `GET /api/lostfound/all` — list.
- `GET /api/lostfound/:id` — detail.
- `POST /api/lostfound/report` — create (`type` must be `Lost` or `Found`).
- `DELETE /api/lostfound/:id?reportedBy=...` — delete your own post.

`ReportLostItemScreen` submits type, item name, location, contact, description
and an optional base64 photo.

### Other screens

- **Medical leave** — picks a PDF and opens the device mail composer with the
  selected professor pre-filled (no server-side email is sent from the app).
- **Hostel management** — demo data for hostels 1–13.
- **SOS** — hold-to-call prototype. The campus security number is a placeholder
  and must be replaced before real use.
- **Profile** — theme, cache refresh, update check via `expo-updates`, support
  mail link, and logout.

## Backend (`jec-backend`)

```bash
cd jec-backend
npm install
cp .env.example .env   # then fill in MONGO_URI, EMAIL_*, JWT_SECRET
npm start              # node server.js
```

Environment variables (see `jec-backend/.env.example`):

| Variable | Purpose |
| --- | --- |
| `PORT` | HTTP port (default `3000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | JWT signing secret |
| `EMAIL_USER` / `EMAIL_PASS` | Gmail account + App Password for the medical mailer |
| `BODY_LIMIT` | Max JSON body size (default `25mb`, base64 images) |

Routes:

| Method + path | Description |
| --- | --- |
| `GET /` | Health check + mounted route list |
| `POST /api/auth/register` | Create a student account |
| `POST /api/auth/login` | JWT login |
| `GET /api/issues`, `/api/issues/all` | List issues |
| `GET /api/issues/:id` | Issue detail |
| `POST /api/issues/report` | Create issue |
| `GET /api/lostfound/all` | List lost & found items |
| `GET /api/lostfound/:id` | Item detail |
| `POST /api/lostfound/report` | Create item |
| `DELETE /api/lostfound/:id` | Delete an item (owner check) |
| `POST /api/medical/apply` | Multipart medical leave upload |
| `POST /api/send-medical-email` | Proxy medical email (legacy) |
| `GET /api/action?action=studentReport&roll=...` | Attendance portal proxy |

During local development, expose the backend with ngrok and set
`EXPO_PUBLIC_API_URL` to the tunnel URL, or use your machine's LAN IP. The
reserved domain can be resumed with:

```bash
ngrok http 3000 --url=stalling-staunch-untimely.ngrok-free.dev
```

A tunnel is **development only** by default — shipping one requires the
explicit `EXPO_PUBLIC_ALLOW_TUNNEL=true` opt-in described above.

## Deploying the backend (Render)

`render.yaml` is a Render Blueprint that deploys `jec-backend/` as a Node web
service.

1. **MongoDB Atlas** (free M0 is fine):
   1. Create an Atlas account and a cluster.
   2. **Database Access → Add new database user**: note the username/password.
   3. **Network Access → Add IP Address → Allow access from anywhere**
      (`0.0.0.0/0`) because Render's outbound IPs change.
   4. **Database → Connect → Drivers → Node.js**, copy the URI, and replace
      `<password>` with the database user's password. It should look like
      `mongodb+srv://user:pass@cluster.mongodb.net/jec_student_db`.
2. **GitHub**: push this repository to a GitHub repo that Render can read, then
   in Render use **New → Blueprint → select that repository**. The Blueprint
   deploys the service as `jec-backend-v2` (the old `jec-backend` name is taken
   by the stale service). Copy the URL Render assigns, e.g.
   `https://jec-backend-v2.onrender.com`.
3. In the Blueprint form provide `MONGO_URI` (from step 1), `EMAIL_USER` and
   `EMAIL_PASS`. `JWT_SECRET` is generated for you. Never commit these values.
4. Wait for `GET /` on the new URL to return `{"ok":true,...}` (the Blueprint's
   health check), then verify `GET /api/issues` returns
   `{"success":true,"count":0,"data":[]}`.
5. **Seed student records in the hosted DB** — login falls back to cached
   records when the college portal is unavailable, and a brand-new Atlas DB has
   none. From the machine with the current local data:
   ```bash
   mongodump --db jec_student_db --collection students --out /tmp/jec_mongo_backup
   mongorestore --uri "<ATLAS_MONGO_URI>" \
     /tmp/jec_mongo_backup/jec_student_db/students.bson \
     --db jec_student_db --collection students
   ```
   (Or use `cd jec-backend && npm run seed` after copying real records into
   `data/students.json`.)
6. Point the app at the service. Replace `<RENDER_URL>` with the URL from
   step 2. In SDK 55+, `eas update` requires an `--environment` flag, and only
   variables from that Expo Services environment are inlined into the bundle.
   Remove the tunnel opt-in from production at the same time:

   ```bash
   npx eas-cli@latest env:set --name EXPO_PUBLIC_API_URL \
     --value <RENDER_URL> \
     --environment production --visibility plaintext
   npx eas-cli@latest env:set --name EXPO_PUBLIC_API_URL \
     --value <RENDER_URL> \
     --environment preview --visibility plaintext
   npx eas-cli@latest env:delete production \
     --variable-name EXPO_PUBLIC_ALLOW_TUNNEL --non-interactive
   ```

7. Ship it:
   - **Already-installed APK** (same app version, `production` channel):
     ```bash
     npx eas-cli@latest update --channel production --environment production \
       --message "Point app at hosted backend"
     ```
     Force-close and reopen the app twice to download and apply the update. If
     the installed binary's runtime version does not match, the update will be
     ignored — build a new binary instead.
   - **New binary** (e.g. a downloadable APK):
     ```bash
     npx eas-cli@latest build --profile production --platform android
     ```

> The `starter` plan in `render.yaml` keeps the service always on. The `free`
> plan sleeps after inactivity and the first request can take ~1 minute, which
> the app reports as a timeout. Keep `starter` for real users.

## Seeding cached student records

The college portal currently answers
`No student report is available for the current academic year 2026–2027`.
`POST /api/auth/login-roll` falls back to the last saved record when live data
is unavailable, so a student needs an existing record to log in. Seed them:

```bash
cd jec-backend
cp data/students.sample.json data/students.json   # edit with the real records
npm run seed                                      # or: npm run seed -- path/to/file.json
```

Make sure `MONGO_URI` in `jec-backend/.env` points to the **same database the
hosted backend uses** (the Atlas URI from the Render service), otherwise the
seed lands in your local database and the app will not see it.

`data/students.json` is gitignored. Each record accepts `roll`, `name`,
`branch`, `semester`, `section`, `academicYear`, and optional `overall` and
`subjects`. The script upserts by roll (case-insensitive) and assigns a random
password, so seeded accounts cannot be used with the password login route.
Re-run it any time to refresh the cached values.

## If the app still says "offline"

- `curl https://jec-backend.onrender.com/` must return JSON with `"ok":true`.
  An HTML page or an `ngrok-error-code` header is what triggers the app's
  "campus server is currently offline" message.
- The app checks for updates on launch. After `eas update`, force-close and
  reopen it twice so the new bundle (with the new URL) is applied.
- For local development only: start the backend (`npm start` in `jec-backend/`)
  and the tunnel. Check `curl http://127.0.0.1:4040/api/tunnels` lists the
  public URL. An ngrok `404` with `ngrok-error-code: ERR_NGROK_3200` means the
  endpoint is offline. If ngrok logs `failed to dial ... i/o timeout`, force
  the libc resolver:

  ```bash
  GODEBUG=netdns=cgo ngrok http 3000 --url=stalling-staunch-untimely.ngrok-free.dev
  ```

## Local verification

```bash
npx tsc --noEmit   # passes
npx expo lint      # 0 errors, a few hook-dependency warnings
```

The current lint warnings are `react-hooks/exhaustive-deps` in animation-heavy
screens (intentional mount-only animations) and can be addressed later.

## Known limitations / prototype areas

- The app trusts a roll number; there is no password or token check in the
  login flow.
- `AuthContext` is implemented but not mounted in `App.tsx`.
- Campus issue and lost & found lists show an inline empty state or an error
  with retry when the backend is unreachable; there is no bundled dummy data.
- Medical leave does not upload to `/api/medical/apply`; it opens the mail app.
- SOS phone numbers and hostel data are placeholders.

## Security notes

- Never commit `.env` files or student data. The root `.gitignore` ignores
  `.env`, `.env.*` (except `.env.example`), `jec-backend/.env`, and
  `jec-backend/data/students.json`.
- `EXPO_PUBLIC_*` values are embedded in the client bundle — treat them as
  public. The Gmail App Password and `JWT_SECRET` must stay server-side only.
- The backend currently allows `origin: '*'`; restrict CORS before deploying.
