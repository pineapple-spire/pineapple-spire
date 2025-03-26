'use client';

import React, { Suspense, useMemo, useState } from 'react';
import { Container, Col, Row, Form } from 'react-bootstrap';
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
      x: {
        title: { display: true, text: 'Year' },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      y: {
        title: { display: true, text: 'Value ($)' },
        ticks: {
          callback: (value: number) => `$${(value / 1000).toFixed(0)}K`,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
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
  // State for stress test toggles
  const [stressTestToggles, setStressTestToggles] = useState({
    stressTest1: false,
    stressTest2: false,
    stressTest3: false,
    stressTest4: false,
    stressTest5: false,
  });

  const [mounted, setMounted] = React.useState(false);

  const generateData = useMemo(() => (): ChartData[] => {
    const data: ChartData[] = [];

    // Base annual return rate (before stress tests)
    const baseReturnRate = 0.0602; // 6.02% annual return

    for (let i = 0; i < 12; i++) {
      const year = 2025 + i;

      // Start with base values - reduced for better visibility of changes
      let conservative = 150000;
      let moderate = 250000;
      let aggressive = 350000;

      // Apply cumulative growth before stress tests
      conservative *= (1 + baseReturnRate) ** i;
      moderate *= (1 + baseReturnRate) ** i;
      aggressive *= (1 + baseReturnRate) ** i;

      // Apply stress test effects if toggled
      if (stressTestToggles.stressTest1) {
        // Investment drop effect (30% drop in returns)
        const reducedReturnRate = baseReturnRate * 0.7;
        conservative = 150000 * (1 + reducedReturnRate) ** i;
        moderate = 250000 * (1 + reducedReturnRate) ** i;
        aggressive = 350000 * (1 + reducedReturnRate) ** i;
      }

      if (stressTestToggles.stressTest2) {
        // Revenue drop effect (2.25% drop)
        const dropRate = 0.0225;
        conservative *= (1 - dropRate);
        moderate *= (1 - dropRate);
        aggressive *= (1 - dropRate);
      }

      if (stressTestToggles.stressTest3) {
        // One-time event effect ($50,000) with compounding lost earnings
        const oneTimeEvent = 50000;

        if (i === 0) {
          // Initial impact
          conservative -= oneTimeEvent;
          moderate -= oneTimeEvent;
          aggressive -= oneTimeEvent;
        }

        // Lost earnings from the one-time event
        const lostEarnings = oneTimeEvent * ((1 + baseReturnRate) ** i - 1);
        conservative -= lostEarnings;
        moderate -= lostEarnings;
        aggressive -= lostEarnings;
      }

      if (stressTestToggles.stressTest4) {
        // Operating expense increase effect (2.5% annual increase)
        const baseExpense = 10000; // Increased base expense for more visible impact
        const increaseRate = 0.025;
        const expenseIncrease = baseExpense * (1 + increaseRate) ** i;

        // Compound the impact of increased expenses
        const lostEarnings = expenseIncrease * ((1 + baseReturnRate) ** i - 1);
        conservative -= (expenseIncrease + lostEarnings);
        moderate -= (expenseIncrease + lostEarnings);
        aggressive -= (expenseIncrease + lostEarnings);
      }

      if (stressTestToggles.stressTest5) {
        // Bond return decrease effect (6% to 4.2%, 30% drop)
        const reducedReturnRate = baseReturnRate * 0.7;
        conservative = 150000 * (1 + reducedReturnRate) ** i;
        moderate = 250000 * (1 + reducedReturnRate) ** i;
        aggressive = 350000 * (1 + reducedReturnRate) ** i;
      }

      data.push({
        year,
        conservative: Math.max(100000, Math.round(conservative)), // Set minimum to 100K
        moderate: Math.max(100000, Math.round(moderate)),
        aggressive: Math.max(100000, Math.round(aggressive)),
      });
    }
    return data;
  }, [stressTestToggles]);

  const incomeData = useMemo(() => generateData(), [generateData]);
  const assetsData = useMemo(() => generateData(), [generateData]);
  const liabilitiesData = useMemo(() => generateData(), [generateData]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggleChange = (test: keyof typeof stressTestToggles) => {
    setStressTestToggles(prev => ({
      ...prev,
      [test]: !prev[test],
    }));
  };

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

        {/* Stress Test Toggles */}
        <Row className="mb-6">
          <Col md={12}>
            <div className="d-flex flex-wrap gap-4 justify-content-center">
              <Form.Check
                type="switch"
                id="stressTest1"
                label="Investment Drop (30%)"
                checked={stressTestToggles.stressTest1}
                onChange={() => handleToggleChange('stressTest1')}
              />
              <Form.Check
                type="switch"
                id="stressTest2"
                label="Revenue Drop (2.25%)"
                checked={stressTestToggles.stressTest2}
                onChange={() => handleToggleChange('stressTest2')}
              />
              <Form.Check
                type="switch"
                id="stressTest3"
                label="One-time Event ($50k)"
                checked={stressTestToggles.stressTest3}
                onChange={() => handleToggleChange('stressTest3')}
              />
              <Form.Check
                type="switch"
                id="stressTest4"
                label="Operating Expense Increase"
                checked={stressTestToggles.stressTest4}
                onChange={() => handleToggleChange('stressTest4')}
              />
              <Form.Check
                type="switch"
                id="stressTest5"
                label="Bond Return Decrease"
                checked={stressTestToggles.stressTest5}
                onChange={() => handleToggleChange('stressTest5')}
              />
            </div>
          </Col>
        </Row>

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
