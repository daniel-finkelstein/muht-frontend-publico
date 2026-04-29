import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { inviteProfessional } from "../services/professionalService";
import { Card } from "../components/shared/Card";
import "./InviteProfessionalPage.css";

export default function InviteProfessionalPage() {
  const { getAccessTokenSilently } = useAuth0();

  const [formData, setFormData] = useState({
    email: "",
    rut: "",
    full_name: "",
    specialty: "",
    professional_license: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [invitationLink, setInvitationLink] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setMessage("");
      setInvitationLink("");

      const token = await getAccessTokenSilently();

      const data = await inviteProfessional(token, formData);

      setMessage(data.message || "Profesional invitado correctamente.");
      setInvitationLink(data.invitation_link || "");
    } catch (err) {
      setError(err.message || "No se pudo enviar la invitación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="invite-page">
      <Card className="invite-card">
        <h1>Invitar profesional</h1>
        <p className="invite-subtitle">
          Crea una invitación para que un médico active su cuenta en MUHT.
        </p>

        <form className="invite-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="doctor@clinica.com"
              required
            />
          </label>

          <label>
            RUT
            <input
              name="rut"
              value={formData.rut}
              onChange={handleChange}
              placeholder="12345678-9"
              required
            />
          </label>

          <label>
            Nombre completo
            <input
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Dr. Juan Pérez"
              required
            />
          </label>

          <label>
            Especialidad
            <input
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              placeholder="Cirugía Bariátrica"
              required
            />
          </label>

          <label>
            Registro profesional
            <input
              name="professional_license"
              value={formData.professional_license}
              onChange={handleChange}
              placeholder="MED-12345"
              required
            />
          </label>

          {error && <p className="invite-error">{error}</p>}
          {message && <p className="invite-success">{message}</p>}

          {invitationLink && (
            <div className="invite-link-box">
              <p>Link de invitación:</p>
              <a href={invitationLink} target="_blank" rel="noreferrer">
                {invitationLink}
              </a>
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Invitar profesional"}
          </button>
        </form>
      </Card>
    </div>
  );
}