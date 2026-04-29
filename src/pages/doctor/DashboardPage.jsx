import { useEffect, useMemo, useState } from "react";
import "./Dashboard.css";
import {
  CalendarDays,
  TrendingUp,
  Activity,
  ClipboardCheck,
} from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/shared/Card";
import { StatCard } from "../../components/shared/StatCard";
import { ChartCard } from "../../components/shared/ChartCard";
import { WeightTrendChart } from "../../components/shared/WeightTrendChart";
import { AdherenceChart } from "../../components/shared/AdherenceChart";

import { getDashboardData } from "../../services/dashboardService";
import { getPatientProfile } from "../../services/patientService";
import { getWeightHistory } from "../../services/weightHistoryService";
import { getPhysicalActivities } from "../../services/physicalActivityService";

import {
  buildBodyCompositionChartData,
  calculateAdherence,
  getOverallAdherence,
  calculateImc,
} from "../../lib/dashboardAdapters";

import {
  adaptWeightHistoryToChart,
  getWeightStats,
  getPhysicalActivityStats,
  getMonthlyAdherenceComparison,
} from "../../lib/dashboardBackendAdapters";

export default function Dashboard() {
  const dashboardData = getDashboardData();
  const [selectedRange, setSelectedRange] = useState("6m");

  const { getAccessTokenSilently } = useAuth0();

  const [patientProfile, setPatientProfile] = useState(null);
  const [weightHistory, setWeightHistory] = useState([]);
  const [physicalActivities, setPhysicalActivities] = useState([]);
  const [isLoadingBackendData, setIsLoadingBackendData] = useState(false);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoadingBackendData(true);

        const token = await getAccessTokenSilently();

        const profile = await getPatientProfile(token);
        const patientUuid = profile.profile?.id ?? profile.id;
        const patientProfileId = profile.patient_profile?.id;

        const [weightHistoryData, physicalActivitiesData] = await Promise.all([
          getWeightHistory(token, patientUuid),
          getPhysicalActivities(token, patientUuid),
        ]);

        setPatientProfile(profile);
        setWeightHistory(weightHistoryData);
        setPhysicalActivities(physicalActivitiesData);

        // console.log("Patient profile:", profile);
        // console.log("Weight history:", weightHistoryData);
        // console.log("Physical activities:", physicalActivitiesData);
      } catch (error) {
          console.error("Error cargando datos del dashboard:", error);
      } finally {
          setIsLoadingBackendData(false);
      }
    }

    loadDashboardData();
  }, [getAccessTokenSilently]);

  const bodyCompositionChartData = useMemo(() => {
    if (weightHistory.length >= 0) {
      return adaptWeightHistoryToChart(weightHistory, selectedRange);
    }

    return buildBodyCompositionChartData(
      dashboardData.bodyComposition,
      selectedRange
    );
  }, [weightHistory, dashboardData.bodyComposition, selectedRange]);

  const adherenceChartData = useMemo(() => {
    if (physicalActivities.length >= 0) {
      return getMonthlyAdherenceComparison(physicalActivities);
    }

    return calculateAdherence(dashboardData.adherenceRaw);
  }, [physicalActivities, dashboardData.adherenceRaw]);

  const overallAdherence = useMemo(() => {
    return getOverallAdherence(adherenceChartData);
  }, [adherenceChartData]);

  const imc = useMemo(() => {
    return calculateImc(dashboardData.bodyComposition);
  }, [dashboardData.bodyComposition]);

  const weightStats = useMemo(() => {
    return getWeightStats(weightHistory);
  }, [weightHistory]);

  const physicalActivityStats = useMemo(() => {
    return getPhysicalActivityStats(physicalActivities);
  }, [physicalActivities]);

  // console.log("Chart data:", bodyCompositionChartData);

  return (
    <div className="dashboard-page">
      <section>
        <div>
          <h1 className="dashboard-title">Panel Principal</h1>
          {patientProfile && (
            <p className="dashboard-subtitle">
              {patientProfile.fullName || patientProfile.full_name || patientProfile.email}
            </p>
          )}
        </div>
      </section>

      <section className="dashboard-stats">
        <div className="dashboard-stats-grid">
          <StatCard
            title="Pérdida de peso total"
            value={weightStats.totalLoss}
            helper="Según registros de peso"
            icon={<TrendingUp size={24} />}
          />

          <StatCard
            title="IMC"
            value={imc}
            helper="-6.1"
            icon={<ClipboardCheck size={24} />}
          />

          <StatCard
            title="Actividad física"
            value={`${physicalActivityStats.totalActivities}`}
            helper="Registros cargados"
            icon={<Activity size={24} />}
          />

          <Card className="dashboard-next-appointment-card">
            <div className="dashboard-next-appointment-header">
              <div className="dashboard-next-appointment-icon">
                <CalendarDays size={18} />
              </div>
              <span className="dashboard-next-appointment-label">
                Próximo control
              </span>
            </div>

            <div className="dashboard-next-appointment-body">
              <p className="dashboard-next-appointment-date">22 Abr 2026</p>
              <p className="dashboard-next-appointment-subtitle">
                Control a 3 meses
              </p>

              <div className="dashboard-next-appointment-doctor-box">
                <p className="dashboard-next-appointment-doctor">
                  Dr. María González
                </p>
                <p className="dashboard-next-appointment-location">
                  Cirujano Bariátrico · Consulta 4
                </p>
              </div>

              <button className="dashboard-next-appointment-button">
                Ver detalle
              </button>
            </div>
          </Card>
        </div>
      </section>

      <section className="dashboard-charts">
        <div className="dashboard-charts-grid">
          <ChartCard
            title="Evolución de composición corporal"
            subtitle="Peso, masa magra y masa grasa"
            headerAction={
              <div className="dashboard-range-selector">
                {["1m", "3m", "6m"].map((range) => (
                  <Button
                    key={range}
                    className={`dashboard-range-button ${
                      selectedRange === range ? "active" : ""
                    }`}
                    onClick={() => setSelectedRange(range)}
                  >
                    {range === "1m"
                      ? "1 mes"
                      : range === "3m"
                      ? "3 meses"
                      : "6 meses"}
                  </Button>
                ))}
              </div>
            }
          >
            <WeightTrendChart data={bodyCompositionChartData} />
          </ChartCard>

          <ChartCard
            title="Adherencia al tratamiento"
            subtitle="Controles, exámenes, ejercicio y no tabaquismo"
          >
            <AdherenceChart data={adherenceChartData} />
          </ChartCard>
        </div>
      </section>

      <section className="dashboard-bottom">
        <div className="dashboard-bottom-stack">
          <Card className="dashboard-upcoming-card">
            <div className="dashboard-upcoming-header">
              <h3 className="dashboard-section-title">Próximos Controles</h3>
            </div>

            <div className="dashboard-upcoming-list">
              <div className="dashboard-upcoming-item">
                <div className="dashboard-upcoming-left">
                  <span className="dashboard-upcoming-dot"></span>
                  <div>
                    <p className="dashboard-upcoming-title">
                      Control Nutricional
                    </p>
                    <p className="dashboard-upcoming-date">
                      15 Abr 2026 · 10:00
                    </p>
                  </div>
                </div>
                <span className="dashboard-status-badge pending">
                  pendiente
                </span>
              </div>

              <div className="dashboard-upcoming-item">
                <div className="dashboard-upcoming-left">
                  <span className="dashboard-upcoming-dot"></span>
                  <div>
                    <p className="dashboard-upcoming-title">Control Médico</p>
                    <p className="dashboard-upcoming-date">
                      22 Abr 2026 · 14:30
                    </p>
                  </div>
                </div>
                <span className="dashboard-status-badge pending">
                  pendiente
                </span>
              </div>

              <div className="dashboard-upcoming-item">
                <div className="dashboard-upcoming-left">
                  <span className="dashboard-upcoming-dot"></span>
                  <div>
                    <p className="dashboard-upcoming-title">
                      Análisis de Sangre
                    </p>
                    <p className="dashboard-upcoming-date">
                      29 Abr 2026 · 08:00
                    </p>
                  </div>
                </div>
                <span className="dashboard-status-badge scheduled">
                  programado
                </span>
              </div>
            </div>
          </Card>

          <div className="dashboard-insights-grid">
            <Card className="dashboard-insight-card success">
              <p className="dashboard-insight-title">Adherencia Excelente</p>
              <p className="dashboard-insight-text">
                Cumplimiento del 92% en los últimos 30 días
              </p>
            </Card>

            <Card className="dashboard-insight-card warning">
              <p className="dashboard-insight-title">Vitamina B12 Baja</p>
              <p className="dashboard-insight-text">
                Requiere ajuste de suplementación
              </p>
            </Card>

            <Card className="dashboard-insight-card achievement">
              <p className="dashboard-insight-title">Hito Alcanzado</p>
              <p className="dashboard-insight-text">
                6 meses post-cirugía completados
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}