function getRangeConfig(range) {
  switch (range) {
    case "1m":
      return { months: 1, stepDays: 7 };
    case "3m":
      return { months: 3, stepDays: 14 };
    case "6m":
    default:
      return { months: 6, stepDays: 30 };
  }
}

function getStartDateFromRange(endDate, range) {
  const startDate = new Date(endDate);

  if (range === "1m") {
    startDate.setMonth(startDate.getMonth() - 1);
  } else if (range === "3m") {
    startDate.setMonth(startDate.getMonth() - 3);
  } else {
    startDate.setMonth(startDate.getMonth() - 6);
  }

  return startDate;
}

function formatTickLabel(date, range) {
  if (range === "1m") {
    return date.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "short",
    });
  }

  if (range === "3m") {
    return date.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "short",
    });
  }

  return date.toLocaleDateString("es-CL", {
    month: "short",
    year: "2-digit",
  });
}

function parseDate(dateString) {
  return new Date(`${dateString}T00:00:00`);
}

function getClosestDataPoint(targetDate, data, startDate, previousPoint) {
  const pointsInRange = data.filter((item) => {
    const itemDate = parseDate(item.date);
    return itemDate >= startDate && itemDate <= targetDate;
  });

  if (pointsInRange.length === 0) {
    return previousPoint || null;
  }

  return pointsInRange[pointsInRange.length - 1];
}

function formatPointLabel(date, range) {
  if (range === "1m") {
    return date.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "short",
    });
  }

  if (range === "3m") {
    return date.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "short",
    });
  }

  return date.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
}

export function buildBodyCompositionChartData(rawData, range) {
  if (!rawData || rawData.length === 0) return [];

  const sortedData = [...rawData].sort(
    (a, b) => parseDate(a.date) - parseDate(b.date)
  );

  const lastDate = parseDate(sortedData[sortedData.length - 1].date);
  const startDate = getStartDateFromRange(lastDate, range);

  return sortedData
    .filter((item) => {
      const itemDate = parseDate(item.date);
      return itemDate >= startDate && itemDate <= lastDate;
    })
    .map((item) => {
      const itemDate = parseDate(item.date);

      return {
        label: formatPointLabel(itemDate, range),
        weight: item.weight,
        leanMass: item.leanMass,
        fatMass: item.fatMass,
      };
    });
}

export function calculateAdherence(rawData) {
  if (!rawData || rawData.length === 0) return [];

  const totalEntries = rawData.length;

  const exerciseCount = rawData.filter((item) => item.exercised).length;
  const nonSmokingCount = rawData.filter((item) => item.smoked === 0).length;
  const attendedAppointmentsCount = rawData.filter((item) => item.attendedAppointment === 0).length;
  const uploadedExamsCount = rawData.filter((item) => item.uploadedExamOnTime === 0).length;

  return [
    {
      label: "Controles",
      value: Math.round((attendedAppointmentsCount / totalEntries) * 100),
    },
    {
      label: "Exámenes",
      value: Math.round((uploadedExamsCount / totalEntries) * 100),
    },
    {
      label: "Ejercicio",
      value: Math.round((exerciseCount / totalEntries) * 100),
    },
    {
      label: "No tabaquismo",
      value: Math.round((nonSmokingCount / totalEntries) * 100),
    },
  ];
}

export function getOverallAdherence(adherenceData) {
  if (!adherenceData || adherenceData.length === 0) return 0;

  const total = adherenceData.reduce((sum, item) => sum + item.value, 0);
  return Math.round(total / adherenceData.length);
}

export function calculateImc(bodyComposition) {
  if (!bodyComposition || bodyComposition.length === 0) return null;

  const last = bodyComposition[bodyComposition.length - 1];

  const weight = last.weight; // kg
  
  // console.log("WEIGHT ACTUAL:", weight);
  const height = 1.7; // 🔴 mock temporal (metros)

  const imc = weight / (height * height);
  // console.log("IMC ACTUAL:", imc);
  
  return imc.toFixed(1);
}