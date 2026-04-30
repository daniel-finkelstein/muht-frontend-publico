import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { User, Phone, ArrowLeft, CreditCard, CalendarDays, Shield } from "lucide-react";
import { syncUser } from "../services/authService";
import "./Auth.css";
import logo from "../assets/logo.png";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { user, getAccessTokenSilently } = useAuth0();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: user?.name || "",
    rut: "",
    birth_date: "",
    phone_number: "",
    health_insurance: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.full_name.trim() ||
      !formData.rut.trim() ||
      !formData.birth_date.trim() ||
      !formData.phone_number.trim() ||
      !formData.health_insurance.trim()
    ) {
      setError("Por favor completa todos los campos.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = await getAccessTokenSilently();

      await syncUser(token, {
        email: user?.email,
        full_name: formData.full_name,
        rut: formData.rut,
        role: "patient",
        birth_date: formData.birth_date,
        phone_number: formData.phone_number,
        health_insurance: formData.health_insurance,
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "No se pudo completar el registro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-container form-container-big">
        <div className="form-card">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="form-back-button"
          >
            <ArrowLeft size={18} />
            <span>Volver</span>
          </button>

          <div className="form-header">
            <div className="form-logo">
              <img src={logo} alt="MUHT logo" />
            </div>
            <h1 className="form-title">Completar registro</h1>
            <p className="form-subtitle">Ingresa tus datos como paciente</p>
          </div>

          <form onSubmit={handleSubmit} className="form-body">
            <div className="form-field">
              <label htmlFor="full_name">Nombre completo</label>
              <div className="form-input-wrapper">
                <User className="form-input-icon" size={18} />
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="Juan Pérez"
                  value={formData.full_name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="rut">RUT</label>
              <div className="form-input-wrapper">
                <CreditCard className="form-input-icon" size={18} />
                <input
                  id="rut"
                  name="rut"
                  type="text"
                  placeholder="12.345.678-9"
                  value={formData.rut}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="birth_date">Fecha de nacimiento</label>
              <div className="form-input-wrapper">
                <CalendarDays className="form-input-icon" size={18} />
                <input
                  id="birth_date"
                  name="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="phone_number">Teléfono</label>
              <div className="form-input-wrapper">
                <Phone className="form-input-icon" size={18} />
                <input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  placeholder="+56912345678"
                  value={formData.phone_number}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="health_insurance">Previsión</label>
              <div className="form-input-wrapper">
                <Shield className="form-input-icon" size={18} />
                <select
                  id="health_insurance"
                  name="health_insurance"
                  value={formData.health_insurance}
                  onChange={handleChange}
                >
                  <option value="">Selecciona una previsión</option>
                  <option value="Fonasa">Fonasa</option>
                  <option value="Isapre">Isapre</option>
                  <option value="Particular">Particular</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            {error && <p className="form-error">{error}</p>}

            <button type="submit" className="form-button" disabled={loading}>
              {loading ? "Guardando..." : "Completar registro"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}