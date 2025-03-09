"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRupiah } from "@/lib/utils";
import { DollarSign } from "lucide-react";
import { type FC } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const WorkerCharts: FC<{
  dashboardData: {
    quickStats: {
      totalJobsApplied: number;
      jobsInProgress: number;
      completedJobs: number;
      averageRating: number | null;
    };
    charts: {
      appliedVsAccepted: { appliedJobs: number; acceptedJobs: number };
      earnings: { completedEarnings: number; ongoingEarnings: number };
    };
  };
}> = ({ dashboardData }) => {
  const applicationData = [
    {
      name: "Terlamar",
      value: dashboardData.charts.appliedVsAccepted.appliedJobs,
    },
    {
      name: "Diterima",
      value: dashboardData.charts.appliedVsAccepted.acceptedJobs,
    },
  ];

  const earningsData = [
    {
      name: "Selesai",
      value: dashboardData.charts.earnings.completedEarnings,
    },
    {
      name: "Sedang Berjalan",
      value: dashboardData.charts.earnings.ongoingEarnings,
    },
  ];

  return (
    <div className="col-span-12 space-y-4 md:col-span-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="p-3 pb-1">
            <CardTitle className="text-sm font-medium">
              Tingkat Keberhasilan Lamaran
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={applicationData}
                  margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="barGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.8} />
                      <stop
                        offset="100%"
                        stopColor="#4f46e5"
                        stopOpacity={0.4}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="url(#barGradient)"
                    radius={[4, 4, 0, 0]}
                    name="Pekerjaan"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="p-3 pb-1">
            <CardTitle className="text-sm font-medium">
              Rincian Pendapatan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient
                      id="colorCompleted"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity={1} />
                      <stop offset="100%" stopColor="#4338ca" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient
                      id="colorOngoing"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                      <stop offset="100%" stopColor="#7c3aed" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <Pie
                    data={earningsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={50}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    <Cell fill="url(#colorCompleted)" />
                    <Cell fill="url(#colorOngoing)" />
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatRupiah(Number(value))}
                    contentStyle={{
                      fontSize: 12,
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend verticalAlign="bottom" height={24} fontSize={12} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-1 text-center">
              <p className="flex items-center justify-center text-sm font-medium">
                <DollarSign className="mr-1 h-4 w-4 text-green-600" />
                Total:{" "}
                {formatRupiah(
                  dashboardData.charts.earnings.completedEarnings +
                    dashboardData.charts.earnings.ongoingEarnings,
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
