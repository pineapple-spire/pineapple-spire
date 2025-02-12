import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartData {
  year: number;
  conservative: number;
  moderate: number;
  aggressive: number;
}

interface RechartsWrapperProps {
  data: ChartData[];
}

const RechartsWrapper: React.FC<RechartsWrapperProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="year"
        tick={{ fontSize: 12 }}
      />
      <YAxis tick={{ fontSize: 12 }} />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="conservative"
        stroke="#3b82f6"
        name="Conservative"
        strokeWidth={2}
      />
      <Line
        type="monotone"
        dataKey="moderate"
        stroke="#10b981"
        name="Moderate"
        strokeWidth={2}
      />
      <Line
        type="monotone"
        dataKey="aggressive"
        stroke="#f59e0b"
        name="Aggressive"
        strokeWidth={2}
      />
    </LineChart>
  </ResponsiveContainer>
);

export default RechartsWrapper;
