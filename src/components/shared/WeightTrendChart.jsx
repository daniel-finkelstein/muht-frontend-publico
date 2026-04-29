import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export function WeightTrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
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
          domain={["dataMin - 5", "dataMax + 5"]}
        />
        <Tooltip />
        <Legend
          wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
        />
        <Line
          type="monotone"
          dataKey="weight"
          name="Peso"
          stroke="#003A8F"
          strokeWidth={3}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          connectNulls
        />
        <Line
          type="monotone"
          dataKey="leanMass"
          name="Masa magra"
          stroke="#10B981"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
          connectNulls
        />
        <Line
          type="monotone"
          dataKey="fatMass"
          name="Masa grasa"
          stroke="#EF4444"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
}