export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://kazilen-prod-899213799870.asia-south1.run.app/api/';

export async function apiFetch(url, options = {}) {
  const { headers, ...rest } = options;
  return fetch(url, {
    credentials: 'include',
    ...rest,
    headers: { ...(headers || {}) },
  });
}
