import { Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardPage from "../pages/doctor/DashboardPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AuthCallbackPage from "../pages/AuthCallbackPage";
import PatientsPage from "../pages/doctor/PatientsPage";
import StatsPage from "../pages/doctor/StatsPage";
import CalendarPage from "../pages/doctor/calendar/CalendarPage";
import MessagesPage from "../pages/doctor/messages/MessagesPage";
import PatientProfilePage from "../pages/Patient/PatientProfilePage";
import NotificationsPage from "../pages/doctor/NotificationsPage";
import EducationPage from "../pages/doctor/EducationPage";
import ProtectedRoute from "../components/ProtectedRoute";
import SurgeryPage from "../pages/SurgeryPage";
import InviteProfessionalPage from "../pages/InviteProfessionalPage";
import DocumentsPage from "../pages/doctor/DocumentsPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />

      <Route
        element={
          <ProtectedRoute allowedRoles={["patient", "professional", "superadmin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/notificaciones" element={<NotificationsPage />} />
        <Route path="/contenido-educativo" element={<EducationPage />} />
        <Route path="/estadisticas" element={<StatsPage />} />
        <Route path="/calendario" element={<CalendarPage />} />
        <Route path="/mensajes" element={<MessagesPage />} />
        <Route path="/documentos" element={<DocumentsPage />} />

        {/* Solo médico y superadmin */}
        <Route
          path="/pacientes"
          element={
            <ProtectedRoute allowedRoles={["professional", "superadmin"]}>
              <PatientsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pacientes/:patientId/perfil"
          element={
            <ProtectedRoute allowedRoles={["patient", "professional", "superadmin"]}>
              <PatientProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pacientes/:patientId/cirugia"
          element={
            <ProtectedRoute allowedRoles={["professional", "superadmin"]}>
              <SurgeryPage />
            </ProtectedRoute>
          }
        />

        {/* Solo superadmin */}
        <Route
          path="/admin/invitar-profesional"
          element={
            <ProtectedRoute allowedRoles={["patient", "superadmin"]}>
              <InviteProfessionalPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}