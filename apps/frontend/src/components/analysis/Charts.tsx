"use client";

import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface RiskGaugeProps {
  score: number;
  level: "green" | "yellow" | "red";
}

export function RiskGauge({ score, level }: RiskGaugeProps) {
  const color = level === "green" ? "#22c55e" : level === "yellow" ? "#eab308" : "#ef4444";
  const data = [{ value: score, fill: color }];

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={160}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="90%"
          barSize={12}
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <RadialBar background dataKey="value" cornerRadius={6} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
        <span className="text-4xl font-bold">{score}</span>
        <span className="text-xs text-muted-foreground uppercase tracking-wide">
          {level === "green" ? "Low Risk" : level === "yellow" ? "Medium" : "High Risk"}
        </span>
      </div>
    </div>
  );
}

interface ClauseChartProps {
  data: { name: string; found: number }[];
}

export function ClauseCoverageChart({ data }: ClauseChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical" barSize={16} margin={{ left: 0, right: 16 }}>
        <XAxis type="number" domain={[0, 1]} hide />
        <YAxis
          type="category"
          dataKey="name"
          axisLine={false}
          tickLine={false}
          width={90}
          tick={{ fontSize: 12, fill: "#71717a" }}
        />
        <Tooltip
          cursor={{ fill: "transparent" }}
          content={({ active, payload }) => {
            if (active && payload?.length) {
              return (
                <div className="bg-popover border rounded-md px-3 py-1.5 text-xs shadow-md">
                  {payload[0].payload.found ? "Found" : "Missing"}
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="found" radius={[0, 4, 4, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.found ? "#18181b" : "#e5e5e5"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

interface IssueChartProps {
  data: { name: string; value: number; fill: string }[];
}

export function IssuesBreakdownChart({ data }: IssueChartProps) {
  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width={120} height={120}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={35}
            outerRadius={55}
            dataKey="value"
            paddingAngle={3}
            strokeWidth={0}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
            <span className="text-xs text-muted-foreground">{item.name}</span>
            <span className="text-xs font-medium ml-auto">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface StatsDonutProps {
  found: number;
  total: number;
  label: string;
}

export function StatsDonut({ found, total, label }: StatsDonutProps) {
  const percentage = Math.round((found / total) * 100);
  const data = [
    { value: found, fill: "#18181b" },
    { value: total - found, fill: "#e5e5e5" },
  ];

  return (
    <div className="flex items-center gap-3">
      <ResponsiveContainer width={60} height={60}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={20}
            outerRadius={28}
            dataKey="value"
            strokeWidth={0}
          />
        </PieChart>
      </ResponsiveContainer>
      <div>
        <p className="text-2xl font-bold">{found}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
