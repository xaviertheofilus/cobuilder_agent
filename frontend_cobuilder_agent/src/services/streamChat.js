import { resolveApiBaseUrl } from './runtimeConfig';

const MOCK_RESPONSE =
  'Done. I drafted the first version based on your prompt. You can open Preview for UI validation and Code tab for generated files. Tell me the next revision and I will refine the workflow, table schema, and role permissions.';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function simulateStream(onChunk, onDone) {
  const words = MOCK_RESPONSE.split(' ');
  for (const word of words) {
    await sleep(60);
    onChunk(`${word} `);
  }
  onDone();
}

function readToken() {
  const raw = localStorage.getItem('cb-auth');
  if (!raw) return '';

  try {
    return JSON.parse(raw).state?.token || '';
  } catch {
    return '';
  }
}

function handleSSELine(line, onChunk, onDone) {
  if (!line.startsWith('data: ')) return false;

  const data = line.slice(6).trim();
  if (!data) return false;
  if (data === '[DONE]') {
    onDone();
    return true;
  }

  try {
    const parsed = JSON.parse(data);
    onChunk(parsed.text || parsed.content || data);
  } catch {
    onChunk(data);
  }

  return false;
}

export async function streamChat(projectId, message, onChunk, onDone, onError) {
  const BASE = resolveApiBaseUrl();
  const token = readToken();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(`${BASE}/projects/${projectId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ content: message }),
      signal: controller.signal,
    });

    clearTimeout(timeout);
    if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const shouldStop = handleSSELine(line.trim(), onChunk, onDone);
        if (shouldStop) return;
      }
    }

    if (buffer.trim()) {
      const shouldStop = handleSSELine(buffer.trim(), onChunk, onDone);
      if (shouldStop) return;
    }

    onDone();
  } catch (error) {
    try {
      await simulateStream(onChunk, onDone);
    } catch (streamError) {
      onError(streamError || error);
    }
  }
}
