'use client';

import React, { Suspense } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
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

interface ChartSectionProps {
  title: string;
  data: ChartData[];
}

const ChartSection: React.FC<ChartSectionProps> = ({ title, data }) => (
  <div className="w-full p-8">
    <h3 className="text-xl font-semibold mb-8 text-center">{title}</h3>
    <div style={{ width: '100%', height: '400px' }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 20, right: 40, left: 40, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="conservative" stroke="#3b82f6" strokeWidth={2} />
          <Line type="monotone" dataKey="moderate" stroke="#10b981" strokeWidth={2} />
          <Line type="monotone" dataKey="aggressive" stroke="#f59e0b" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
  </div>
);

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
  const incomeData = React.useMemo(() => generateData(), []);
  const assetsData = React.useMemo(() => generateData(), []);
  const liabilitiesData = React.useMemo(() => generateData(), []);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Container fluid className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Fiscal Sustainability Model</h2>
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
        <h2 className="text-3xl font-bold text-center mb-12">Fiscal Sustainability Model</h2>
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
