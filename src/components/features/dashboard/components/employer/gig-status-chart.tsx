"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "Terbuka", value: 5, color: "#22c55e" },
  { name: "Dalam Proses", value: 4, color: "#3b82f6" },
  { name: "Selesai", value: 3, color: "#8b5cf6" },
  { name: "Dibatalkan", value: 0, color: "#ef4444" },
]

const COLORS = ["#22c55e", "#3b82f6", "#8b5cf6", "#ef4444"]

export function GigStatusChart() {
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
          <Tooltip formatter={(value) => [`${value} gig`, "Jumlah"]} labelFormatter={(name) => `Status: ${name}`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

