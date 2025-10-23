import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface ReportTimelineChartProps {
  data: { date: string; count: number }[];
}

const ReportTimelineChart: React.FC<ReportTimelineChartProps> = ({ data }) => {
  return (
    <div className="bg-stuff-white rounded-xl p-6 border-2 w-full border-b-4 border-stuff-light shadow-[2px_4px_0_0_rgba(0,0,0,0.05)]">
      <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-stuff-light mb-2">relatórios registrados</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#F4A64E" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReportTimelineChart;
