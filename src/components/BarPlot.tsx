'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface BarPlotProps {
  data: any;
  options: any;
  // eslint-disable-next-line react/require-default-props
  style?: React.CSSProperties;
}

const BarPlot: React.FC<BarPlotProps> = ({ data, options = {}, style = {} }) => (
  <div style={style}>
    <Bar data={data} options={options} />
  </div>
);

export default BarPlot;
