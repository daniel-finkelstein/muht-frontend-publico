// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth0 } from "@auth0/auth0-react";
// import "./Auth.css";

// export default function AuthCallbackPage() {
//   const navigate = useNavigate();
//   const { isLoading, isAuthenticated } = useAuth0();

//   useEffect(() => {
//     if (!isLoading && isAuthenticated) {
//       navigate("/dashboard", { replace: true });
//     }
//   }, [isLoading, isAuthenticated, navigate]);

//   return (
//     <div className="form-page">
//       <div className="form-container form-container-small">
//         <div className="form-card">
//           <div className="form-header">
//             <div className="form-logo">Logo app</div>
//             <h1 className="form-title">Ingresando...</h1>
//             <p className="form-subtitle">Redirigiendo...</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// LO DE ARRIBA ES POR MIENTRAS PARA LA SEMANA 3.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { syncUser } from "../services/authService";
import "./Auth.css";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [error, setError] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        if (!isAuthenticated) return;

        const token = await getAccessTokenSilently();

        await syncUser(token, {});
        navigate("/dashboard", { replace: true });
      } catch (err) {
        if (err.status === 400) {
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
            <div className="form-logo">Logo app</div>
            <h1 className="form-title">Ingresando...</h1>
            <p className="form-subtitle">Estamos validando tu cuenta</p>
          </div>

          {error && <p className="form-error">{error}</p>}
        </div>
      </div>
    </div>
  );
}