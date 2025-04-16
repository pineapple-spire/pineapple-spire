'use client';

import React, { Suspense, useMemo, useState } from 'react';
import { Container, Col, Row, Form } from 'react-bootstrap';
import LinePlot from '@/components/LinePlot';
import LoadingSpinner from '@/components/LoadingSpinner';
import BarPlot from '@/components/BarPlot';

interface ChartData {
  year: number;
  conservative: number;
  moderate: number;
  aggressive: number;
}

interface ChartSectionProps {
  title: string;
  data: ChartData[];
  chartType: 'line' | 'bar';
}

const ChartSection: React.FC<ChartSectionProps> = ({ title, data, chartType }) => {
  const chartData = useMemo(
    () => ({
      labels: data.map((d) => d.year.toString()),
      datasets: [
        {
          label: 'Conservative',
          data: data.map((d) => d.conservative),
          backgroundColor: '#3b82f6',
          borderColor: '#3b82f6',
          fill: chartType === 'bar',
        },
        {
          label: 'Moderate',
          data: data.map((d) => d.moderate),
          backgroundColor: '#10b981',
          borderColor: '#10b981',
          fill: chartType === 'bar',
        },
        {
          label: 'Aggressive',
          data: data.map((d) => d.aggressive),
          backgroundColor: '#f59e0b',
          borderColor: '#f59e0b',
          fill: chartType === 'bar',
        },
      ],
    }),
    [data, chartType],
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
    scales: {
      x: { title: { display: true, text: 'Year' } },
      y: { title: { display: true, text: 'Value ($)' } },
    },
  };

  return (
    <div className="w-full p-8">
      <h3 className="text-xl font-semibold mb-8 text-center">{title}</h3>
      <div style={{ width: '100%', height: '400px', backgroundColor: 'white' }}>
        {chartType === 'line' ? (
          <LinePlot data={chartData} options={options} style={{ width: '100%', height: '100%' }} />
        ) : (
          <BarPlot data={chartData} options={options} style={{ width: '100%', height: '100%' }} />
        )}
      </div>
    </div>
  );
};

const FiscalSustainabilityModel: React.FC = () => {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  const generateData = useMemo(() => (): ChartData[] => {
    const data: ChartData[] = [];
    const baseReturnRate = 0.0602;

    for (let i = 0; i < 12; i++) {
      const year = 2025 + i;
      const conservative = 150000 * (1 + baseReturnRate) ** i;
      const moderate = 250000 * (1 + baseReturnRate) ** i;
      const aggressive = 350000 * (1 + baseReturnRate) ** i;

      data.push({
        year,
        conservative: Math.max(100000, Math.round(conservative)),
        moderate: Math.max(100000, Math.round(moderate)),
        aggressive: Math.max(100000, Math.round(aggressive)),
      });
    }
    return data;
  }, []);

  const incomeData = useMemo(() => generateData(), [generateData]);
  const assetsData = useMemo(() => generateData(), [generateData]);
  const liabilitiesData = useMemo(() => generateData(), [generateData]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Container fluid className="py-12 mt-5">
        <h2 className="text-3xl font-bold text-center mb-12">
          Fiscal Sustainability Model
        </h2>

        <Row className="d-flex justify-content-center align-items-center mb-6">
          <Col md="auto" className="d-flex align-items-center mt-3 mb-5">
            <Form.Check
              type="switch"
              id="chartTypeToggle"
              className="me-2"
              checked={chartType === 'bar'}
              onChange={() => setChartType(chartType === 'line' ? 'bar' : 'line')}
            />
            <span>{chartType === 'bar' ? 'Show Line Graphs' : 'Show Bar Charts'}</span>
          </Col>
        </Row>

        <Row className="justify-content-around g-8">
          <Col md={3} className="mx-6">
            <ChartSection title="Income Forecast" data={incomeData} chartType={chartType} />
          </Col>
          <Col md={3} className="mx-6">
            <ChartSection title="Asset Forecast" data={assetsData} chartType={chartType} />
          </Col>
          <Col md={3} className="mx-6">
            <ChartSection title="Liability Forecast" data={liabilitiesData} chartType={chartType} />
          </Col>
        </Row>
      </Container>
    </Suspense>
  );
};

export default FiscalSustainabilityModel;
