'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface LinePlotProps {
  data: any;
  options: any;
  style: React.CSSProperties;
  // eslint-disable-next-line react/require-default-props
  redraw?: boolean;
}

const LinePlot: React.FC<LinePlotProps> = ({ data, options = {}, style = {}, redraw = false }) => (
  <div style={style}>
    <Line data={data} options={options} redraw={redraw} />
  </div>
);

export default LinePlot;
