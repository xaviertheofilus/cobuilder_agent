# CoBuilder Agent BSI — Codex Prompt
> Paste seluruh isi file ini ke OpenAI Codex / ChatGPT-4o with Codex.
> Codex akan scaffold full production React project siap `npm run dev`.

---

## ROLE & MISSION

You are a senior frontend engineer. Your task is to scaffold a **complete, production-scale React application** called **CoBuilder Agent BSI** from scratch. This is an AI-powered internal fullstack web app builder for BSI bank employees.

Do not generate placeholder comments or TODO stubs. Every file must be fully implemented, fully functional, and ready to run with `npm install && npm run dev`. No skipped logic, no mock shell components.

---

## OUTPUT CONTRACT

Generate every file listed in the File Tree below. For each file:
- Output the **full file path** as a comment at the top: `// src/pages/LoginPage.jsx`
- Output the **complete file content** — no truncation, no "rest of file unchanged"
- All imports must resolve — do not import something that isn't created
- All components must render without runtime errors on first load

---

## PROJECT SETUP

**Init command (already done, do NOT output this):**
```bash
npm create vite@latest cobuilder-bsi -- --template react
cd cobuilder-bsi
npm install zustand react-router-dom axios react-icons highlight.js
```

**package.json scripts (keep default Vite scripts):**
```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

**vite.config.js — add proxy:**
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
})
```

**.env (create this file):**
```
VITE_API_BASE_URL=http://localhost:8000
```

---

## DESIGN SYSTEM — NON-NEGOTIABLE

All visual decisions derive from these tokens. No inline hex values in JSX or component CSS — always use `var(--token-name)`.

```css
/* src/styles/tokens.css */
:root {
  /* Backgrounds */
  --bg-base: #08080E;
  --bg-surface: #11111A;
  --bg-surface-2: #0D0D15;
  --bg-overlay: rgba(8, 8, 14, 0.85);

  /* Borders */
  --border-subtle: #1A1A28;
  --border-default: #222234;
  --border-strong: #2E2E48;

  /* Accent — BSI Blue */
  --accent: #2563EB;
  --accent-hover: #1D4ED8;
  --accent-soft: rgba(37, 99, 235, 0.10);
  --accent-soft-hover: rgba(37, 99, 235, 0.18);

  /* Semantic */
  --success: #10B981;
  --warning: #F59E0B;
  --error: #EF4444;

  /* Text */
  --text-1: #EEEEF5;
  --text-2: #7B7B96;
  --text-3: #3E3E58;

  /* Typography */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

  /* Radius */
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-pill: 9999px;

  /* Spacing scale (4px base) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* Motion */
  --ease-fast: 120ms ease;
  --ease-default: 200ms ease;
  --ease-slow: 350ms ease;
}
```

**Visual rules — enforce all of these:**
- Zero `box-shadow` anywhere. Use `border` + background contrast for elevation.
- Zero gradients on UI chrome. Gradients only permitted in SVG illustrations.
- All colors from CSS variables.
- All icons from `react-icons/fi` (Feather) as default. `react-icons/hi2` for emphasis icons only.
- Borders: always `1px solid var(--border-*)`.
- Active/selected state: `border-left: 2px solid var(--accent)` + `background: var(--accent-soft)`.
- Transitions: hover states `var(--ease-fast)`, panel animations `var(--ease-default)`.
- No `!important` anywhere.
- No hardcoded pixel values for colors.
- Inputs are always controlled components.
- No HTML `<form>` elements — use `<div>` with `onClick` handlers.

---

## FILE TREE — GENERATE ALL OF THESE

```
cobuilder-bsi/
├── index.html
├── vite.config.js
├── .env
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   │
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── reset.css
│   │   └── global.css
│   │
│   ├── data/
│   │   └── styles.json
│   │
│   ├── stores/
│   │   ├── useAuthStore.js
│   │   └── useProjectStore.js
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── streamChat.js
│   │   └── pollStatus.js
│   │
│   ├── hooks/
│   │   ├── useStream.js
│   │   └── usePoller.js
│   │
│   ├── utils/
│   │   └── cn.js
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.module.css
│   │   │   ├── Input.jsx
│   │   │   ├── Input.module.css
│   │   │   ├── Badge.jsx
│   │   │   ├── Badge.module.css
│   │   │   ├── Spinner.jsx
│   │   │   └── Spinner.module.css
│   │   │
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Sidebar.module.css
│   │   │   ├── TopBar.jsx
│   │   │   └── TopBar.module.css
│   │   │
│   │   ├── chat/
│   │   │   ├── ChatArea.jsx
│   │   │   ├── ChatArea.module.css
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── MessageBubble.module.css
│   │   │   ├── StreamingMessage.jsx
│   │   │   ├── StreamingMessage.module.css
│   │   │   ├── ChatInput.jsx
│   │   │   ├── ChatInput.module.css
│   │   │   ├── GeneratingStatus.jsx
│   │   │   └── GeneratingStatus.module.css
│   │   │
│   │   ├── style-picker/
│   │   │   ├── StylePickerMessage.jsx
│   │   │   └── StylePickerMessage.module.css
│   │   │
│   │   └── split-panel/
│   │       ├── SplitPanel.jsx
│   │       ├── SplitPanel.module.css
│   │       ├── PreviewTab.jsx
│   │       ├── PreviewTab.module.css
│   │       ├── CodeTab.jsx
│   │       ├── CodeTab.module.css
│   │       ├── FileTree.jsx
│   │       └── FileTree.module.css
│   │
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── LandingPage.module.css
│   │   ├── LoginPage.jsx
│   │   ├── LoginPage.module.css
│   │   ├── RegisterPage.jsx
│   │   ├── RegisterPage.module.css
│   │   ├── DashboardPage.jsx
│   │   └── DashboardPage.module.css
│   │
│   └── router/
│       ├── AppRouter.jsx
│       └── ProtectedRoute.jsx
```

---

## DETAILED SPEC PER FILE

### `src/main.jsx`
Entry point. Import `tokens.css`, `reset.css`, `global.css`. Wrap App in `BrowserRouter`.

---

### `src/styles/reset.css`
Modern CSS reset. Box-sizing border-box on `*`. Zero margin/padding on body. `html, body { height: 100%; }`. `#root { height: 100%; }`.

### `src/styles/global.css`
Import tokens.css. Set body: `background: var(--bg-base); color: var(--text-1); font-family: var(--font-sans); font-size: 14px; line-height: 1.5; -webkit-font-smoothing: antialiased;`. Import Inter from Google Fonts via `@import url(...)`. Import JetBrains Mono. Scrollbar styling: thin, dark track, subtle thumb.

---

### `src/data/styles.json`
```json
{
  "palettes": [
    { "id": "bsi-blue", "name": "BSI Blue", "colors": ["#1E40AF", "#3B82F6", "#EFF6FF"] },
    { "id": "slate-modern", "name": "Slate Modern", "colors": ["#1E293B", "#64748B", "#F8FAFC"] },
    { "id": "forest-clean", "name": "Forest Clean", "colors": ["#14532D", "#22C55E", "#F0FDF4"] },
    { "id": "warm-neutral", "name": "Warm Neutral", "colors": ["#7C2D12", "#F97316", "#FFF7ED"] },
    { "id": "dark-pro", "name": "Dark Pro", "colors": ["#09090B", "#52525B", "#FAFAFA"] }
  ],
  "fonts": [
    { "id": "inter", "name": "Inter", "label": "Modern" },
    { "id": "geist", "name": "Geist", "label": "Clean" },
    { "id": "dm-sans", "name": "DM Sans", "label": "Friendly" }
  ],
  "layouts": [
    { "id": "sidebar-nav", "name": "Sidebar Nav", "description": "Fixed left sidebar" },
    { "id": "top-nav", "name": "Top Nav", "description": "Full-width top bar" },
    { "id": "minimal", "name": "Minimal", "description": "No persistent nav" }
  ]
}
```

---

### `src/utils/cn.js`
```js
// Lightweight classnames utility
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
```

---

### `src/stores/useAuthStore.js`

Zustand store. State: `token: null, user: null`. Actions:

`login(email, password)` — if password === 'bsi123', set `token: 'dummy-token-bsi'`, set `user: { name: email.split('@')[0], email }`, return `{ ok: true }`. Else return `{ ok: false, error: 'Invalid credentials' }`.

`logout()` — clear token and user.

Persist to `localStorage` via zustand `persist` middleware with key `'cb-auth'`.

---

### `src/stores/useProjectStore.js`

Zustand store. Full state:

```js
{
  projects: [
    { id: 'p1', name: 'HR Leave Portal', status: 'completed', lastEdited: '2025-06-20' },
    { id: 'p2', name: 'Asset Tracker', status: 'idle', lastEdited: '2025-06-18' },
    { id: 'p3', name: 'Report Generator', status: 'idle', lastEdited: '2025-06-15' },
  ],
  activeProjectId: 'p1',
  messages: {
    p1: [
      { id: 'm1', role: 'assistant', type: 'text', content: "Hi! I'm CoBuilder. What internal web app would you like to build today?" },
      { id: 'm2', role: 'user', type: 'text', content: 'I need an HR leave request portal for BSI employees.' },
      { id: 'm3', role: 'assistant', type: 'style_picker', content: 'Great choice. Before generating, choose a style for your app — or skip to use BSI defaults.' },
    ],
    p2: [
      { id: 'm4', role: 'assistant', type: 'text', content: "Hi! What would you like to build?" },
    ],
    p3: [
      { id: 'm5', role: 'assistant', type: 'text', content: "Hi! What would you like to build?" },
    ],
  },
  streamingText: '',
  isStreaming: false,
  isGenerating: false,
  generationStatus: 'idle', // 'idle' | 'pending' | 'generating' | 'completed' | 'failed'
  generationProgress: 0, // 0-100
  previewUrl: null,
  codeFiles: [], // [{ path: string, content: string }]
  activeCodeFile: null,
  isPanelOpen: false,
  activeTab: 'preview', // 'preview' | 'code'
  selectedStyle: null,
}
```

Actions:
- `createProject()` — generate new project with `id: crypto.randomUUID()`, `name: 'Untitled Project'`, `status: 'idle'`, add to `projects`, init empty messages array for it, set `activeProjectId` to new id.
- `setActiveProject(id)` — set `activeProjectId`.
- `addMessage(projectId, message)` — push to `messages[projectId]`, generate `id` if not present.
- `setStreamingText(text)` — set `streamingText`.
- `appendStreamingText(chunk)` — append chunk to `streamingText`.
- `finalizeStream()` — push `streamingText` as assistant message to active project messages, clear `streamingText`, set `isStreaming: false`.
- `setIsStreaming(val)` — set `isStreaming`.
- `setIsGenerating(val)` — set `isGenerating`.
- `setGenerationStatus(status)` — set `generationStatus`.
- `setGenerationProgress(n)` — set `generationProgress`.
- `setPreviewUrl(url)` — set `previewUrl`.
- `setCodeFiles(files)` — set `codeFiles`.
- `setActiveCodeFile(path)` — set `activeCodeFile`.
- `togglePanel()` — toggle `isPanelOpen`.
- `setActiveTab(tab)` — set `activeTab`.
- `setSelectedStyle(style)` — set `selectedStyle`.
- `getActiveMessages()` — return `messages[activeProjectId] || []`.

---

### `src/services/api.js`

```js
import axios from 'axios';

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({ baseURL: BASE });

// Attach token from localStorage on every request
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('cb-auth');
  if (raw) {
    const { state } = JSON.parse(raw);
    if (state?.token) config.headers.Authorization = `Bearer ${state.token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
};

export const projectsAPI = {
  list: () => api.get('/projects'),
  create: (data) => api.post('/projects', data),
  get: (id) => api.get(`/projects/${id}`),
  generate: (id, payload) => api.post(`/projects/${id}/generate`, payload),
  status: (id) => api.get(`/projects/${id}/status`),
  preview: (id) => api.get(`/projects/${id}/preview`),
  edit: (id, payload) => api.post(`/projects/${id}/edits`, payload),
  versions: (id) => api.get(`/projects/${id}/versions`),
};

export default api;
```

---

### `src/services/streamChat.js`

```js
// Handles SSE / chunked streaming from the chat endpoint
// Usage: streamChat(projectId, message, onChunk, onDone, onError)

export async function streamChat(projectId, message, onChunk, onDone, onError) {
  const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  const raw = localStorage.getItem('cb-auth');
  let token = '';
  if (raw) {
    try { token = JSON.parse(raw).state?.token || ''; } catch (_) {}
  }

  try {
    const res = await fetch(`${BASE}/projects/${projectId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ content: message }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    if (!res.body) throw new Error('No response body');

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      // Handle SSE format: lines starting with "data: "
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === '[DONE]') { onDone(); return; }
          try {
            const parsed = JSON.parse(data);
            onChunk(parsed.text || parsed.content || data);
          } catch (_) {
            onChunk(data);
          }
        }
      }
    }
    onDone();
  } catch (err) {
    onError(err);
  }
}
```

---

### `src/services/pollStatus.js`

```js
// Polls project generation status at interval
// Returns a stopper function: const stop = pollStatus(id, onStatus, onComplete, onError)

import { projectsAPI } from './api.js';

export function pollStatus(projectId, onStatus, onComplete, onError) {
  const INTERVAL = 1500;

  const timer = setInterval(async () => {
    try {
      const res = await projectsAPI.status(projectId);
      const { status, progress } = res.data;
      onStatus(status, progress ?? 0);
      if (status === 'completed' || status === 'failed') {
        clearInterval(timer);
        onComplete(status, res.data);
      }
    } catch (err) {
      clearInterval(timer);
      onError(err);
    }
  }, INTERVAL);

  return () => clearInterval(timer);
}
```

---

### `src/hooks/useStream.js`

Custom hook wrapping `streamChat` with Zustand store integration.

```js
import { useProjectStore } from '../stores/useProjectStore';
import { streamChat } from '../services/streamChat';

export function useStream() {
  const {
    activeProjectId,
    addMessage,
    setStreamingText,
    appendStreamingText,
    finalizeStream,
    setIsStreaming,
  } = useProjectStore();

  const send = async (text) => {
    if (!activeProjectId) return;

    addMessage(activeProjectId, { role: 'user', type: 'text', content: text });
    setIsStreaming(true);
    setStreamingText('');

    await streamChat(
      activeProjectId,
      text,
      (chunk) => appendStreamingText(chunk),
      () => finalizeStream(),
      (err) => {
        console.error('[stream error]', err);
        finalizeStream();
      }
    );
  };

  return { send };
}
```

---

### `src/hooks/usePoller.js`

```js
import { useEffect, useRef } from 'react';
import { useProjectStore } from '../stores/useProjectStore';
import { pollStatus } from '../services/pollStatus';
import { projectsAPI } from '../services/api';

export function usePoller(projectId) {
  const stopRef = useRef(null);
  const {
    isGenerating,
    setGenerationStatus,
    setGenerationProgress,
    setIsGenerating,
    setPreviewUrl,
    setCodeFiles,
  } = useProjectStore();

  useEffect(() => {
    if (!isGenerating || !projectId) return;

    stopRef.current = pollStatus(
      projectId,
      (status, progress) => {
        setGenerationStatus(status);
        setGenerationProgress(progress);
      },
      async (status, data) => {
        setIsGenerating(false);
        setGenerationStatus(status);
        if (status === 'completed') {
          try {
            const res = await projectsAPI.preview(projectId);
            setPreviewUrl(res.data.url || null);
            setCodeFiles(res.data.files || []);
          } catch (_) {}
        }
      },
      (err) => {
        console.error('[poll error]', err);
        setIsGenerating(false);
        setGenerationStatus('failed');
      }
    );

    return () => { if (stopRef.current) stopRef.current(); };
  }, [isGenerating, projectId]);
}
```

---

### `src/router/ProtectedRoute.jsx`

```jsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

export function ProtectedRoute({ children }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
```

### `src/router/AppRouter.jsx`

```jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
```

---

### `src/App.jsx`

```jsx
import { AppRouter } from './router/AppRouter';

export default function App() {
  return <AppRouter />;
}
```

---

## UI COMPONENTS

### `src/components/ui/Button.jsx`

Variants: `primary` (solid accent fill), `secondary` (transparent + border-default), `ghost` (no fill, no border, text-2 color). Sizes: `sm` (32px height, 12px font), `md` (38px height, 14px font — default), `lg` (44px height, 15px font). Props: `variant`, `size`, `loading` (shows spinner + disabled), `icon` (FI icon component, rendered left of children), `fullWidth`, plus all native button props. When `loading`, show `<Spinner size="sm" />` inside. Never use `<form>` — this is a `<button>` element only.

### `src/components/ui/Input.jsx`

Props: `label`, `error`, `hint`, `icon` (FI icon, left side), `rightElement` (JSX, right side — for show/hide toggle). Renders: outer wrapper div > label (if provided) > input wrapper div (relative, has icon if provided) > native `<input>`. Focus ring: `border-color: var(--accent)`. Error state: `border-color: var(--error)`. Label: 12px, text-2, margin-bottom 6px. Error message: 11px, error color, margin-top 4px.

### `src/components/ui/Badge.jsx`

Small pill. Variants: `default` (bg-surface-2, border-subtle, text-2), `accent` (accent-soft bg, accent text), `success` (success color tint). Size: 11px font, 4px 8px padding, radius-pill.

### `src/components/ui/Spinner.jsx`

Pure CSS spinner. Sizes: `sm` (16px), `md` (24px), `lg` (32px). Color: `var(--accent)`. No external dependency.

---

## LAYOUT COMPONENTS

### `src/components/layout/Sidebar.jsx` + `.module.css`

Fixed left sidebar, 240px wide. Dark surface (`var(--bg-surface)`), right border `var(--border-subtle)`.

Structure (top to bottom):
1. **Header** (56px) — Logo text "CoBuilder" (weight 600, text-1) + "BSI" (accent color). Below: "New Project" button (`variant="primary"`, `size="sm"`, full width, `FiPlus` icon) — calls `createProject()` then `navigate('/dashboard')`.
2. **Projects section** — label "PROJECTS" (10px, letter-spacing 0.1em, text-3, uppercase). List of project items. Each item: clickable div, 36px height, padding 0 12px, flex row, project name (14px, text-1, truncated) + date (11px, text-3). Active: `border-left: 2px solid var(--accent)`, `background: var(--accent-soft)`, name color text-1. Hover (non-active): bg slightly lighter. On click: `setActiveProject(id)`.
3. **Bottom** — user info: FI user circle icon + name (14px) + email (11px, text-3). Logout button: `FiLogOut` icon, ghost, calls `logout()` + `navigate('/login')`.

### `src/components/layout/TopBar.jsx` + `.module.css`

48px height. Left: active project name (15px, weight 600). Right: two icon-text buttons — "Code" (`FiCode`, ghost) + "Preview" (`FiEye`, ghost if panel closed, `variant="primary" size="sm"` if panel open). Both toggle the split panel, `setActiveTab` accordingly. Border bottom `var(--border-subtle)`.

---

## CHAT COMPONENTS

### `src/components/chat/ChatArea.jsx` + `.module.css`

Main scrollable message area. Flex column, takes remaining height between TopBar and ChatInput. `overflow-y: auto`. Renders `messages[activeProjectId]` array. For each message:
- `type === 'text'` → `<MessageBubble>`
- `type === 'style_picker'` → `<StylePickerMessage>`
- `type === 'generating'` → `<GeneratingStatus>`

After all messages, if `isStreaming` and `streamingText`, render `<StreamingMessage text={streamingText} />`.

Empty state (no messages): centered, `FiZap` icon (32px, accent), heading "What would you like to build?", subtitle "Describe your app in natural language. The agent will ask follow-up questions." — all in text-2.

Auto-scroll to bottom when messages change: `useEffect` on messages length + streaming text, `ref.scrollIntoView({ behavior: 'smooth' })`.

### `src/components/chat/MessageBubble.jsx` + `.module.css`

Props: `message: { role, content, type }`.

**Assistant bubble**: left-aligned. Avatar: 28px circle, bg accent, text white, "CB" (10px mono). Content: surface card, border-subtle, radius-md, padding 12px 14px, max-width 72%, font-size 14px, line-height 1.6. Text-1 color.

**User bubble**: right-aligned. No avatar. Bg `rgba(37, 99, 235, 0.15)`, border `var(--border-strong)`, same radius + padding. Text-1.

Both: date/time below in 11px text-3.

### `src/components/chat/StreamingMessage.jsx` + `.module.css`

Same as assistant bubble but no avatar, shows `text` prop. Append a blinking cursor `|` via CSS animation (`@keyframes blink`). The cursor blinks at 1s interval.

### `src/components/chat/ChatInput.jsx` + `.module.css`

Fixed to bottom of chat area. Outer container: padding 12px 16px, border-top border-subtle, bg-base. Inner: flex row, gap 8px, align-center. 

Left: `FiPaperclip` icon button (ghost, 32px, no text) — attach file (no-op for now, just visual).

Center: `<textarea>` — auto-resize (rows start at 1, max 6 rows via JS `onInput` height adjust). Placeholder "Message CoBuilder...". Border border-subtle. Bg bg-surface-2. Focus: border-accent. Border-radius radius-md. Padding 10px 14px. Resize none. Font same as body.

Right: send button — 34px circle, bg accent, `FiArrowUp` icon (white, 16px). Disabled + opacity 0.4 when `isStreaming || isGenerating || !inputValue.trim()`. `onClick`: call `send(inputValue)`, clear input.

Submit also on `Enter` (not Shift+Enter which adds newline).

### `src/components/chat/GeneratingStatus.jsx` + `.module.css`

Shown as a message in the chat thread when `isGenerating`. Shows: animated progress bar (accent color, fills based on `generationProgress`), status text (e.g. "Analyzing requirements...", "Generating frontend...", "Building API layer...", "Finalizing..."), percentage. Background same as assistant bubble. Use `useProjectStore` to read `generationProgress` and `generationStatus`.

---

## STYLE PICKER

### `src/components/style-picker/StylePickerMessage.jsx` + `.module.css`

Rendered as a special message in chat. Card: border-default, radius-lg, padding 20px, bg-surface, max-width 520px.

Header: "Choose a style for your app" (15px, weight 600) + skip link (12px, accent, right-aligned) — skip calls `setSelectedStyle(null)` and adds a user message "I'll use the default style.".

**Section: Color Palette** — label "COLOR PALETTE" (10px uppercase letter-spacing). Row of 5 swatch cards (flex, gap 8px). Each: 72px × 44px, rounded rect, shows 3 color strips side by side (equal width). Name below (11px, text-2). Selected: 2px solid accent border + `FiCheck` overlay top-right (10px, accent). Click: set `selectedPalette`.

**Section: Font Style** — label "FONT STYLE". Row of 3 cards (flex). Each: 120px, shows large "Aa" (24px, font name style) + font label below (11px). Same selected state.

**Section: Layout** — label "LAYOUT". Row of 3 cards. Each shows an SVG wireframe thumbnail (draw simple abstract rectangles representing sidebar-nav / top-nav / minimal layout). Name below. Same selected state.

**Footer**: "Confirm Style" button (primary, full width, 40px) — calls `setSelectedStyle({ palette, font, layout })`, adds user message with style choice formatted as text, closes/removes the style picker from chat.

---

## SPLIT PANEL

### `src/components/split-panel/SplitPanel.jsx` + `.module.css`

Container: position fixed right, top 0, width 50%, height 100vh. Slides in from right via `transform: translateX(100%)` → `translateX(0)` when `isPanelOpen`. Transition `var(--ease-default)`. Bg bg-surface. Border-left border-subtle. Z-index above normal content.

Tab bar (48px): left side — "Preview" tab + "Code" tab. Tab style: padding 0 16px, height 48px, font-size 13px, font-weight 500. Active tab: text-1, border-bottom 2px solid accent. Inactive: text-2, no border. Right side icons: `FiExternalLink`, `FiCopy`, `FiDownload` — all ghost icon buttons, 32px.

Below tab bar: renders `<PreviewTab />` or `<CodeTab />` based on `activeTab`. Both take remaining height with `overflow: hidden`.

### `src/components/split-panel/PreviewTab.jsx` + `.module.css`

Full height. Top: mock browser bar (36px, bg bg-base, border-bottom border-subtle): traffic light circles (`#FF5F57`, `#FFBD2E`, `#28C841`, each 10px, radius-pill, gap 6px) + URL text "localhost:3000" (11px mono, text-3, centered flex). Below: `<iframe>` taking remaining height (100%), `src={previewUrl}`, frameBorder="0", no scrollbar by default, `sandbox="allow-scripts allow-same-origin"`. If `!previewUrl && !isGenerating`: empty state (FiMonitor icon, "No preview yet", "Generate an app to see it here."). If `isGenerating`: centered spinner + "Generating your app...".

### `src/components/split-panel/FileTree.jsx` + `.module.css`

220px wide, full height, border-right border-subtle, overflow-y auto. Renders `codeFiles` grouped by folder. Each folder: `FiFolderMinus` or `FiFolder` (toggle expand/collapse), folder name mono 12px text-2. Each file: `FiFile` icon, filename mono 12px. Indent: 16px per level. Active file: accent text, accent-soft bg. Click file: `setActiveCodeFile(path)`. If no files: empty state text "No files generated yet." in 12px text-3.

### `src/components/split-panel/CodeTab.jsx` + `.module.css`

Flex row, full height. Left: `<FileTree />`. Right: code display area (flex-1, overflow auto). Top of code area: active filename as tab (12px mono, text-2, border-bottom border-subtle, padding 8px 12px). Code content: bg `#06060C`, padding 16px, mono font, 13px, line-height 1.7. Syntax highlighting via `highlight.js` — import `highlight.js/styles/atom-one-dark.css` and call `hljs.highlightElement` in a `useEffect` when active file changes. Line numbers: rendered as a flex row (numbers column fixed width 40px, text-3, text-right; code column flex-1).

---

## PAGES

### `src/pages/LandingPage.jsx` + `.module.css`

**Navbar** — fixed, 64px, full width. Left: logo ("CoBuilder" weight 600 + "BSI" accent). Right: ghost "About" link + solid blue "Login" button (navigate `/login`) + ghost "Register" (navigate `/register`). Border-bottom border-subtle. Backdrop blur 8px + bg-overlay.

**Hero** — min-height 100vh, flex column center, padding-top 64px (navbar offset). Center-aligned. Elements top to bottom:
- Badge: `<Badge variant="accent">` "Internal Platform — BSI"
- H1: "Build internal apps\nwith a conversation." — 48px, weight 700, letter-spacing -0.03em, max-width 600px, center. Line break via CSS `white-space: pre-line` or `<br/>`.
- Subtitle: "Describe your app in plain language. CoBuilder generates the frontend, backend, and deploys it — no code required." — 16px, text-2, max-width 480px, center, line-height 1.7.
- CTA row: "Start Building" (primary, lg, navigate `/login`) + "See how it works" (secondary, lg, scroll to #how).
- SVG background: `position: absolute`, full section width, z-index -1. A dot-grid SVG (20px spacing, 1px dots, `var(--border-default)` color, 60% opacity).

**How It Works** (`id="how"`) — 3 columns, gap 24px, padding 80px 0. Each column: step label (mono 11px, accent, uppercase), `<FiIcon>` (24px, text-2, margin 12px 0), heading (16px, weight 600, text-1), description (14px, text-2, line-height 1.6). Steps: `FiMessageCircle` Chat / `FiCpu` Generate / `FiGlobe` Deploy.

**Footer** — 64px, border-top border-subtle. Flex space-between. Left: "© 2025 CoBuilder BSI". Right: two ghost links.

### `src/pages/LoginPage.jsx` + `.module.css`

Full viewport, flex row. **No** HTML `<form>`.

**Left panel** (480px fixed, centered vertically):
- Logo top
- "Welcome back" H1 28px weight 700
- Subtitle 14px text-2
- `<Input label="Email" type="email" icon={FiMail} />` — controlled
- `<Input label="Password" type={showPass ? 'text' : 'password'} icon={FiLock} rightElement={<button onClick={toggle}><FiEye/></button>} />` — controlled
- Error state: show error message (11px, error color) if login fails
- "Log in" button — primary, fullWidth, lg, `onClick={handleLogin}` — calls `useAuthStore.login()`, on success `navigate('/dashboard')`
- Divider: thin horizontal line + "or" text centered (text-3)
- "Continue with SSO" — secondary, fullWidth — no-op (visual only)
- "Don't have an account? Sign up" — 13px, link in accent, navigate `/register`

**Right panel** (flex-1):
- Bg bg-surface, dot-grid SVG same as landing
- Centered SVG illustration: abstract geometric shapes — overlapping rectangles and circles in shades of accent blue (`#1E3A8A`, `#2563EB`, `#93C5FD`), representing two abstracted human figures (use simple polygon shapes — not realistic) in a relaxed pose. Include a floating mock card element.
- 1px left border border-subtle divides panels

**Mobile** (<768px): hide right panel, left panel takes full width.

### `src/pages/RegisterPage.jsx` + `.module.css`

Same split layout as Login. Left panel:
- "Create your account" H1
- `<Input label="Full Name" icon={FiUser} />`
- `<Input label="Email" icon={FiMail} />`
- `<Input label="Password" icon={FiLock} rightElement={toggle} />`
- Password strength bar: 4 segments, fills left-to-right in accent as password gets stronger. Logic: 0 chars=0, 1-5=1 segment, 6-9=2, 10-13=3, 14+=4.
- "Create Account" button — primary, fullWidth, lg
- "Already have an account? Log in" — link to `/login`

Right panel: different SVG — abstract building blocks (geometric rectangles stacking upward, blues).

### `src/pages/DashboardPage.jsx` + `.module.css`

Full height, flex row, overflow hidden.

**Structure:**
```
<div class="dashboard">
  <Sidebar />
  <div class="main">
    <TopBar />
    <div class="workspace">
      <div class="chat-col">
        <ChatArea />
        <ChatInput />
      </div>
      {isPanelOpen && <SplitPanel />}
    </div>
  </div>
</div>
```

`dashboard`: flex row, height 100vh, overflow hidden.
`main`: flex-1, flex column, overflow hidden.
`workspace`: flex-1, flex row, overflow hidden.
`chat-col`: flex-1, flex column, overflow hidden. When `isPanelOpen`, width transitions to 50%.

On mount: call `usePoller(activeProjectId)`. Initialize `activeProjectId` to `'p1'` if not set.

---

## CRITICAL IMPLEMENTATION NOTES

1. **CSS Modules** — all component styles in `.module.css`. Import as `import styles from './Component.module.css'` and use `className={styles.name}`. Never use global class names except in `global.css`.

2. **No form elements** — every "form" uses `<div>` containers. Buttons are `<button type="button">`. No `onSubmit`.

3. **Controlled inputs** — every input has `value={state}` + `onChange={(e) => setState(e.target.value)}`.

4. **Icon imports** — always named imports: `import { FiArrowUp, FiEye } from 'react-icons/fi'`. Never default import.

5. **Highlight.js setup** — in `CodeTab.jsx`:
```js
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
useEffect(() => {
  document.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
}, [activeCodeFile, codeFiles]);
```

6. **Fonts** — in `global.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
```

7. **Auto-resize textarea** — in `ChatInput.jsx`:
```js
const handleInput = (e) => {
  e.target.style.height = 'auto';
  e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
};
```

8. **Panel slide animation** — in `SplitPanel.module.css`:
```css
.panel {
  transform: translateX(100%);
  transition: transform var(--ease-default);
}
.panel.open {
  transform: translateX(0);
}
```

9. **Dummy data resilience** — all Zustand selectors must handle undefined/null gracefully. `messages[projectId] ?? []`. Never access `.length` on potentially undefined.

10. **No magic strings** — statuses, tabs, variants are always referenced from constants or the store type definition. Use `'preview'` and `'code'` as string literals only in the store definition; everywhere else read from the store.

---

## DELIVERABLE

Output every file in order of the file tree. Start each file with a comment `// FILEPATH: src/path/to/File.jsx`. Generate complete, working implementations. No skipping, no TODOs, no stubs.

The final project must:
- Run with `npm install && npm run dev` with zero errors
- Show landing page at `/`
- Login with any email + password `bsi123` → redirect to `/dashboard`
- Display sidebar with 3 mock projects
- Show chat messages for active project
- Chat input sends message (triggers stream if BE is up, gracefully handles offline)
- "Preview" and "Code" buttons toggle the split panel with slide animation
- Style picker renders inline as a chat message type
- All pages fully styled with the dark design system
