import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { loginUser } from "../services/authService";
import "./Auth.css";
import logo from "../assets/logo.png";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        if (!isAuthenticated) return;

        const token = await getAccessTokenSilently();

        await loginUser(token);

        navigate("/dashboard", { replace: true });
      } catch (err) {
        if (err.status === 404) {
          navigate("/register", { replace: true });
          return;
        }

        setError(err.message || "No se pudo iniciar sesión.");
      }
    };

    if (!isLoading) {
      run();
    }
  }, [isLoading, isAuthenticated, getAccessTokenSilently, navigate]);

  return (
    <div className="form-page">
      <div className="form-container form-container-small">
        <div className="form-card">
          <div className="form-header">
            <div className="form-logo">
              <img src={logo} alt="MUHT logo" />
            </div>
            <h1 className="form-title">Ingresando...</h1>
            <p className="form-subtitle">Estamos validando tu cuenta</p>
          </div>

          {error && <p className="form-error">{error}</p>}
        </div>
      </div>
    </div>
  );
}