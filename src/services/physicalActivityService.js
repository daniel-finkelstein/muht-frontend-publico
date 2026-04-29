import { apiRequest } from "./apiClient";

export function getPhysicalActivities(token, patientUuid) {
  return apiRequest(`/api/physical-activity/${patientUuid}`, {
    method: "GET",
    token,
  });
}

export function createPhysicalActivity(token, patientUuid, activity) {
  return apiRequest("/api/physical-activity/", {
    method: "POST",
    token,
    body: {
      patient_uuid: patientUuid,
      type: activity.type,
      duration_minutes: Number(activity.duration_minutes),
      duration_meters: Number(activity.duration_meters || 0),
    },
  });
}