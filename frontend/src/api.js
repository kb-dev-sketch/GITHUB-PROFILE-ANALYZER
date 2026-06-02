const API_BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 403 && !body.message) {
      throw new Error(
        'Cannot reach the API (port 5000 is often used by macOS AirPlay). Start the backend with PORT=3001 in .env and restart the frontend.'
      );
    }
    throw new Error(body.message || `Request failed (${response.status})`);
  }

  return body;
}

export function analyzeProfile(username) {
  return request('/api/profile/analyze', {
    method: 'POST',
    body: JSON.stringify({ username }),
  });
}

export function getAllProfiles() {
  return request('/api/profile');
}

export function getProfileByUsername(username) {
  return request(`/api/profile/${encodeURIComponent(username)}`);
}

export function checkHealth() {
  return request('/health');
}
