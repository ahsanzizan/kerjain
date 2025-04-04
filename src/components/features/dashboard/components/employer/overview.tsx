"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Jan",
    total: 2,
  },
  {
    name: "Feb",
    total: 3,
  },
  {
    name: "Mar",
    total: 1,
  },
  {
    name: "Apr",
    total: 2,
  },
  {
    name: "Mei",
    total: 4,
  },
  {
    name: "Jun",
    total: 3,
  },
  {
    name: "Jul",
    total: 5,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}

