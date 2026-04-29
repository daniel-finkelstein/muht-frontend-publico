import { apiRequest } from "./apiClient";

export function getWeightHistory(token, patientUuid) {
  return apiRequest(`/api/weight-history/${patientUuid}`, {
    method: "GET",
    token,
  });
}

export function createWeightRecord(token, patientId, weightValue) {
  return apiRequest("/api/weight-history/", {
    method: "POST",
    token,
    body: {
      patient_uuid: patientId,
      weight_value: Number(weightValue),
    },
  });
}