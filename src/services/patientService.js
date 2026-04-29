const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { apiRequest } from "./apiClient";

/* export async function getPatientProfile(token) {
  const response = await fetch(`${API_BASE_URL}/api/patient/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error || "Error al obtener perfil del paciente");
    error.status = response.status;
    throw error;
  }

  return data; */

export function getPatientProfile(token) {
  return apiRequest("/api/patient/profile", {
    method: "GET",
    token,
  });
}