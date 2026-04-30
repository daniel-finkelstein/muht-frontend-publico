import { useEffect, useMemo, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  TrendingDown,
  Scale,
  Activity,
  Trophy,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import "./PatientStats.css";

import { Card } from "../../components/shared/Card";
import { StatCard } from "../../components/shared/StatCard";
import { ChartCard } from "../../components/shared/ChartCard";
import { WeightTrendChart } from "../../components/shared/WeightTrendChart";

import { getPatientProfile } from "../../services/patientService";
import { getWeightHistory } from "../../services/weightHistoryService";
import { getPhysicalActivities } from "../../services/physicalActivityService";

import {
  adaptWeightHistoryToChart,
  getWeightStats,
  getPhysicalActivityStats,
} from "../../lib/dashboardBackendAdapters";

function getActivityDate(activity) {
  return new Date(
    activity.recorded_at ||
      activity.recordedAt ||
      activity.created_at ||
      activity.createdAt ||
      activity.updated_at ||
      activity.updatedAt ||
      activity.date
  );
}

function getActivityMinutes(activity) {
  return Number(
    activity.duration_minutes ??
      activity.durationMinutes ??
      activity.minutes ??
      0
  );
}

function formatShortMonthDay(date) {
  const month = date.toLocaleDateString("es-CL", { month: "short" });
  const normalizedMonth = month.replace(".", "");
  return `${normalizedMonth.charAt(0).toUpperCase()}${normalizedMonth.slice(1)} ${date.getDate()}`;
}

function formatWeekLabel(startDate, endDate) {
  const startMonth = startDate.toLocaleDateString("es-CL", { month: "short" }).replace(".", "");
  const endMonth = endDate.toLocaleDateString("es-CL", { month: "short" }).replace(".", "");

  const formattedStartMonth =
    startMonth.charAt(0).toUpperCase() + startMonth.slice(1);

  const formattedEndMonth =
    endMonth.charAt(0).toUpperCase() + endMonth.slice(1);

  if (formattedStartMonth === formattedEndMonth) {
    return `${formattedStartMonth} ${startDate.getDate()} - ${endDate.getDate()}`;
  }

  return `${formattedStartMonth} ${startDate.getDate()} - ${formattedEndMonth} ${endDate.getDate()}`;
}

function buildActivityChartData(activities, range) {
  const safeActivities = Array.isArray(activities) ? activities : [];
  const now = new Date();

    if (range === "3m") {
    const rangeStartDate = new Date(now);
    rangeStartDate.setDate(now.getDate() - 84);

    const validActivities = safeActivities
        .map((activity) => ({
        ...activity,
        parsedDate: getActivityDate(activity),
        parsedMinutes: getActivityMinutes(activity),
        }))
        .filter((activity) => {
        return (
            !Number.isNaN(activity.parsedDate.getTime()) &&
            activity.parsedDate >= rangeStartDate &&
            activity.parsedDate <= now
        );
        });

    if (validActivities.length === 0) {
        return [];
    }

    const firstActivityDate = validActivities.reduce((earliest, activity) => {
        return activity.parsedDate < earliest ? activity.parsedDate : earliest;
    }, validActivities[0].parsedDate);

    const startDate = new Date(firstActivityDate);
    startDate.setHours(0, 0, 0, 0);

    const totalDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7) + 1;

    const weeks = Array.from({ length: totalWeeks }, (_, index) => {
        const weekStart = new Date(startDate);
        weekStart.setDate(startDate.getDate() + index * 7);

        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);

        return {
        label: formatWeekLabel(weekStart, weekEnd),
        minutes: 0,
        };
    });

    validActivities.forEach((activity) => {
        const diffDays = Math.floor(
        (activity.parsedDate - startDate) / (1000 * 60 * 60 * 24)
        );

        const weekIndex = Math.min(
        Math.max(Math.floor(diffDays / 7), 0),
        weeks.length - 1
        );

        weeks[weekIndex].minutes += activity.parsedMinutes;
    });

    return weeks;
    }

  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);

    return {
      month: date.getMonth(),
      year: date.getFullYear(),
      label: date.toLocaleDateString("es-CL", { month: "short" }),
      minutes: 0,
    };
  });

  safeActivities.forEach((activity) => {
    const date = getActivityDate(activity);
    if (Number.isNaN(date.getTime())) return;

    const targetMonth = months.find(
      (item) =>
        item.month === date.getMonth() &&
        item.year === date.getFullYear()
    );

    if (!targetMonth) return;

    targetMonth.minutes += getActivityMinutes(activity);
  });

  return months.map((item) => ({
    label: item.label,
    minutes: Math.round(item.minutes / 4),
  }));
}

function PatientActivityChart({ data }) {
  return (
    <div className="patient-activity-chart">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip
            formatter={(value) => [`${value} min`, "Ejercicio"]}
            labelFormatter={(label) => label}
          />
        <Bar
            dataKey="minutes"
            radius={[10, 10, 0, 0]}
            fill="#8b5cf6"
            barSize={98}
        />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function PatientStatsPage() {
  const { getAccessTokenSilently } = useAuth0();

  const [weightHistory, setWeightHistory] = useState([]);
  const [physicalActivities, setPhysicalActivities] = useState([]);
  const [activeTab, setActiveTab] = useState("weight");
  const [activityRange, setActivityRange] = useState("3m");

  useEffect(() => {
    async function loadStats() {
      try {
        const token = await getAccessTokenSilently();
        const profile = await getPatientProfile(token);
        const patientUuid = profile.profile?.id ?? profile.id;
        
        const [weightData, activityData] = await Promise.all([
          getWeightHistory(token, patientUuid),
          getPhysicalActivities(token, patientUuid),
        ]);

        setWeightHistory(weightData);
        setPhysicalActivities(activityData);
        console.log("PROFILE:", profile);
        console.log("PATIENT UUID:", patientUuid);
        console.log("ACTIVITY DATA:", activityData);
      } catch (error) {
        console.error("Error cargando estadísticas de paciente:", error);
      }
    }

    loadStats();
  }, [getAccessTokenSilently]);

  const weightStats = useMemo(() => {
    return getWeightStats(weightHistory);
  }, [weightHistory]);

  const activityStats = useMemo(() => {
    return getPhysicalActivityStats(physicalActivities);
  }, [physicalActivities]);

  const weightChartData = useMemo(() => {
    return adaptWeightHistoryToChart(weightHistory, "6m");
  }, [weightHistory]);

  const activityChartData = useMemo(() => {
    return buildActivityChartData(physicalActivities, activityRange);
  }, [physicalActivities, activityRange]);

  return (
    <div className="patient-stats-page">
      <section className="patient-stats-header">
        <h1>Tu progreso</h1>
        <p>Revisa tu avance de forma simple y clara.</p>
      </section>

      <section className="patient-stats-summary">
        <StatCard
          title="Peso perdido"
          value={weightStats.totalLoss}
          helper="Desde el inicio"
          icon={<TrendingDown size={24} />}
        />

        <StatCard
          title="Peso actual"
          value={weightStats.currentWeight}
          helper="Último registro"
          icon={<Scale size={24} />}
        />

        <StatCard
          title="Actividad"
          value={activityStats.totalActivities}
          helper="Registros cargados"
          icon={<Activity size={24} />}
        />

        <StatCard
          title="Logros"
          value="3"
          helper="Desbloqueados"
          icon={<Trophy size={24} />}
        />
      </section>

      <div className="patient-stats-tabs">
        <button
          className={activeTab === "weight" ? "active" : ""}
          onClick={() => setActiveTab("weight")}
        >
          Progreso de peso
        </button>

        <button
          className={activeTab === "activity" ? "active" : ""}
          onClick={() => setActiveTab("activity")}
        >
          Actividad física
        </button>
      </div>

      {activeTab === "weight" && (
        <ChartCard title="Peso en el tiempo" subtitle="Tu evolución registrada">
          <WeightTrendChart data={weightChartData} />

          <div className="patient-positive-message">
            ¡Buen progreso! Sigue registrando tus avances.
          </div>
        </ChartCard>
      )}

      {activeTab === "activity" && (
        <ChartCard
          title="Actividad física"
          subtitle={
            activityRange === "3m"
              ? "Minutos totales de ejercicio por semana"
              : "Promedio semanal de minutos por mes"
          }
          headerAction={
            <div className="patient-range-selector">
              <button
                className={activityRange === "3m" ? "active" : ""}
                onClick={() => setActivityRange("3m")}
              >
                3 meses
              </button>

              <button
                className={activityRange === "6m" ? "active" : ""}
                onClick={() => setActivityRange("6m")}
              >
                6 meses
              </button>
            </div>
          }
        >
          <PatientActivityChart data={activityChartData} />

          <div className="patient-positive-message purple">
            Mantener la constancia es más importante que hacerlo perfecto.
          </div>
        </ChartCard>
      )}

      <section className="patient-achievements-section">
        <Card>
          <h2>Tus logros</h2>
          <p>Celebra tus avances importantes.</p>

          <div className="patient-achievements-grid">
            <div className="patient-achievement-item weight">
              <TrendingDown size={32} />
              <strong>Primeros 5 kg</strong>
              <span>Primer hito de peso alcanzado</span>
            </div>

            <div className="patient-achievement-item streak">
              <Trophy size={32} />
              <strong>7 días seguidos</strong>
              <span>Registros constantes durante una semana</span>
            </div>

            <div className="patient-achievement-item activity">
              <Activity size={32} />
              <strong>Actividad activa</strong>
              <span>Registraste actividad física</span>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}