const ENV_API_BASE = import.meta.env.VITE_API_BASE_URL;
const ENV_PREVIEW_BASE = import.meta.env.VITE_PREVIEW_BASE_URL;

function isLocalHost(hostname) {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

export function resolveApiBaseUrl() {
  if (ENV_API_BASE) return ENV_API_BASE;

  if (typeof window !== 'undefined' && isLocalHost(window.location.hostname)) {
    return 'http://localhost:8000';
  }

  return '/api';
}

export function resolvePreviewUrl(rawUrl) {
  if (!rawUrl) return null;

  try {
    return new URL(rawUrl).toString();
  } catch {
    const base = ENV_PREVIEW_BASE || resolveApiBaseUrl();

    try {
      return new URL(rawUrl, base).toString();
    } catch {
      return rawUrl;
    }
  }
}

export function resolvePreviewLabel(previewUrl) {
  const normalized = resolvePreviewUrl(previewUrl);

  if (normalized) {
    try {
      return new URL(normalized).host;
    } catch {
      return normalized;
    }
  }

  if (ENV_PREVIEW_BASE) {
    try {
      return new URL(ENV_PREVIEW_BASE).host;
    } catch {
      return ENV_PREVIEW_BASE;
    }
  }

  if (typeof window !== 'undefined') {
    return window.location.host;
  }

  return 'localhost';
}
