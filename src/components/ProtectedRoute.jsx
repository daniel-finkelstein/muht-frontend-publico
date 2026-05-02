export default function ProtectedRoute({ allowedRoles, children }) {
  const { isAuthenticated, isLoading } = useAuth0();
  const { userProfile, loading } = useUser();

  if (isLoading || loading) {
    return <p>Cargando...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!userProfile) {
    return <Navigate to="/register" replace />;
  }

  if (!userProfile.role) {
    return <Navigate to="/register" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userProfile.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children || <Outlet />;
}