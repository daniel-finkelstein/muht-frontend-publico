const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { apiRequest } from "./apiClient";

export async function inviteProfessional(token, payload) {
  const response = await fetch(`${API_BASE_URL}/api/professional/invite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error || "No se pudo invitar al profesional");
    error.status = response.status;
    throw error;
  }

  return data;
}

export function getProfessionalById(token, professionalId) {
  return apiRequest(`/api/professional/${professionalId}`, {
    method: "GET",
    token,
  });
}

export async function syncUser(token) {
  return apiRequest("/api/auth/sync", {
    method: "POST",
    token,
  });
}