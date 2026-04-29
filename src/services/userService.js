const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { apiRequest } from "./apiClient";
import { getPatientProfile } from "./patientService";
import { syncUser, getProfessionalById } from "./professionalService";

export async function getUserWithRole(token) {
  try {
    const patientData = await getPatientProfile(token);
    return {
      ...patientData,
      role: "patient"
    };
  } catch (patientError) {
    try {
      const syncData = await syncUser(token);
      const professionalData = await getProfessionalById(token, syncData.id);
      return {
        ...professionalData,
        role: "professional"
      };
    } catch (professionalError) {
      console.error("El usuario no es ni paciente ni profesional registrado.");
      throw professionalError;
    }
  }
}