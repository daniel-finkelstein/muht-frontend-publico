import { useEffect, useMemo, useState } from "react";
import "./Stats.css";
import { TrendingUp, Activity, ClipboardCheck, Scale } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";

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
} from "../../lib/dashboardAdapters";

import {
  adaptWeightHistoryToChart,
  getWeightStats,
  getPhysicalActivityStats,
  getMonthlyAdherenceComparison,
} from "../../lib/dashboardBackendAdapters";

export default function StatsPage() {
  const statsData = getDashboardData();
  const { getAccessTokenSilently } = useAuth0();

  const [patientProfile, setPatientProfile] = useState(null);
  const [weightHistory, setWeightHistory] = useState([]);
  const [physicalActivities, setPhysicalActivities] = useState([]);
  const [isLoadingBackendData, setIsLoadingBackendData] = useState(false);

  useEffect(() => {
    async function loadStatsData() {
      try {
        setIsLoadingBackendData(true);

        const token = await getAccessTokenSilently();

        const profile = await getPatientProfile(token);
        const patientUuid = profile.profile?.id ?? profile.id;

        const [weightHistoryData, physicalActivitiesData] = await Promise.all([
          getWeightHistory(token, patientUuid),
          getPhysicalActivities(token, patientUuid),
        ]);

        setPatientProfile(profile);
        setWeightHistory(weightHistoryData);
        setPhysicalActivities(physicalActivitiesData);
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
      } finally {
        setIsLoadingBackendData(false);
      }
    }

    loadStatsData();
  }, [getAccessTokenSilently]);

  const bodyData = useMemo(() => {
    if (weightHistory.length > 0) {
      return adaptWeightHistoryToChart(weightHistory, "6m");
    }

    return buildBodyCompositionChartData(statsData.bodyComposition, "6m");
  }, [weightHistory, statsData.bodyComposition]);

  const adherenceData = useMemo(() => {
    if (physicalActivities.length > 0) {
      return getMonthlyAdherenceComparison(physicalActivities);
    }

    return calculateAdherence(statsData.adherenceRaw);
  }, [physicalActivities, statsData.adherenceRaw]);

  const weightStats = useMemo(() => {
    return getWeightStats(weightHistory);
  }, [weightHistory]);

  const physicalActivityStats = useMemo(() => {
    return getPhysicalActivityStats(physicalActivities);
  }, [physicalActivities]);

  const averageAdherence = useMemo(() => {
    if (!adherenceData.length) return 0;

    const total = adherenceData.reduce((sum, item) => sum + Number(item.value || 0), 0);
    return Math.round(total / adherenceData.length);
  }, [adherenceData]);

  return (
    <div className="stats-page">
      <section>
        <div>
          <h1 className="stats-title">Estadísticas</h1>
        </div>
      </section>

      <section className="stats-toolbar">
        <Card>
          <div className="stats-toolbar-row">
            <label className="stats-field">
              <span className="stats-label">Paciente</span>
              <select className="stats-select" value={patientProfile?.email || ""} disabled>
                <option value="">
                  {isLoadingBackendData
                    ? "Cargando..."
                    : patientProfile?.fullName ||
                      patientProfile?.full_name ||
                      patientProfile?.email ||
                      "Paciente actual"}
                </option>
              </select>
            </label>

            <label className="stats-field">
              <span className="stats-label">Rango</span>
              <select className="stats-select" value="6m" disabled>
                <option value="6m">6 meses</option>
              </select>
            </label>

            <label className="stats-field">
              <span className="stats-label">Métrica</span>
              <select className="stats-select" value="body" disabled>
                <option value="body">Composición corporal</option>
              </select>
            </label>
          </div>
        </Card>
      </section>

      <section className="stats-summary">
        <div className="dashboard-stats-grid">
          <StatCard
            title="Peso actual"
            value={weightStats.currentWeight}
            helper="Último registro"
            icon={<Scale size={24} />}
          />

          <StatCard
            title="Cambio total"
            value={weightStats.totalLoss}
            helper="Últimos 6 meses"
            icon={<TrendingUp size={24} />}
          />

          <StatCard
            title="Adherencia"
            value={`${averageAdherence}%`}
            helper="Promedio general"
            icon={<ClipboardCheck size={24} />}
          />

          <StatCard
            title="Actividad"
            value={`${physicalActivityStats.totalActivities}`}
            helper="Registros cargados"
            icon={<Activity size={24} />}
          />
        </div>
      </section>

      <section className="stats-main">
        <div className="stats-main-grid">
          <ChartCard
            title="Evolución de composición corporal"
            subtitle="Peso registrado por el paciente"
          >
            <WeightTrendChart data={bodyData} />
          </ChartCard>

          <ChartCard
            title="Adherencia por categoría"
            subtitle="Comparación mes actual vs mes anterior"
          >
            <AdherenceChart data={adherenceData} />
          </ChartCard>
        </div>
      </section>

      <section className="stats-bottom">
        <div className="stats-bottom-grid">
          <Card>
            <h3 className="stats-section-title">Resumen por categoría</h3>
            <div className="stats-list">
              {adherenceData.map((item) => (
                <div className="stats-list-item" key={item.label}>
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="stats-section-title">Observaciones</h3>
            <div className="stats-list">
              <div className="stats-list-item">
                <span>Peso actual</span>
                <span>{weightStats.currentWeight}</span>
              </div>
              <div className="stats-list-item">
                <span>Registros de actividad</span>
                <span>{physicalActivityStats.totalActivities}</span>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}