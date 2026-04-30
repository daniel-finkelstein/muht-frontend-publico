import { useAuth0 } from "@auth0/auth0-react";
import "./Auth.css";

export default function LoginPage() {
  const { loginWithRedirect, isLoading } = useAuth0();

  return (
    <div className="form-page">
      <div className="form-container form-container-small">
        <div className="form-card">
          <div className="form-header">
            <div className="form-logo">Logo app</div>
            <h1 className="form-title">Iniciar sesión</h1>
            <p className="form-subtitle">Bienvenido a MUHT</p>
          </div>

          <div className="form-body">
            <button
              type="button"
              className="form-button"
              onClick={() => loginWithRedirect()}
              disabled={isLoading}
            >
              {isLoading ? "Cargando..." : "Iniciar sesión"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}