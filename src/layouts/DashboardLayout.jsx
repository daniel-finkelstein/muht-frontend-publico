import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import "./DashboardLayout.css";
import { patientsMock } from "../data/mock/patientsMock";
import { Bell, User } from "lucide-react";
import logo from "../assets/logo.png";
import { useUser } from "../services/UserContext";
import { LogOut } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { X, PlusCircle } from "lucide-react";
import { getPatientProfile } from "../services/patientService";
import { createWeightRecord } from "../services/weightHistoryService";
import { createPhysicalActivity } from "../services/physicalActivityService";




const doctorLinks = [
  { name: "Pacientes", path: "/pacientes", roles: ["professional", "superadmin"] },
  { name: "Invitar médico", path: "/admin/invitar-profesional", roles: [ "superadmin"] },
];

const sharedLinks = [
  { name: "Notificaciones", path: "/notificaciones", roles: ["professional", "superadmin"] },
  { name: "Mensajes", path: "/mensajes", roles: ["patient", "professional", "superadmin"] },
  { name: "Calendario", path: "/calendario", roles: ["patient", "professional", "superadmin"] },
];

const patientLinks = [
  // Paciente
  { name: "Panel Principal", path: "/dashboard", roles: ["patient"] },
  { name: "Estadísticas", path: "/estadisticas", roles: ["patient"] },

  // Médico / superadmin 
  { name: "Panel Principal", path: "/doctor/dashboard", roles: ["professional", "superadmin"] },
  { name: "Estadísticas", path: "/doctor/estadisticas", roles: ["professional", "superadmin"] },

  // Compartidos 
  { name: "Documentos", path: "/documentos", roles: ["patient", "professional", "superadmin"] },
  { name: "Contenido Educativo", path: "/contenido-educativo", roles: ["patient", "professional", "superadmin"] },
];



export default function DashboardLayout() {
  const [patientSearch, setPatientSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);

  const navigate = useNavigate();
  const { userProfile, loading } = useUser();

  const { logout } = useAuth0();

    const handleLogout = () => {
      localStorage.clear();

      logout({
        logoutParams: {
          returnTo: window.location.origin
        }
      });
    };

  if (loading) return <p>Cargando...</p>;

  const userRole = userProfile?.role;

  const canAccess = (link) => link.roles.includes(userRole);
  // console.log("USER ROLE:", userRole);

  const visibleDoctorLinks = doctorLinks.filter(canAccess);
  const visibleSharedLinks = sharedLinks.filter(canAccess);
  const visiblePatientLinks = patientLinks.filter(canAccess);

  const filteredPatients = patientSearch
    ? patientsMock.filter((patient) =>
        patient.name.toLowerCase().includes(patientSearch.toLowerCase())
      )
    : patientsMock;

  const canUsePatientSearch = ["professional", "superadmin"].includes(userRole);

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar-brand">
          <div className="dashboard-sidebar-logo">
            <img src={logo} alt="MUHT logo" />
          </div>
          <div>
            <h1 className="dashboard-sidebar-title">MUHT</h1>
            <p className="dashboard-sidebar-subtitle">
              Monitoring Your Health Treatment
            </p>
          </div>
        </div>

        {/* PANEL MÉDICO */}
        {visibleDoctorLinks.length > 0 && (
          <div className="dashboard-sidebar-section">
            <p className="dashboard-sidebar-section-title">Panel Médico</p>

            {visibleDoctorLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  isActive
                    ? "dashboard-sidebar-link active"
                    : "dashboard-sidebar-link"
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        )}

        {/* DATOS PACIENTE */}
        {visiblePatientLinks.length > 0 && (
          <div className="dashboard-sidebar-section">
            <p className="dashboard-sidebar-section-title">Datos Paciente</p>

            {visiblePatientLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  isActive
                    ? "dashboard-sidebar-link active"
                    : "dashboard-sidebar-link"
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        )}

        {/* COMUNICACIÓN (COMPARTIDO) */}
        {visibleSharedLinks.length > 0 && (
          <div className="dashboard-sidebar-section">
            <p className="dashboard-sidebar-section-title">Comunicación</p>

            {visibleSharedLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  isActive
                    ? "dashboard-sidebar-link active"
                    : "dashboard-sidebar-link"
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        )}
      </aside>

      <div className="dashboard-main-area">
        <header className="dashboard-topbar">
          <div className="dashboard-topbar-left">
            {/* SOLO MÉDICOS */}
            {canUsePatientSearch && (
              <div className="dashboard-patient-search">
                <input
                  type="text"
                  placeholder="Buscar paciente..."
                  className="dashboard-patient-search-input"
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                  onBlur={() => setTimeout(() => setIsSearchOpen(false), 150)}
                />

                {isSearchOpen && (
                  <div className="dashboard-patient-results">
                    {filteredPatients.map((patient) => (
                      <button
                        key={patient.id}
                        type="button"
                        className={`dashboard-patient-option ${patient.risk.replace(
                          " ",
                          "-"
                        )}`}
                        onClick={() => {
                          setPatientSearch(patient.name);
                          setIsSearchOpen(false);
                        }}
                      >
                        <span>{patient.name}</span>
                        <small>{patient.risk}</small>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="dashboard-topbar-actions">
            {userRole === "patient" && (
              <button
                className="dashboard-register-button"
                onClick={() => setIsQuickLogOpen(true)}
              >
                <PlusCircle size={18} />
                Registrar Datos
              </button>
            )}
            <button className="dashboard-topbar-button">
              <Bell size={20} />
            </button>

            <button
              className="dashboard-topbar-button"
              onClick={() => {
                if (userRole === "patient") {
                  navigate("/pacientes/1/perfil");
                } else {
                  navigate("/doctor/perfil");
                }
              }}
            >
              <User size={20} />
            </button>
            <button
              className="dashboard-topbar-button logout-button"
              onClick={handleLogout}
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main className="dashboard-main-content">
          <Outlet />
        </main>
      </div>
      {isQuickLogOpen && (
        <QuickLogPanel onClose={() => setIsQuickLogOpen(false)} />
      )}
    </div>
  );

function QuickLogPanel({ onClose }) {
  const { getAccessTokenSilently } = useAuth0();

  const [weight, setWeight] = useState("");
  const [activityType, setActivityType] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [durationMeters, setDurationMeters] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function getCurrentPatientId(token) {
    const profile = await getPatientProfile(token);
    return profile.id;
  }

  async function handleSaveWeight(e) {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      const token = await getAccessTokenSilently();
      const patientId = await getCurrentPatientId(token);

      await createWeightRecord(token, patientId, Number(weight));

      setWeight("");
      setMessage("Peso registrado correctamente.");
    } catch (error) {
      setMessage("No se pudo registrar el peso.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveActivity(e) {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      const token = await getAccessTokenSilently();
      const patientId = await getCurrentPatientId(token);

      await createPhysicalActivity(token, patientId, {
        type: activityType,
        duration_minutes: durationMinutes,
        duration_meters: durationMeters,
      });

      setActivityType("");
      setDurationMinutes("");
      setDurationMeters("");
      setMessage("Actividad registrada correctamente.");
    } catch (error) {
      setMessage("No se pudo registrar la actividad.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="quicklog-overlay">
      <aside className="quicklog-panel">
        <div className="quicklog-header">
          <div>
            <h2>Registrar Datos</h2>
            <p>Actualiza tu seguimiento diario.</p>
          </div>

          <button className="quicklog-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {message && <p className="quicklog-message">{message}</p>}

        <form className="quicklog-section" onSubmit={handleSaveWeight}>
          <h3>Peso semanal</h3>

          <label>
            Peso actual (kg)
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
          </label>

          <button type="submit" disabled={saving}>
            Guardar peso
          </button>
        </form>

        <form className="quicklog-section" onSubmit={handleSaveActivity}>
          <h3>Actividad deportiva</h3>

          <label>
            Tipo de actividad
            <input
              type="text"
              placeholder="Caminata, bicicleta..."
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              required
            />
          </label>

          <label>
            Duración (minutos)
            <input
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              required
            />
          </label>

          <label>
            Distancia (metros)
            <input
              type="number"
              value={durationMeters}
              onChange={(e) => setDurationMeters(e.target.value)}
            />
          </label>

          <button type="submit" disabled={saving}>
            Guardar actividad
          </button>
        </form>

        <div className="quicklog-section disabled">
          <h3>Vitaminas consumidas</h3>
          <p>Pendiente de endpoint backend.</p>
        </div>

        <div className="quicklog-section disabled">
          <h3>Consumo de agua</h3>
          <p>Pendiente de endpoint backend.</p>
        </div>
      </aside>
    </div>
  );
}
}