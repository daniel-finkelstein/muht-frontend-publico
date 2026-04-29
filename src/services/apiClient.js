const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiRequest(path, options = {}) {
  const { token, body, ...customOptions } = options;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customOptions.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...customOptions,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = new Error("Error en la petición");
    error.status = response.status;
    throw error;
  }

  return response.json();
}