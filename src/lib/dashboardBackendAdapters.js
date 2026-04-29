function getDateFromBackendItem(item) {
  return new Date(item.recorded_at || item.createdAt || item.created_at);
}

function formatChartLabel(date) {
  return date.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
  });
}

export function adaptWeightHistoryToChart(weightHistory = [], selectedRange = "6m") {
  const monthsByRange = { "1m": 1, "3m": 3, "6m": 6 };
  const months = monthsByRange[selectedRange] ?? 6;

  const limitDate = new Date();
  limitDate.setMonth(limitDate.getMonth() - months);

  return weightHistory
    .filter((item) => getDateFromBackendItem(item) >= limitDate)
    .sort((a, b) => getDateFromBackendItem(a) - getDateFromBackendItem(b))
    .map((item) => {
      const date = getDateFromBackendItem(item);

      return {
        label: formatChartLabel(date),
        weight: Number(item.weight_value),
        leanMass: null,
        fatMass: null,
      };
    });
}

export function getWeightStats(weightHistory = []) {
  if (!weightHistory.length) {
    return {
      currentWeight: "-",
      totalLoss: "-",
    };
  }

  const ordered = [...weightHistory].sort(
    (a, b) => getDateFromBackendItem(a) - getDateFromBackendItem(b)
  );

  const firstWeight = Number(ordered[0].weight_value);
  const lastWeight = Number(ordered[ordered.length - 1].weight_value);
  const totalLoss = firstWeight - lastWeight;

  return {
    currentWeight: `${lastWeight.toFixed(1)} kg`,
    totalLoss: `${totalLoss.toFixed(1)} kg`,
  };
}

export function getPhysicalActivityStats(physicalActivities = []) {
  return {
    totalActivities: physicalActivities.length,
  };
}

function getActivityDate(item) {
  return new Date(item.created_at || item.createdAt || item.updated_at);
}

function getMonthRange(offset = 0) {
  const now = new Date();

  const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0);

  if (offset === 0 && now < end) {
    end.setTime(now.getTime());
  }

  end.setHours(23, 59, 59, 999);
  start.setHours(0, 0, 0, 0);

  return { start, end };
}

function getWeekRangesInsideMonth(start, end) {
  const weeks = [];
  let current = new Date(start);

  while (current <= end) {
    const weekStart = new Date(current);
    const weekEnd = new Date(current);

    weekEnd.setDate(weekEnd.getDate() + (6 - weekEnd.getDay()));
    weekEnd.setHours(23, 59, 59, 999);

    if (weekEnd > end) {
      weekEnd.setTime(end.getTime());
    }

    weeks.push({ start: weekStart, end: weekEnd });

    current = new Date(weekEnd);
    current.setDate(current.getDate() + 1);
    current.setHours(0, 0, 0, 0);
  }

  return weeks;
}

function calculateMonthlyExerciseAdherence(physicalActivities = [], offset = 0) {
  const weeklyGoalMinutes = 7 * 60;
  const { start, end } = getMonthRange(offset);
  const weeks = getWeekRangesInsideMonth(start, end);

  if (weeks.length === 0) return 0;

  const weeklyPercentages = weeks.map((week) => {
    const minutes = physicalActivities
      .filter((activity) => {
        const date = getActivityDate(activity);
        return date >= week.start && date <= week.end;
      })
      .reduce((sum, activity) => {
        return sum + Number(activity.duration_minutes || 0);
      }, 0);

    return Math.min((minutes / weeklyGoalMinutes) * 100, 100);
  });

  const average =
    weeklyPercentages.reduce((sum, value) => sum + value, 0) /
    weeklyPercentages.length;

  return Math.round(average);
}

export function getMonthlyAdherenceComparison(physicalActivities = []) {
  const currentExercise = calculateMonthlyExerciseAdherence(physicalActivities, 0);
  const previousExercise = calculateMonthlyExerciseAdherence(physicalActivities, -1);

  return [
    {
      label: "Controles",
      value: 97,
      previousValue: 100,
    },
    {
      label: "Exámenes",
      value: 78,
      previousValue: 65,
    },
    {
      label: "Ejercicio",
      value: currentExercise,
      previousValue: previousExercise,
    },
    {
      label: "No tabaquismo",
      value: 100,
      previousValue: 94,
    },
  ];
}