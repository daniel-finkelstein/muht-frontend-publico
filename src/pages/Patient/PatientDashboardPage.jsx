import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import {
  CalendarDays,
  TrendingDown,
  Scale,
  Activity,
  Trophy,
  CheckCircle,
  Pill,
  Dumbbell,
  ClipboardList,
} from "lucide-react";

import "./PatientDashboard.css";

import { Card } from "../../components/shared/Card";
import { getPatientProfile } from "../../services/patientService";
import { getWeightHistory } from "../../services/weightHistoryService";
import { getPhysicalActivities } from "../../services/physicalActivityService";
import {
  getWeightStats,
  getPhysicalActivityStats,
} from "../../lib/dashboardBackendAdapters";

export default function PatientDashboardPage() {
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();

  const [patientProfile, setPatientProfile] = useState(null);
  const [weightHistory, setWeightHistory] = useState([]);
  const [physicalActivities, setPhysicalActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadPatientDashboard() {
      try {
        setLoading(true);

        const token = await getAccessTokenSilently();
        const profile = await getPatientProfile(token);

        const patientUuid = profile.profile?.id ?? profile.id;

        const [weightData, activityData] = await Promise.all([
          getWeightHistory(token, patientUuid),
          getPhysicalActivities(token, patientUuid),
        ]);

        setPatientProfile(profile);
        setWeightHistory(weightData);
        setPhysicalActivities(activityData);
      } catch (error) {
        console.error("Error cargando panel de paciente:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPatientDashboard();
  }, [getAccessTokenSilently]);

  const weightStats = useMemo(() => {
    return getWeightStats(weightHistory);
  }, [weightHistory]);

  const activityStats = useMemo(() => {
    return getPhysicalActivityStats(physicalActivities);
  }, [physicalActivities]);

  const patientName =
    patientProfile?.fullName ||
    patientProfile?.full_name ||
    patientProfile?.email ||
    "Paciente";

  return (
    <div className="patient-dashboard-page">
      <section className="patient-dashboard-header">
        <div>
          <h1>Bienvenido/a, {patientName}</h1>
          <p>Revisa tu progreso y mantén tus registros al día.</p>
        </div>
      </section>

      {loading && <p>Cargando datos...</p>}

      <section className="patient-dashboard-grid">
        <Card className="patient-progress-card">
          <div className="patient-card-header">
            <div className="patient-card-title">
              <div className="patient-icon blue">
                <TrendingDown size={22} />
              </div>
              <h2>Tu progreso</h2>
            </div>

            <button className="Button" onClick={() => navigate("/estadisticas")}>
              Ver todo
            </button>
          </div>

          <div className="patient-progress-stats">
            <div>
              <span>Peso perdido</span>
              <strong>{weightStats.totalLoss}</strong>
              <small>Según tus registros</small>
            </div>

            <div>
              <span>Peso actual</span>
              <strong>{weightStats.currentWeight}</strong>
              <small>Último registro</small>
            </div>

            <div>
              <span>Actividad</span>
              <strong>{activityStats.totalActivities}</strong>
              <small>Registros cargados</small>
            </div>
          </div>

          <div className="patient-progress-footer">
            <div>
              <span>Meta de progreso</span>
              <strong>50%</strong>
            </div>

            <div className="patient-progress-track">
              <div style={{ width: "50%" }} />
            </div>
          </div>
        </Card>

        <Card className="patient-appointment-card">
          <div className="patient-card-title">
            <div className="patient-icon purple">
              <CalendarDays size={22} />
            </div>
            <h2>Próximo control</h2>
          </div>

          <div className="patient-appointment-content">
            <strong>22 de abril, 2026</strong>
            <span>Control a 3 meses</span>

            <div className="patient-doctor-box">
              <p>Dra. María González</p>
              <small>Cirugía bariátrica</small>
            </div>

            <button>Ver detalle</button>
          </div>
        </Card>
      </section>

      <section className="patient-dashboard-grid bottom">
        <Card className="patient-checklist-card">
          <div className="patient-card-title">
            <div className="patient-icon violet">
              <ClipboardList size={22} />
            </div>
            <h2>Checklist de hoy</h2>
          </div>

          <p className="patient-muted">1 de 3 tareas completadas</p>

          <div className="patient-checklist">
            <div className="patient-task">
              <div className="patient-task-icon">
                <Scale size={20} />
              </div>
              <span>Registrar tu peso</span>
            </div>

            <div className="patient-task completed">
              <div className="patient-task-icon green">
                <Pill size={20} />
              </div>
              <span>Tomar vitaminas</span>
              <CheckCircle size={20} />
            </div>

            <div className="patient-task">
              <div className="patient-task-icon">
                <Dumbbell size={20} />
              </div>
              <span>Registrar actividad física</span>
            </div>
          </div>
        </Card>

        <div className="patient-side-stack">
          <Card className="patient-achievement-card">
            <div className="patient-card-title">
              <div className="patient-icon orange">
                <Trophy size={22} />
              </div>
            </div>

            <div className="patient-achievement-content">
              <Trophy size={52} />
              <strong>¡7 días seguidos!</strong>
              <p>Has mantenido tus registros durante una semana.</p>
            </div>
          </Card>

          <Card className="patient-quick-card">
            <h2>Accesos rápidos</h2>

            <button className="Button" onClick={() => navigate("/calendario")}>
              Ver calendario
            </button>

            <button
              className="Button"
              onClick={() => navigate("/contenido-educativo")}
            >
              Ver contenido educativo
            </button>

            <button className="Button" onClick={() => navigate("/mensajes")}>
              Mensajes
            </button>
          </Card>
        </div>
      </section>
    </div>
  );
}