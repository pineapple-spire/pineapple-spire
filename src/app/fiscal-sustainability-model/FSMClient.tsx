'use client';

import React, { Suspense, useMemo } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import LinePlot from '@/components/LinePlot';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ChartData {
  year: number;
  conservative: number;
  moderate: number;
  aggressive: number;
}

interface ChartSectionProps {
  title: string;
  data: ChartData[];
}

const ChartSection: React.FC<ChartSectionProps> = ({ title, data }) => {
  const chartData = useMemo(() => ({
    labels: data.map((d) => d.year.toString()),
    datasets: [
      {
        label: 'Conservative',
        data: data.map((d) => d.conservative),
        borderColor: '#3b82f6',
        fill: false,
        tension: 0.1,
      },
      {
        label: 'Moderate',
        data: data.map((d) => d.moderate),
        borderColor: '#10b981',
        fill: false,
        tension: 0.1,
      },
      {
        label: 'Aggressive',
        data: data.map((d) => d.aggressive),
        borderColor: '#f59e0b',
        fill: false,
        tension: 0.1,
      },
    ],
  }), [data]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
    scales: {
      x: { title: { display: true, text: 'Year' } },
      y: { title: { display: true, text: 'Value' } },
    },
  };

  return (
    <div className="w-full p-8">
      <h3 className="text-xl font-semibold mb-8 text-center">{title}</h3>
      <div style={{ width: '100%', height: '400px' }}>
        <LinePlot data={chartData} options={options} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
};

const FiscalSustainabilityModel: React.FC = () => {
  const generateData = (): ChartData[] => {
    const data: ChartData[] = [];
    for (let i = 0; i < 12; i++) {
      const year = 2025 + i;
      data.push({
        year,
        conservative: Math.round(100 + i * 15 + Math.random() * 20),
        moderate: Math.round(150 + i * 20 + Math.random() * 25),
        aggressive: Math.round(200 + i * 25 + Math.random() * 30),
      });
    }
    return data;
  };

  const [mounted, setMounted] = React.useState(false);
  const incomeData = useMemo(() => generateData(), []);
  const assetsData = useMemo(() => generateData(), []);
  const liabilitiesData = useMemo(() => generateData(), []);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Container fluid className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">
          Fiscal Sustainability Model
        </h2>
        <Row className="justify-content-around g-8">
          {[1, 2, 3].map((i) => (
            <Col key={i} md={3} className="mx-4">
              <LoadingSpinner />
            </Col>
          ))}
        </Row>
      </Container>
    );
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Container fluid className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">
          Fiscal Sustainability Model
        </h2>
        <Row className="justify-content-around g-8">
          <Col md={3} className="mx-6">
            <ChartSection title="Income Forecast" data={incomeData} />
          </Col>
          <Col md={3} className="mx-6">
            <ChartSection title="Asset Forecast" data={assetsData} />
          </Col>
          <Col md={3} className="mx-6">
            <ChartSection title="Liability Forecast" data={liabilitiesData} />
          </Col>
        </Row>
      </Container>
    </Suspense>
  );
};

export default FiscalSustainabilityModel;
