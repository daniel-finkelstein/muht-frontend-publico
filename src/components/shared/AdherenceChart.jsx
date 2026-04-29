import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  Legend,
} from "recharts";

const BAR_COLORS = ["#003A8F", "#7A2C8F", "#10B981", "#F59E0B"];
const PREVIOUS_COLOR = "#bec2c7";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const current = payload.find((item) => item.dataKey === "value")?.value ?? 0;
  const previous =
    payload.find((item) => item.dataKey === "previousValue")?.value ?? 0;

  const difference = current - previous;
  const differenceText =
    difference > 0
      ? `+${difference}% vs mes anterior`
      : `${difference}% vs mes anterior`;

  return (
    <div
      style={{
        background: "white",
        border: "1px solid #E5E7EB",
        borderRadius: "10px",
        padding: "10px 12px",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
        fontSize: "12px",
      }}
    >
      <strong>{label}</strong>
      <p style={{ margin: "6px 0 2px" }}>Mes actual: {current}%</p>
      <p style={{ margin: "2px 0" }}>Mes anterior: {previous}%</p>
      <p style={{ margin: "6px 0 0", fontWeight: 600 }}>
        {differenceText}
      </p>
    </div>
  );
}

// ... (resto del código igual)

export function AdherenceChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
        barCategoryGap="24%"
      >
        <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />

        <XAxis
          dataKey="label"
          stroke="#6B7280"
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: "#D1D5DB" }}
          tickLine={{ stroke: "#D1D5DB" }}
        />

        <YAxis
          stroke="#6B7280"
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: "#D1D5DB" }}
          tickLine={{ stroke: "#D1D5DB" }}
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
        />

        <Tooltip content={<CustomTooltip />} />

        <Legend
          verticalAlign="top"
          height={28}
        />

        <Bar
          dataKey="previousValue"
          name="Mes anterior"
          fill={PREVIOUS_COLOR}
          radius={[8, 8, 0, 0]}
          maxBarSize={42}
        />

        <Bar
          dataKey="value"
          name="Mes actual"
          radius={[8, 8, 0, 0]}
          maxBarSize={42}
        >
          {data.map((entry, index) => (
            <Cell
              key={entry.label}
              fill={BAR_COLORS[index % BAR_COLORS.length]}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}