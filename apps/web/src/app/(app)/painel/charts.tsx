"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface ChartData {
  name: string;
  value: number;
}

const COLORS = ["#1B5E34", "#8BC34A", "#2196F3", "#FF9800", "#9C27B0", "#F44336", "#607D8B", "#795548"];

function truncate(s: string, max: number) {
  return s.length > max ? s.slice(0, max) + "…" : s;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export function CategoryChart({ data }: { data: ChartData[] }) {
  if (data.length === 0) return null;
  const chartData = data.map((d) => ({ ...d, short: truncate(d.name, 15) }));
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 60 }}>
        <XAxis
          dataKey="short"
          tick={{ fontSize: 9 }}
          interval={0}
          angle={-45}
          textAnchor="end"
        />
        <YAxis tick={{ fontSize: 10 }} allowDecimals={false} width={30} />
        <Tooltip
          formatter={(v: any) => [v, "Bens"]}
          labelFormatter={(label: any) => {
            const item = chartData.find((d) => d.short === label);
            return item?.name || label;
          }}
          contentStyle={{ fontSize: 12 }}
        />
        <Bar dataKey="value" fill="#1B5E34" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function UnitPieChart({ data }: { data: ChartData[] }) {
  if (data.length === 0) return null;
  const chartData = data.map((d) => ({ ...d, short: truncate(d.name, 18) }));
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="45%"
          outerRadius={70}
          innerRadius={35}
          dataKey="value"
          nameKey="short"
          labelLine={false}
        >
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(v: any, _: any, entry: any) => [v, entry.payload?.name || ""]}
          contentStyle={{ fontSize: 12 }}
        />
        <Legend
          wrapperStyle={{ fontSize: 10, paddingTop: 8 }}
          formatter={(value: any) => truncate(value, 22)}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ValorChart({ data }: { data: { name: string; aquisicao: number; contabil: number }[] }) {
  if (data.length === 0) return null;
  const chartData = data.map((d) => ({ ...d, short: truncate(d.name, 12) }));
  const fmt = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v.toFixed(0)}`;
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 10, left: 5, bottom: 50 }}>
        <Legend verticalAlign="top" wrapperStyle={{ fontSize: 10, paddingBottom: 8 }} />
        <XAxis
          dataKey="short"
          tick={{ fontSize: 9 }}
          interval={0}
          angle={-40}
          textAnchor="end"
        />
        <YAxis tick={{ fontSize: 9 }} tickFormatter={fmt} width={45} />
        <Tooltip
          formatter={(v: any) => [`R$ ${Number(v).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, ""]}
          labelFormatter={(label: any) => {
            const item = chartData.find((d) => d.short === label);
            return item?.name || label;
          }}
          contentStyle={{ fontSize: 12 }}
        />
        <Bar dataKey="aquisicao" name="Aquisição" fill="#1B5E34" radius={[4, 4, 0, 0]} maxBarSize={40} />
        <Bar dataKey="contabil" name="Contábil" fill="#8BC34A" radius={[4, 4, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function AttendanceChart({ data }: { data: { name: string; presentes: number; ausentes: number }[] }) {
  if (data.length === 0) return null;
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} allowDecimals={false} width={30} />
        <Tooltip contentStyle={{ fontSize: 12 }} />
        <Bar dataKey="presentes" name="Presentes" fill="#1B5E34" radius={[4, 4, 0, 0]} stackId="a" />
        <Bar dataKey="ausentes" name="Ausentes" fill="#EF4444" radius={[4, 4, 0, 0]} stackId="a" />
        <Legend wrapperStyle={{ fontSize: 10 }} />
      </BarChart>
    </ResponsiveContainer>
  );
}
