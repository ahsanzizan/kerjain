"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "Tertunda", value: 15, color: "#f59e0b" },
  { name: "Diterima", value: 10, color: "#22c55e" },
  { name: "Ditolak", value: 3, color: "#ef4444" },
]

const COLORS = ["#f59e0b", "#22c55e", "#ef4444"]

export function ApplicationsChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value} aplikasi`, "Jumlah"]}
            labelFormatter={(name) => `Status: ${name}`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

