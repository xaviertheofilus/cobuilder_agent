import { projectsAPI } from './api';

function fallbackQuestions(prompt = '') {
  const normalized = prompt.toLowerCase();
  const isInvoice = normalized.includes('invoice');
  const isHr = normalized.includes('hr') || normalized.includes('recruit');

  if (isInvoice) {
    return {
      question: 'Sebelum lanjut, area mana yang mau difokuskan dulu?',
      options: [
        { id: 'scope-1', label: 'Form submit invoice + upload file' },
        { id: 'scope-2', label: 'Approval flow + mandatory comment' },
        { id: 'scope-3', label: 'Dashboard tracking + analytics' },
      ],
    };
  }

  if (isHr) {
    return {
      question: 'Bagian mana yang paling prioritas untuk versi pertama?',
      options: [
        { id: 'scope-1', label: 'Candidate profile + job posting' },
        { id: 'scope-2', label: 'Matching engine + score detail' },
        { id: 'scope-3', label: 'Recruiter dashboard + hiring status' },
      ],
    };
  }

  return {
    question: 'Sekarang kamu ada di tahap mana?',
    options: [
      { id: 'stage-1', label: 'Baru ada ide, belum ada apa-apa' },
      { id: 'stage-2', label: 'Sudah ada konsep / wireframe' },
      { id: 'stage-3', label: 'Sudah ada MVP, mau scale' },
    ],
  };
}

export async function getFollowupQuestions(projectId, prompt) {
  try {
    const res = await projectsAPI.followupQuestions(projectId, { prompt });
    const payload = res.data?.data || res.data;

    if (payload?.question && Array.isArray(payload?.options) && payload.options.length) {
      return {
        question: payload.question,
        options: payload.options.slice(0, 3),
      };
    }
  } catch {
    // Fallback to local default questions when backend endpoint is not available yet.
  }

  return fallbackQuestions(prompt);
}