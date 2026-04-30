import { useEffect, useMemo, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { User, Mail, Phone, Calendar, Shield, TrendingUp, Activity, ClipboardCheck, Scale } from "lucide-react";

import { Card } from "../../components/shared/Card";
import { getPatientProfile } from "../../services/patientService";
import { getWeightHistory } from "../../services/weightHistoryService";
import { getPhysicalActivities } from "../../services/physicalActivityService";
import {
  getWeightStats,
  getPhysicalActivityStats,
  getMonthlyAdherenceComparison,
} from "../../lib/dashboardBackendAdapters";

import "./PatientProfilePage.css";

export default function PatientProfilePage() {
  const { getAccessTokenSilently } = useAuth0();

  const [patient, setPatient] = useState(null);
  const [weightHistory, setWeightHistory] = useState([]);
  const [physicalActivities, setPhysicalActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const token = await getAccessTokenSilently();
        const data = await getPatientProfile(token);

        const patientUuid = data.profile?.id ?? data.id;

        const [weightHistoryData, physicalActivitiesData] = await Promise.all([
          getWeightHistory(token, patientUuid),
          getPhysicalActivities(token, patientUuid),
        ]);

        setPatient({
          id: data.id,
          profileId: data.profile?.id,
          name: data.full_name || data.fullName || "Sin nombre",
          email: data.email,
          phone:
            data.profile?.phone_number ||
            data.profile?.phone_numder ||
            "No registrado",
          birthDate: data.profile?.birth_date || "No registrado",
          healthInsurance: data.profile?.health_insurance || "No registrado",
          status: "Seguimiento Activo",
        });

        setWeightHistory(weightHistoryData);
        setPhysicalActivities(physicalActivitiesData);
      } catch (err) {
        setError(err.message || "No se pudo cargar el perfil.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [getAccessTokenSilently]);

  const weightStats = useMemo(() => {
    return getWeightStats(weightHistory);
  }, [weightHistory]);

  const physicalActivityStats = useMemo(() => {
    return getPhysicalActivityStats(physicalActivities);
  }, [physicalActivities]);

  const adherenceData = useMemo(() => {
    return getMonthlyAdherenceComparison(physicalActivities);
  }, [physicalActivities]);

  const averageAdherence = useMemo(() => {
    if (!adherenceData.length) return 0;

    const total = adherenceData.reduce(
      (sum, item) => sum + Number(item.value || 0),
      0
    );

    return Math.round(total / adherenceData.length);
  }, [adherenceData]);

  if (loading) {
    return <p className="patient-message">Cargando perfil...</p>;
  }

  if (error) {
    return <p className="patient-message patient-error">{error}</p>;
  }

  return (
    <div className="patient-profile-page">
      <PatientHeader patient={patient} />

      <MiniStatsRow
        weightStats={weightStats}
        physicalActivityStats={physicalActivityStats}
        averageAdherence={averageAdherence}
      />

      <div className="patient-profile-grid">
        <PatientInfoCard patient={patient} />
        <ClinicalSummaryCard
          weightStats={weightStats}
          physicalActivityStats={physicalActivityStats}
          averageAdherence={averageAdherence}
        />
      </div>
    </div>
  );
}

function PatientHeader({ patient }) {
  return (
    <Card className="patient-header">
      <div className="patient-header-avatar">
        <User size={42} />
      </div>

      <div>
        <h1>Perfil del Paciente</h1>
        <h2>{patient.name}</h2>
        <p>ID: {patient.id}</p>
      </div>

      <span className="patient-status">{patient.status}</span>
    </Card>
  );
}

function MiniStatsRow({
  weightStats,
  physicalActivityStats,
  averageAdherence,
}) {
  const stats = [
    {
      title: "Peso actual",
      value: weightStats.currentWeight,
      helper: "Último registro",
      icon: <Scale size={22} />,
      color: "#2563EB", // azul
    },
    {
      title: "Cambio total",
      value: weightStats.totalLoss,
      helper: "Según historial de peso",
      icon: <TrendingUp size={22} />,
      color: "#10B981", // verde
    },
    {
      title: "Actividad física",
      value: `${physicalActivityStats.totalActivities}`,
      helper: "Registros cargados",
      icon: <Activity size={22} />,
      color: "#7A2C8F", // morado
    },
    {
      title: "Adherencia",
      value: `${averageAdherence}%`,
      helper: "Promedio general",
      icon: <ClipboardCheck size={22} />,
      color: "#F59E0B", // amarillo
    },
  ];

  return (
    <section className="mini-stats-row">
      {stats.map((stat) => (
        <Card className="mini-stat-card" key={stat.title}>
          <div className="mini-stat-icon-wrapper">
            <div
              className="mini-stat-icon"
              style={{
                backgroundColor: `${stat.color}20`, // opacidad baja
                color: stat.color,
              }}
            >
              {stat.icon}
            </div>
          </div>

          <p>{stat.title}</p>
          <h3>{stat.value}</h3>
          <span>{stat.helper}</span>
        </Card>
      ))}
    </section>
  );
}

function PatientInfoCard({ patient }) {
  return (
    <Card className="patient-info-card">
      <h3>Datos Generales</h3>

      <div className="patient-info-list">
        <InfoRow icon={<Mail size={17} />} label="Email" value={patient.email} />
        <InfoRow icon={<Phone size={17} />} label="Teléfono" value={patient.phone} />
        <InfoRow
          icon={<Calendar size={17} />}
          label="Fecha de nacimiento"
          value={patient.birthDate}
        />
        <InfoRow
          icon={<Shield size={17} />}
          label="Previsión"
          value={patient.healthInsurance}
        />
      </div>
    </Card>
  );
}

function ClinicalSummaryCard({
  weightStats,
  physicalActivityStats,
  averageAdherence,
}) {
  return (
    <Card className="clinical-summary-card">
      <h3>Resumen Clínico</h3>

      <div className="stats-list">
        <div className="stats-list-item">
          <span>Peso actual</span>
          <span>{weightStats.currentWeight}</span>
        </div>
        <div className="stats-list-item">
          <span>Cambio total</span>
          <span>{weightStats.totalLoss}</span>
        </div>
        <div className="stats-list-item">
          <span>Actividad física</span>
          <span>{physicalActivityStats.totalActivities} registros</span>
        </div>
        <div className="stats-list-item">
          <span>Adherencia promedio</span>
          <span>{averageAdherence}%</span>
        </div>
      </div>
    </Card>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="info-row">
      {icon}
      <div>
        <span>{label}</span>
        <p>{value || "No registrado"}</p>
      </div>
    </div>
  );
}