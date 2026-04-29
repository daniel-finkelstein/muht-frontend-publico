const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function requestWithToken(endpoint, token, payload) {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  if (payload) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(payload);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error || "Error en la solicitud");
    error.status = response.status;
    throw error;
  }

  return data;
}

export function loginUser(token) {
  return requestWithToken("/api/auth/login", token);
}

export function syncUser(token, payload) {
  return requestWithToken("/api/auth/sync", token, payload);
}

export function registerUser(token, payload) {
  return requestWithToken("/api/auth/register", token, payload);
}