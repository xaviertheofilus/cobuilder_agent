import { aiAssistantAPI } from './api';

function normalize(data) {
  const title = data?.title || data?.question || 'Sekarang lo lagi di tahap mana?';
  const options = (data?.options || data?.choices || [])
    .map((item) => (typeof item === 'string' ? item : item?.label || item?.text || ''))
    .filter(Boolean)
    .slice(0, 3);

  return {
    title,
    options: options.length
      ? options
      : ['Baru ada ide, belum ada apa-apa', 'Sudah ada konsep / wireframe', 'Sudah ada MVP, mau scale'],
  };
}

function mockQuestions(seedText = '') {
  if (/invoice|finance|procurement/i.test(seedText)) {
    return {
      title: 'Dokumen apa yang paling sering diproses?',
      options: ['Invoice vendor', 'Purchase Order', 'Payment request'],
    };
  }

  return {
    title: 'Sekarang lo lagi di tahap mana?',
    options: ['Baru ada ide, belum ada apa-apa', 'Sudah ada konsep / wireframe', 'Sudah ada MVP, mau scale'],
  };
}

export async function fetchAiQuestions(projectId, payload = {}) {
  try {
    const res = await aiAssistantAPI.clarify(projectId, payload);
    return normalize(res.data);
  } catch {
    return mockQuestions(payload?.seedText || '');
  }
}