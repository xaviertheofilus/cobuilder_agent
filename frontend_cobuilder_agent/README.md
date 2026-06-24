# BSI CoBuilder Agent FE

Frontend aplikasi CoBuilder Agent BSI (React + Vite) untuk alur landing -> auth -> dashboard builder dengan split panel preview/code.

## 1. Stack dan Menjalankan Project

- React 19, Vite 8, React Router DOM 6
- Zustand (state), Axios (REST), Fetch streaming (SSE-like)
- JSZip (download ZIP), Highlight.js (code view)

```bash
cd FE/frontend_cobuilder_agent
npm install
npm run dev
```

Default URL lokal: `http://localhost:5173`

Environment:

```env
VITE_API_BASE_URL=http://localhost:8000
# optional: base URL host preview dari backend
VITE_PREVIEW_BASE_URL=http://localhost:8000
```


## 1.1 Menjalankan via Docker Compose

Build image + jalankan container:

```bash
cd FE/frontend_cobuilder_agent
docker compose up --build -d
```

Akses aplikasi:

- `http://localhost:5173`

Stop container:

```bash
docker compose down
```

Set API backend saat build image (opsional):

```bash
# PowerShell
$env:VITE_API_BASE_URL="http://localhost:8000"
docker compose up --build -d
```

Catatan:

- Docker compose memakai `Dockerfile` multi-stage (build Vite + serve Nginx).
- Routing SPA sudah ditangani oleh `nginx.conf` (`try_files ... /index.html`).
## 2. Scope Saat Ini (Production-ready FE + Mock-safe)

- FE production pattern: modular components, store terpusat, services terpisah.
- Auth saat ini mock (`admin/admin`, atau password `bsi123`) sesuai scope sementara.
- Chat streaming + generation status punya fallback mock jika backend belum tersedia.
- Integrasi backend nyata tinggal sambungkan endpoint sesuai kontrak di bawah.

## 3. Routing dan Halaman

- `/` -> Landing
- `/login` -> Login
- `/register` -> Register
- `/dashboard` -> Protected route (butuh token)

Catatan UI behavior terbaru:

- Tombol back di login/register sudah dihapus.
- Logo di login/register sekarang klikable ke landing (`/`).
- Dashboard tidak memakai behavior itu (sesuai request).

## 4. E2E Flow Utama

1. User masuk landing -> klik `Start Building`.
2. Login/Register -> validasi credential mock -> set token di store persist (`cb-auth`).
3. Redirect ke dashboard protected.
4. User kirim prompt -> message user tersimpan -> stream assistant berjalan.
5. Setelah stream selesai -> status generate aktif -> poll status project.
6. Saat completed -> preview URL + code files ditampilkan di split panel.
7. User tetap di chat setelah submit. Split panel hanya terbuka saat tombol `Preview` di navbar diklik, lalu user bisa `Refresh`, `New tab`, `ZIP download`.

## 5. API Komunikasi FE <-> BE (Daftar Fitur Lengkap)

Sumber implementasi FE:

- `src/services/api.js`
- `src/services/streamChat.js`
- `src/services/pollStatus.js`
- `src/hooks/useStream.js`
- `src/hooks/usePoller.js`

### 5.1 Matrix Endpoint Per Fitur (Untuk Tim BE)

| Feature FE | Method | Endpoint | Auth | Request Minimum | Response Minimum |
|---|---|---|---|---|---|
| Login | `POST` | `/auth/login` | No | `{ "email": "user@bsi.co.id", "password": "***" }` | `{ "token": "jwt", "user": { "name": "User", "email": "user@bsi.co.id" } }` |
| List project | `GET` | `/projects` | Yes | - | `{ "items": [{ "id": "p1", "name": "Project", "status": "idle" }] }` atau array langsung |
| Create project | `POST` | `/projects` | Yes | `{ "name": "Untitled Project" }` | `{ "id": "p99", "name": "Untitled Project", "status": "idle" }` |
| Get project detail | `GET` | `/projects/:id` | Yes | - | `{ "id": "p1", "name": "Project", "status": "idle" }` |
| Generate app | `POST` | `/projects/:id/generate` | Yes | `{ "prompt": "...", "style": {...}, "attachments": [] }` | `{ "jobId": "g-123", "status": "pending" }` |
| Poll generation status | `GET` | `/projects/:id/status` | Yes | - | `{ "status": "pending|generating|completed|failed", "progress": 0 }` |
| Ambil preview + code | `GET` | `/projects/:id/preview` | Yes | - | `{ "url": "https://...", "files": [{ "path": "src/App.jsx", "content": "..." }] }` |
| Chat streaming | `POST` | `/projects/:id/messages` | Yes | `{ "content": "user prompt" }` | Stream `data:` chunk + `data: [DONE]` |
| Apply edit prompt | `POST` | `/projects/:id/edits` | Yes | `{ "instruction": "ubah ..." }` | `{ "status": "accepted" }` atau payload hasil edit |
| Version list | `GET` | `/projects/:id/versions` | Yes | - | `{ "items": [{ "id": "v1", "createdAt": "..." }] }` |

### 5.2 Header & Security Contract

Semua endpoint protected harus menerima:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

Token dikirim otomatis oleh FE via interceptor Axios berdasarkan store `cb-auth`.

### 5.3 Detail Stream Contract (Paling Penting)

Endpoint: `POST /projects/:id/messages`

Body:

```json
{ "content": "Build smart invoice management app" }
```

Response streaming yang dikonsumsi FE:

```text
data: {"text":"chunk 1"}

data: {"text":"chunk 2"}

data: [DONE]
```

Catatan penting backend:

1. Gunakan prefix `data: ` per event line.
2. Akhiri stream dengan `[DONE]`.
3. Disarankan JSON konsisten dengan key `text`.
4. Jika error, return HTTP error JSON biasa (non-stream).

### 5.4 Detail Polling Contract

Endpoint: `GET /projects/:id/status`

Response minimum:

```json
{
  "status": "pending",
  "progress": 0
}
```

Nilai `status` yang dikenali FE:

- `pending`
- `generating`
- `completed`
- `failed`

Saat `completed`, FE akan lanjut call:

- `GET /projects/:id/preview`

Response minimum:

```json
{
  "url": "https://preview-host/app/123",
  "files": [
    { "path": "src/App.jsx", "content": "export default function App(){}" }
  ]
}
```

### 5.5 Error Response Standard (Rekomendasi)

Gunakan bentuk seragam:

```json
{
  "message": "human-readable error",
  "code": "ERROR_CODE",
  "details": null
}
```

Status code yang disarankan:

- `400` bad input
- `401` unauthorized
- `403` forbidden
- `404` not found
- `409` conflict
- `422` validation error
- `429` rate limited
- `500` server error


### 5.6 Sequence Komunikasi FE <-> BE (Detail Operasional)

#### A. Login Flow

1. FE kirim `POST /auth/login` dengan email + password.
2. BE return `token` + object `user`.
3. FE simpan `token` ke store persist `cb-auth`.
4. Semua request protected berikutnya otomatis membawa header `Authorization: Bearer <token>`.

#### B. Generate App Flow

1. User submit prompt dari chat composer.
2. FE tetap berada di mode chat (split panel tidak auto-open).
3. FE stream request ke `POST /projects/:id/messages`.
4. BE kirim chunk bertahap (`data: {"text":"..."}`) sampai `data: [DONE]`.
5. FE finalisasi message assistant -> set state generating (`pending`).
6. FE mulai polling `GET /projects/:id/status` berkala.
7. Jika status `completed`, FE call `GET /projects/:id/preview`.
8. BE return `url` preview + `files[]`.
9. FE render data preview/files. Panel preview dibuka manual saat user klik `Preview` di navbar.

#### C. Edit / Iteration Flow

1. User kirim revisi prompt.
2. FE call `POST /projects/:id/edits`.
3. BE proses diff/edit versi code.
4. FE lanjut polling status dan refresh preview/code saat selesai.

#### D. Versioning Flow

1. FE call `GET /projects/:id/versions` saat user butuh histori.
2. BE return daftar versi (`id`, timestamp, metadata).
3. FE tampilkan sebagai referensi rollback/compare (sesuai evolusi UI).

#### E. Error & Recovery Contract

- Jika endpoint sync gagal: FE tampilkan error message + tidak crash.
- Jika stream gagal: FE fallback ke simulasi stream agar UX tetap jalan.
- Jika polling gagal setelah generate: FE set status `failed`.
- Jika preview endpoint gagal: FE fallback ke mock preview pada mode dummy.

#### F. Timeout & Retry Policy (Current FE Behavior)

- Axios timeout global: `8000ms` (`src/services/api.js`).
- Stream chat timeout: `12000ms` (`src/services/streamChat.js`).
- Poll interval status: `1400ms` (`src/services/pollStatus.js`).
- Retry eksplisit belum dibuat sebagai exponential-backoff; saat ini fallback/mock digunakan untuk menjaga continuity UX.

#### G. Data Shape yang Wajib Konsisten dari BE

- `status` harus salah satu: `pending | generating | completed | failed`.
- `progress` harus numerik `0-100`.
- `files[]` wajib punya `path` (string) dan `content` (string).
- Stream payload direkomendasikan konsisten pakai key `text`.

## 6. Backend Handoff (Kontrak Integrasi)

Agar FE langsung nyambung ke BE tanpa ubah UI:

1. Stabilkan endpoint pada section 5.
2. Gunakan enum status yang sama: `pending/generating/completed/failed`.
3. Pastikan streaming endpoint kirim `data:` line valid + `[DONE]`.
4. Return `files[]` path+content agar tab code & ZIP aktif otomatis.
5. Jika response list dibungkus `{ items: [] }`, pastikan konsisten di semua list endpoint.

## 7. Hasil Scan E2E, Security, Scalability, Network

### 7.1 Verifikasi yang dijalankan

- `npm run lint` -> pass
- `npm run build` -> pass
- `npm audit --omit=dev` -> pass (0 vulnerabilities)
- route check lokal (`/`, `/login`, `/register`, `/dashboard`, `/feature-index.html`) -> HTTP 200

### 7.2 Security review ringkas

- Dependency vulnerability React Router sudah di-fix (`npm audit fix`).
- `window.open` diberi `noopener,noreferrer` untuk mencegah opener hijack.
- Auth saat ini mock by design (bukan auth produksi).
- Token masih localStorage (sementara). Untuk production, rekomendasi HttpOnly cookie + refresh token.

### 7.3 Scalability review ringkas

- Arsitektur state/service sudah modular dan siap dipisah domain per fitur.
- Catatan performa build: bundle utama masih besar (>500kB gzip warning).
  Rekomendasi: route-level code splitting (`React.lazy`) untuk dashboard/split panel.
- Polling interval saat ini fixed; untuk scale besar disarankan webhook/SSE status channel.

### 7.4 Network behavior

- Base URL configurable via env.
- Timeout sudah ada di axios dan stream request.
- Fallback mock menjaga UX tetap jalan ketika backend down/offline.

## 8. Struktur Folder Inti

- `src/pages` -> landing/login/register/dashboard
- `src/components` -> layout/chat/split-panel/ui/marketing
- `src/stores` -> auth + project state
- `src/services` -> API/poll/stream
- `src/hooks` -> orchestration stream dan poll

## 9. Artefak Dokumentasi Tambahan

Halaman index fitur lintas page tersedia di:

- `public/feature-index.html`

Bisa diakses saat dev via:

- `http://localhost:5173/feature-index.html`

## 10. Catatan Produksi Lanjutan (Saat BE Sudah Live)

- Ganti mock login menjadi auth API nyata.
- Aktifkan refresh token/session hardening.
- Tambahkan observability (request-id, log correlation, Sentry).
- Tambahkan test otomatis (unit + integration + e2e browser).
- Tambahkan schema validation response API (zod/io-ts) sebelum commit ke store.



### 5.7 Clarification API (AI Balik Bertanya)

Frontend sekarang mendukung pertanyaan klarifikasi AI (maksimal 3 checkbox suggestion) di atas composer setelah run pertama.

Endpoint integrasi backend:

- `POST /projects/:id/clarify`

Request minimum:

```json
{
  "seedText": "latest prompt",
  "latestMessageId": "m-123"
}
```

Response minimum:

```json
{
  "title": "Sekarang lo lagi di tahap mana?",
  "options": [
    "Baru ada ide, belum ada apa-apa",
    "Sudah ada konsep / wireframe",
    "Sudah ada MVP, mau scale"
  ]
}
```

Behavior FE:

1. Maksimal 3 opsi checkbox ditampilkan.
2. User boleh pilih multiple.
3. Saat klik `Run`, jawaban pilihan ikut disuntikkan ke payload prompt. Jika user tidak memilih checkbox, user bisa balas langsung dari prompt utama.
4. Jika endpoint gagal, FE fallback ke mock question set agar UX tetap berjalan.

### 5.8 UI Behavior Update (Preview, Exit, Style)

- Split panel tidak auto-open saat Enter/Run; terbuka hanya saat tombol `Preview` di navbar diklik.
- Di split panel, label `Preview` bersifat info (non-clickable).
- Aksi panel: `Refresh`, `New tab`, `ZIP`, `Exit`.
- Toggle `Style` hanya muncul sebelum run pertama di tiap project (`hasRunOnce=false`), lalu disembunyikan permanen setelah run pertama project tersebut.

### 5.9 Runtime URL Resolution + Iframe Contract

Agar localhost/host dinamis dan integrasi BE konsisten, FE memakai resolver runtime:

- esolveApiBaseUrl() (src/services/runtimeConfig.js):
  - pakai VITE_API_BASE_URL jika diset,
  - fallback ke http://localhost:8000 saat app berjalan di host lokal,
  - fallback ke /api untuk deployment (reverse proxy).
- esolvePreviewUrl(rawUrl):
  - menerima URL absolut dari BE,
  - juga menerima URL relatif dari BE (di-resolve terhadap VITE_PREVIEW_BASE_URL atau API base).
- esolvePreviewLabel(previewUrl):
  - label host split panel diambil dari preview URL aktual,
  - fallback ke window.location.host jika preview belum tersedia.

Kontrak iframe preview:

- Komponen: src/components/split-panel/PreviewTab.jsx.
- iframe memakai sandbox="allow-scripts allow-same-origin".
- Tombol Refresh melakukan remount iframe via previewFrameVersion di store (reload nyata, bukan hanya update status).

### 7.5 Kesiapan 500 Concurrent Users (FE Perspective)

- FE bersifat stateless-per-browser; beban 500 user terutama ada di BE (stream endpoint, polling status, preview host).
- FE request pattern per sesi aktif:
  - 1 stream request (POST /projects/:id/messages),
  - polling status periodik (GET /projects/:id/status, interval 1400ms saat generating),
  - 1 fetch preview (GET /projects/:id/preview) saat completed.
- Rekomendasi BE agar stabil di 500 user:
  - rate-limit per token/IP + queue job generation,
  - gunakan SSE/WebSocket status untuk menurunkan pressure polling,
  - cache metadata preview + static assets,
  - observability wajib (equest-id, latency, error-rate, stream-close reason).

Catatan validasi saat ini:

- FE lulus lint, uild, dan 
pm audit --omit=dev.
- Uji load 500 user end-to-end perlu dilakukan di environment BE (k6/Gatling/Locust), karena FE lokal tidak merepresentasikan bottleneck server.

## 11. Deep E2E Health Check (Latest Scan)

Scan date: 2026-06-24 (local)

### 11.1 Commands Executed

- `npm run lint` -> pass
- `npm run build` -> pass
- `npm audit --omit=dev` -> pass (`0 vulnerabilities`)
- Dev server route smoke check:
  - `/` -> 200
  - `/login` -> 200
  - `/register` -> 200
  - `/dashboard` -> 200
  - `/feature-index.html` -> 200

### 11.2 Network/Backend Reachability During Scan

- `http://127.0.0.1:8000/auth/login` -> unavailable
- `http://127.0.0.1:8000/projects` -> unavailable
- `http://127.0.0.1:8000/projects/p0/status` -> unavailable

Kesimpulan: FE healthy dan fallback mock berjalan. Verifikasi integrasi BE real tetap perlu environment BE aktif.

### 11.3 Security Notes (Current FE)

- Token dikirim via header `Authorization: Bearer <token>` dari store persist.
- `window.open` sudah memakai `noopener,noreferrer`.
- iframe preview memakai `sandbox="allow-scripts allow-same-origin"`.
- Dependency audit bersih (`0 vulnerabilities`).

Residual risk yang perlu di-hardening saat production BE live:

- Token storage masih `localStorage` (rentan XSS dibanding HttpOnly cookie).
- Belum ada CSRF strategy khusus (karena saat ini auth token header, mock flow).
- Belum ada schema validation runtime untuk seluruh response API (disarankan Zod/io-ts).

### 11.4 Scalability Notes (500 Concurrent Users)

FE side:

- Tidak ada shared in-memory antar user di FE; state per browser session.
- Beban simultan 500 user terutama akan terjadi di endpoint BE: streaming chat, polling status, preview retrieval.

BE recommendations agar sustain 500 user:

1. Queue job generation (`/generate` dan proses agent) + worker autoscaling.
2. Ganti polling status intensif ke push model (SSE/WebSocket) bila memungkinkan.
3. Tambah rate limit + circuit breaker per endpoint streaming.
4. Tambah observability: trace id, P95/P99 latency, stream disconnect reason.

## 12. Complete Feature + API Documentation Matrix

Daftar ini menyelaraskan seluruh fitur FE yang aktif dengan service/API layer agar tim BE bisa consume tanpa gap.

| FE Feature | UI/Hook Source | Service Source | Endpoint | Method | Request | Response | Fallback Behavior |
|---|---|---|---|---|---|---|---|
| Login mock / future real auth | `pages/LoginPage.jsx`, `stores/useAuthStore.js` | `services/api.js` (`authAPI.login`) | `/auth/login` | `POST` | `{ email, password }` | `{ token, user }` | Saat ini login bisa mock (`admin/admin` atau password `bsi123`) |
| Stream prompt ke agent | `hooks/useStream.js`, `components/chat/ChatInput.jsx` | `services/streamChat.js` | `/projects/:id/messages` | `POST` (stream) | `{ content }` | SSE lines `data: {...}` + `[DONE]` | Jika stream gagal -> `simulateStream` lokal |
| Polling progress generate | `hooks/usePoller.js` | `services/pollStatus.js`, `services/api.js` | `/projects/:id/status` | `GET` | - | `{ status, progress }` | Jika backend status gagal -> mock status path local |
| Ambil preview final | `hooks/usePoller.js`, `components/split-panel/PreviewTab.jsx` | `services/api.js` (`projectsAPI.preview`) | `/projects/:id/preview` | `GET` | - | `{ url, files[] }` | Jika gagal -> `getMockPreview()` |
| Refresh preview iframe | `components/split-panel/SplitPanel.jsx` | store action (`bumpPreviewFrameVersion`) | - | - | - | iframe remount | Reload local iframe tanpa call API baru |
| ZIP generated code | `components/split-panel/SplitPanel.jsx` | JSZip client-side | - | - | `codeFiles[]` dari store | file `.zip` download | Jika kosong -> `README.txt` placeholder |
| Clarification question set | `components/chat/ChatInput.jsx` | `services/aiQuestions.js` | `/projects/:id/clarify` | `POST` | `{ seedText, latestMessageId }` | `{ title, options[] }` | Jika gagal -> mock pertanyaan lokal (maks 3 opsi) |
| Follow-up question service (prepared) | (belum dipakai aktif di UI) | `services/followupQuestions.js` + `services/api.js` | `/projects/:id/followup-questions` | `POST` | `{ prompt }` | `{ question, options[] }` | fallback lokal berdasarkan domain prompt |
| List/Create/Get/Edit/Versions project | sidebar/topbar flows | `services/api.js` (`projectsAPI`) | `/projects`, `/projects/:id`, `/projects/:id/edits`, `/projects/:id/versions` | `GET/POST` | sesuai endpoint | object/list project/version | sebagian UI masih store-first (mock-safe) |

## 13. Service Inventory (Source of Truth)

Semua file service yang aktif/tersedia:

- `src/services/api.js`
- `src/services/streamChat.js`
- `src/services/pollStatus.js`
- `src/services/aiQuestions.js`
- `src/services/followupQuestions.js`
- `src/services/runtimeConfig.js`

Runtime config detail:

- `VITE_API_BASE_URL`: base API utama.
- `VITE_PREVIEW_BASE_URL`: base resolver untuk preview URL relatif.
- Fallback API runtime:
  1. env `VITE_API_BASE_URL` jika ada,
  2. `http://localhost:8000` bila FE running di host lokal,
  3. `/api` untuk deployment reverse proxy.

## 14. Button Function Coverage (Runtime)

Ringkas fungsi tombol utama yang aktif saat scan:

- Sidebar collapsed: `Hide`, `New`, `Star`.
- Topbar dashboard: `Preview`, `Req Deploy` (UI trigger), `Theme toggle`.
- Split panel: `Refresh`, `New tab`, `ZIP`, `Exit`.
- Composer: `Attach`, `Style` (hanya first run), `Run`.
- Clarification card: `3 checkbox options` + `Exit (X)`.

Semua tombol di atas tervalidasi pada compile/lint dan tidak ditemukan crash path statik pada scan kode.
