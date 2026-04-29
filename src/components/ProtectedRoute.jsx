import { Navigate, Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../services/UserContext";

// export default function ProtectedRoute({ children }) {
//   const { isAuthenticated, isLoading } = useAuth0();

//   if (isLoading) {
//     return <p style={{ padding: "24px" }}>Cargando...</p>;
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// }


export default function ProtectedRoute({ allowedRoles, children }) {
  const { isAuthenticated, isLoading } = useAuth0();
  const { userProfile, loading } = useUser();

  // Esperar a que cargue Auth0 y el perfil
  if (isLoading || loading) {
    return <p>Cargando...</p>;
  }

  // No logueado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Usuario sin rol
  if (!userProfile?.role) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Rol no permitido
  if (allowedRoles && !allowedRoles.includes(userProfile.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // OK
  return children || <Outlet />;
}