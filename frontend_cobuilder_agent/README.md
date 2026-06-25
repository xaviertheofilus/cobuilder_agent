# BSI CoBuilder Agent FE

Frontend React + Vite untuk alur: login -> chat prompt -> pilih style -> generate -> preview.

## 1) Quick Run

### Local
```bash
cd frontend_cobuilder_agent
npm install
npm run dev
```
App: `http://localhost:5173`

### Build Check
```bash
npm run lint
npm run build
```

## 2) Docker Run

```bash
docker compose up --build -d
```
App: `http://localhost:5173`

Stop:
```bash
docker compose down
```

## 3) Environment

Buat file `.env` dari `.env.example`.

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_PREVIEW_BASE_URL=http://localhost:8000
```

Resolver runtime (`src/services/runtimeConfig.js`):
- pakai `VITE_API_BASE_URL` jika ada,
- fallback localhost: `http://localhost:8000`,
- fallback deploy: `/api`.

## 4) Arsitektur Singkat

- UI/Router: React + React Router.
- State: Zustand (`useAuthStore`, `useProjectStore`).
- REST API: Axios (`src/services/api.js`).
- Streaming chat: Fetch stream (`src/services/streamChat.js`).
- Style mapper: `src/services/styleConfig.js` (pilihan style -> JSON `styleConfig` untuk BE).

## 5) API Services (FE -> BE)

Semua endpoint memakai base URL dari `runtimeConfig`.

| Service | Method | Endpoint | Payload utama |
|---|---|---|---|
| Auth login | POST | `/auth/login` | `{ email, password }` |
| List projects | GET | `/projects` | - |
| Create project | POST | `/projects` | `{ name }` |
| Get project | GET | `/projects/:id` | - |
| Generate app | POST | `/projects/:id/generate` | `{ prompt, styleConfig, attachments }` |
| Poll status | GET | `/projects/:id/status` | - |
| Get preview | GET | `/projects/:id/preview` | - |
| Edit prompt | POST | `/projects/:id/edits` | `{ instruction }` |
| Versions | GET | `/projects/:id/versions` | - |
| Clarify questions | POST | `/projects/:id/clarify` | `{ seedText, latestMessageId }` |
| Followup questions | POST | `/projects/:id/followup-questions` | `{ prompt }` |
| Chat streaming | POST | `/projects/:id/messages` | `{ content, styleConfig, attachments }` |

Header protected endpoint:
```http
Authorization: Bearer <token>
Content-Type: application/json
```

## 6) Style Picker -> JSON ke BE

Saat user pilih Palette + Typography + Layout, FE membentuk payload terstruktur dan mengirim ke BE saat klik `Run`.

Schema target:

```json
{
  "styleConfig": {
    "colorPalette": {
      "primary": {},
      "secondary": {},
      "background": {},
      "surface": {},
      "accent": {},
      "textPrimary": {},
      "textSecondary": {},
      "border": {}
    },
    "typography": {
      "fontFamily": {},
      "fontSizeBase": {},
      "fontWeightNormal": {},
      "fontWeightBold": {},
      "lineHeight": {},
      "letterSpacing": {}
    },
    "layout": {
      "type": {},
      "sidebarWidth": {},
      "sidebarPosition": {},
      "navHeight": {},
      "contentMaxWidth": {},
      "borderRadius": {},
      "spacing": {}
    },
    "meta": {
      "darkMode": {},
      "animationsEnabled": {},
      "version": {}
    }
  }
}
```

Contoh output aktual (pilihan: `dark_pro + geist + top_nav`):

```json
{
  "styleConfig": {
    "colorPalette": {
      "primary": "#0F172A",
      "secondary": "#1E293B",
      "background": "#020617",
      "surface": "#0F172A",
      "accent": "#334155",
      "textPrimary": "#F8FAFC",
      "textSecondary": "#94A3B8",
      "border": "#1E293B"
    },
    "typography": {
      "fontFamily": "Geist, sans-serif",
      "fontSizeBase": "16px",
      "fontWeightNormal": 400,
      "fontWeightBold": 500,
      "lineHeight": 1.6,
      "letterSpacing": "0"
    },
    "layout": {
      "type": "topnav",
      "sidebarWidth": null,
      "sidebarPosition": null,
      "navHeight": "64px",
      "contentMaxWidth": "1280px",
      "borderRadius": "8px",
      "spacing": "comfortable"
    },
    "meta": {
      "darkMode": true,
      "animationsEnabled": true,
      "version": 1
    }
  }
}
```

Catatan: `styleConfig` dikirim sebagai field JSON terpisah ke BE, bukan disisipkan ke teks chat prompt.
