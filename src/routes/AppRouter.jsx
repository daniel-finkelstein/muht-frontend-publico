import { Routes, Route, Navigate } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AuthCallbackPage from "../pages/AuthCallbackPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";

import DashboardPage from "../pages/doctor/DashboardPage";
import PatientsPage from "../pages/doctor/PatientsPage";
import StatsPage from "../pages/doctor/StatsPage";
import CalendarPage from "../pages/doctor/calendar/CalendarPage";
import MessagesPage from "../pages/doctor/messages/MessagesPage";
import PatientProfilePage from "../pages/Patient/PatientProfilePage";
import DoctorProfilePage from "../pages/doctor/DoctorProfilePage";
import NotificationsPage from "../pages/doctor/NotificationsPage";
import EducationPage from "../pages/doctor/EducationPage";
import DocumentsPage from "../pages/doctor/DocumentsPage";

import SurgeryPage from "../pages/SurgeryPage";
import InviteProfessionalPage from "../pages/InviteProfessionalPage";

import PatientDashboardPage from "../pages/Patient/PatientDashboardPage";
import PatientStatsPage from "../pages/Patient/PatientStatsPage";

import ProtectedRoute from "../components/ProtectedRoute";
import { useUser } from "../services/UserContext";

function RoleRedirect() {
  const { userProfile, loading } = useUser();

  if (loading) return <p>Cargando...</p>;

  const role = userProfile?.role;

  if (role === "patient") {
    return <Navigate to="/dashboard" replace />;
  }

  if (role === "professional") {
    return <Navigate to="/pacientes" replace />;
  }

  if (role === "superadmin") {
    return <Navigate to="/admin/invitar-profesional" replace />;
  }

  return <Navigate to="/login" replace />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<RoleRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route
        element={
          <ProtectedRoute allowedRoles={["patient", "professional", "superadmin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientDashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute allowedRoles={["professional", "superadmin"]}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/estadisticas"
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <PatientStatsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/estadisticas"
          element={
            <ProtectedRoute allowedRoles={["professional", "superadmin"]}>
              <StatsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notificaciones"
          element={
            <ProtectedRoute allowedRoles={["patient", "professional", "superadmin"]}>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mensajes"
          element={
            <ProtectedRoute allowedRoles={["patient", "professional", "superadmin"]}>
              <MessagesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/calendario"
          element={
            <ProtectedRoute allowedRoles={["patient", "professional", "superadmin"]}>
              <CalendarPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/contenido-educativo"
          element={
            <ProtectedRoute allowedRoles={["patient", "professional", "superadmin"]}>
              <EducationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/documentos"
          element={
            <ProtectedRoute allowedRoles={["patient", "professional", "superadmin"]}>
              <DocumentsPage />
            </ProtectedRoute>
          }
        />

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
          path="/doctor/perfil"
          element={
            <ProtectedRoute allowedRoles={["professional", "superadmin"]}>
              <DoctorProfilePage />
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

        <Route
          path="/admin/invitar-profesional"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <InviteProfessionalPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}