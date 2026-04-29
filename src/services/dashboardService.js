import { dashboardMock } from "../data/mock/dashboardMock";

export function getDashboardData() {
  return dashboardMock;
}

// Cuando tengamos datos reales, usar algo como:
// export async function getDashboardData() {
//   const response = await fetch("/api/dashboard");
//   return response.json();
// }