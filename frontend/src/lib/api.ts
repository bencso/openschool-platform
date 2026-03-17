const API_BASE = '';

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const headers = { ...options.headers };

  let res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'same-origin',
  });

  if (res.status === 401) {
    const refreshRes = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'same-origin',
    });

    if (refreshRes.ok) {
      res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
        credentials: 'same-origin',
      });
    } else {
      window.location.href = '/login';
    }
  }

  return res;
}
