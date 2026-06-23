import { projectsAPI } from './api';

const mockSessions = new Map();
const statusPath = ['pending', 'generating', 'generating', 'completed'];

function buildMockData(projectId) {
  const appName = projectId === 'p1' ? 'Finance Agent' : 'CoBuilder App';
  const html = `<!doctype html><html><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><style>body{font-family:Inter,Arial,sans-serif;margin:0;background:#f8f8e8;color:#0f172a}.top{padding:16px 24px;background:#155e75;color:#fff;font-weight:700}.wrap{padding:20px}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.card{background:#fff;border:1px solid #cbd5e1;border-radius:10px;padding:14px}.table{margin-top:16px;background:#fff;border:1px solid #cbd5e1;border-radius:10px;overflow:hidden}table{width:100%;border-collapse:collapse}th,td{padding:10px;border-bottom:1px solid #e2e8f0;text-align:left}</style></head><body><div class="top">${appName}</div><div class="wrap"><div class="grid"><div class="card"><h4>Total Records</h4><div style="font-size:32px;font-weight:700">1248</div></div><div class="card"><h4>Pending</h4><div style="font-size:32px;font-weight:700">37</div></div><div class="card"><h4>Approved</h4><div style="font-size:32px;font-weight:700">1094</div></div></div><div class="table"><table><thead><tr><th>ID</th><th>Name</th><th>Type</th><th>Status</th></tr></thead><tbody><tr><td>#1042</td><td>Andi Pratama</td><td>Annual Leave</td><td>Approved</td></tr><tr><td>#1041</td><td>Siti Rahma</td><td>Expense</td><td>Pending</td></tr></tbody></table></div></div></body></html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const previewUrl = URL.createObjectURL(blob);

  return {
    previewUrl,
    files: [
      { path: 'src/App.jsx', content: `export default function App(){\n  return (\n    <main>\n      <h1>${appName}</h1>\n    </main>\n  );\n}` },
      { path: 'src/components/StatsCard.jsx', content: 'export function StatsCard(){ return <section>Stats</section>; }' },
      { path: 'src/styles/theme.css', content: ':root { --primary: #155e75; --surface: #ffffff; }' },
    ],
  };
}

export function pollStatus(projectId, onStatus, onComplete, onError) {
  const INTERVAL = 1400;
  let step = 0;
  let useMock = false;

  const timer = setInterval(async () => {
    try {
      if (!useMock) {
        const res = await projectsAPI.status(projectId);
        const { status, progress } = res.data;
        onStatus(status, progress ?? 0);
        if (status === 'completed' || status === 'failed') {
          clearInterval(timer);
          onComplete(status, res.data);
        }
        return;
      }

      const status = statusPath[Math.min(step, statusPath.length - 1)];
      const progress = Math.min(100, step * 35);
      onStatus(status, progress);
      step += 1;

      if (status === 'completed') {
        clearInterval(timer);
        const mock = buildMockData(projectId);
        mockSessions.set(projectId, mock);
        onComplete('completed', { ...mock, status: 'completed', progress: 100 });
      }
    } catch (err) {
      if (!useMock) {
        useMock = true;
        return;
      }
      clearInterval(timer);
      onError(err);
    }
  }, INTERVAL);

  return () => clearInterval(timer);
}

export function getMockPreview(projectId) {
  return mockSessions.get(projectId) || buildMockData(projectId);
}

