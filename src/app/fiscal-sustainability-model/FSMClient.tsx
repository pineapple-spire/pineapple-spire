'use client';

import React, { Suspense, useMemo, useState, useEffect } from 'react';
import { Container, Col, Row, Form } from 'react-bootstrap';
import LinePlot from '@/components/LinePlot';
import BarPlot from '@/components/BarPlot';
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
  chartType: 'line' | 'bar';
}

const ChartSection: React.FC<ChartSectionProps> = ({ title, data, chartType }) => {
  const chartData = useMemo(() => ({
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
  }), [data, chartType]);

  const yValues = data.flatMap(d => [d.conservative, d.moderate, d.aggressive]);
  const minY = Math.max(0, Math.min(...yValues) * 0.75);
  const maxY = Math.max(...yValues) * 1.25;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
    scales: {
      x: {
        title: { display: true, text: 'Year' },
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
      },
      y: {
        title: { display: true, text: 'Value ($)' },
        min: minY,
        max: maxY,
        ticks: {
          callback: (value: number) => `$${(value / 1000).toFixed(0)}K`,
          stepSize: Math.ceil((maxY - minY) / 5 / 10000) * 10000,
        },
        grid: { color: 'rgba(0, 0, 0, 0.1)' },
      },
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
  const [mounted, setMounted] = useState(false);
  const [stressTestToggles, setStressTestToggles] = useState({
    stressTest1: false, // Investment Crash
    stressTest2: false, // Revenue Drop
    stressTest3: false, // One-time Loss
    stressTest4: false, // Operating Expense Surge
    stressTest5: false, // Bond Return Cut
  });

  const generateData = useMemo(() => (): ChartData[] => {
    const data: ChartData[] = [];
    const baseReturnRate = 0.0602;

    for (let i = 0; i < 12; i++) {
      const year = 2025 + i;
      let conservative = 150000 * (1 + baseReturnRate) ** i;
      let moderate = 250000 * (1 + baseReturnRate) ** i;
      let aggressive = 350000 * (1 + baseReturnRate) ** i;

      if (stressTestToggles.stressTest1 || stressTestToggles.stressTest5) {
        const reducedRate = baseReturnRate * 0.25; // 🔻 75% drop
        conservative = 150000 * (1 + reducedRate) ** i;
        moderate = 250000 * (1 + reducedRate) ** i;
        aggressive = 350000 * (1 + reducedRate) ** i;
      }

      if (stressTestToggles.stressTest2) {
        const dropRate = 0.1; // 🔻 10%
        conservative *= (1 - dropRate);
        moderate *= (1 - dropRate);
        aggressive *= (1 - dropRate);
      }

      if (stressTestToggles.stressTest3) {
        const oneTimeEvent = 100000; // 💥
        if (i === 0) {
          conservative -= oneTimeEvent;
          moderate -= oneTimeEvent;
          aggressive -= oneTimeEvent;
        }
        const lostEarnings = oneTimeEvent * ((1 + baseReturnRate) ** i - 1);
        conservative -= lostEarnings;
        moderate -= lostEarnings;
        aggressive -= lostEarnings;
      }

      if (stressTestToggles.stressTest4) {
        const baseExpense = 25000;
        const increaseRate = 0.10; // 🔺 10%
        const expenseIncrease = baseExpense * (1 + increaseRate) ** i;
        const lostEarnings = expenseIncrease * ((1 + baseReturnRate) ** i - 1);
        conservative -= (expenseIncrease + lostEarnings);
        moderate -= (expenseIncrease + lostEarnings);
        aggressive -= (expenseIncrease + lostEarnings);
      }

      data.push({
        year,
        conservative: Math.max(100000, Math.round(conservative)),
        moderate: Math.max(100000, Math.round(moderate)),
        aggressive: Math.max(100000, Math.round(aggressive)),
      });
    }

    return data;
  }, [stressTestToggles]);

  const incomeData = useMemo(() => generateData(), [generateData]);
  const assetsData = useMemo(() => generateData(), [generateData]);
  const liabilitiesData = useMemo(() => generateData(), [generateData]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggleChange = (key: keyof typeof stressTestToggles) => {
    setStressTestToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

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
      <Container fluid className="py-12 mt-5">
        <h2 className="text-3xl font-bold text-center mb-12">Fiscal Sustainability Model</h2>

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

        <Row className="mb-6">
          <Col md={12}>
            <div className="d-flex flex-wrap gap-4 justify-content-center">
              <Form.Check
                type="switch"
                id="stressTest1"
                label="Stress Test 1"
                checked={stressTestToggles.stressTest1}
                onChange={() => handleToggleChange('stressTest1')}
              />
              <Form.Check
                type="switch"
                id="stressTest2"
                label="Stress Test 2"
                checked={stressTestToggles.stressTest2}
                onChange={() => handleToggleChange('stressTest2')}
              />
              <Form.Check
                type="switch"
                id="stressTest3"
                label="Stress Test 3"
                checked={stressTestToggles.stressTest3}
                onChange={() => handleToggleChange('stressTest3')}
              />
              <Form.Check
                type="switch"
                id="stressTest4"
                label="Stress Test 4"
                checked={stressTestToggles.stressTest4}
                onChange={() => handleToggleChange('stressTest4')}
              />
              <Form.Check
                type="switch"
                id="stressTest5"
                label="Stress Test 5"
                checked={stressTestToggles.stressTest5}
                onChange={() => handleToggleChange('stressTest5')}
              />
            </div>
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
