'use client';

import { useState, ChangeEvent } from 'react';
import { Container, Row, Col, Form, Table, Card } from 'react-bootstrap';
import { formatCurrency } from '@/lib/mathUtils';
import CommonTabs from '@/components/CommonTabs';
import LinePlot from '@/components/LinePlot';

/**
 * Calculates the revenue rows for a given scenario.
 */
function getRevenueBreakdown(
  baseRevenue: number,
  growthRate: number,
  startYear: number,
  totalYears: number,
  dropPercent: number,
) {
  return Array.from({ length: totalYears }, (_, i) => {
    const year = startYear + i;
    const totalRevenue = baseRevenue * (1 + growthRate) ** i;
    const revenueDrop = totalRevenue * (dropPercent / 100);
    return {
      year,
      totalRevenue,
      revenueDrop,
    };
  });
}

/**
 * Computes residual/lost revenue effects year by year.
 */
function getResidualEffects(revenueData: Array<any>) {
  let cumulativeLost = 0;
  return revenueData.map((row) => {
    cumulativeLost += row.revenueDrop;
    return {
      year: row.year,
      lostThisYear: row.revenueDrop,
      cumulativeLost,
    };
  });
}

/**
 * StressTest2 calculates and displays a revenue drop scenario.
 */
const StressTest2 = () => {
  // Default values
  const [initialPercent, setInitialPercent] = useState<string>('2.25');
  const [baseRevenue, setBaseRevenue] = useState<string>('153034');
  const [growthRate, setGrowthRate] = useState<string>('0.015');
  const [startYear, setStartYear] = useState<string>('2025');
  const [totalYears, setTotalYears] = useState<string>('5');

  const [activeTab, setActiveTab] = useState<'stressEffects' | 'residualEffects'>('stressEffects');

  // Convert inputs to numbers
  const dropPercent = Number(initialPercent) || 0;
  const baseRevenueNum = Number(baseRevenue) || 0;
  const growthRateNum = Number(growthRate) || 0;
  const startYearNum = Number(startYear) || 0;
  const totalYearsNum = Number(totalYears) || 0;

  // Compute data arrays
  const revenueData = getRevenueBreakdown(
    baseRevenueNum,
    growthRateNum,
    startYearNum,
    totalYearsNum,
    dropPercent,
  );
  const residualData = getResidualEffects(revenueData);

  // Prepare line chart data for "stressEffects" tab
  const chartData = {
    labels: revenueData.map((row) => row.year.toString()),
    datasets: [
      {
        label: 'Total Revenue',
        data: revenueData.map((row) => row.totalRevenue),
        borderColor: 'green',
        fill: false,
        tension: 0.1,
      },
      {
        label: 'Revenue Drop',
        data: revenueData.map((row) => row.revenueDrop),
        borderColor: 'red',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  // Prepare line chart data for "residualEffects" tab
  const residualChartData = {
    labels: residualData.map((row) => row.year.toString()),
    datasets: [
      {
        label: 'Lost This Year',
        data: residualData.map((row) => row.lostThisYear),
        borderColor: 'blue',
        fill: false,
        tension: 0.1,
      },
      {
        label: 'Cumulative Lost',
        data: residualData.map((row) => row.cumulativeLost),
        borderColor: 'orange',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  // Helper for onChange
  const handleChange = (setter: (value: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
  };

  return (
    <Container>
      <h2 className="mb-4">Model Revenue Drop over Desired Period</h2>

      <Row className="my-3">
        <Col md={12}>
          <Form>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-2" controlId="initialPercent">
                  <Form.Label>Initial Percent Drop (%)</Form.Label>
                  <Form.Control
                    type="number"
                    value={initialPercent}
                    onChange={handleChange(setInitialPercent)}
                    placeholder="e.g., 2.25"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-2" controlId="baseRevenue">
                  <Form.Label>Base Revenue ($)</Form.Label>
                  <Form.Control
                    type="number"
                    value={baseRevenue}
                    onChange={handleChange(setBaseRevenue)}
                    placeholder="e.g., 153034"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-2" controlId="growthRate">
                  <Form.Label>Growth Rate (%)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.001"
                    value={growthRate}
                    onChange={handleChange(setGrowthRate)}
                    placeholder="e.g., 1.5"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-2" controlId="startYear">
                  <Form.Label>Start Year</Form.Label>
                  <Form.Control
                    type="number"
                    value={startYear}
                    onChange={handleChange(setStartYear)}
                    placeholder="e.g., 2025"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-2" controlId="totalYears">
                  <Form.Label>Total Years</Form.Label>
                  <Form.Control
                    type="number"
                    value={totalYears}
                    onChange={handleChange(setTotalYears)}
                    placeholder="e.g., 5"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>

      <CommonTabs
        defaultTab="stressEffects"
        onTabChange={(tab) => setActiveTab(tab === 'residualEffects' ? 'residualEffects' : 'stressEffects')}
      />

      {activeTab === 'stressEffects' ? (
        <>
          {/* Line Chart for Revenue Comparison */}
          <Row className="mb-4">
            <Col md={{ span: 8, offset: 2 }}>
              <Card>
                <Card.Body>
                  <Card.Title className="text-center">
                    Revenue Comparison
                  </Card.Title>
                  <LinePlot
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'top' },
                        title: {
                          display: true,
                          text: 'Yearly Revenue vs. Drop',
                        },
                      },
                      layout: {
                        padding: 10,
                      },
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: 'Year',
                          },
                        },
                        y: {
                          title: {
                            display: true,
                            text: 'Revenue ($)',
                          },
                        },
                      },
                    }}
                    style={{ minHeight: '450px', maxHeight: '650px' }}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Table for Stress Effects */}
          <Row className="my-3">
            <Col>
              <Table striped bordered>
                <thead>
                  <tr>
                    <th>Fiscal Year</th>
                    <th>Total Revenues</th>
                    <th>Decrease in Revenues</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueData.map((row) => (
                    <tr key={row.year}>
                      <td>{row.year}</td>
                      <td>{formatCurrency(row.totalRevenue)}</td>
                      <td>{formatCurrency(row.revenueDrop)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </>
      ) : (
        <>
          {/* Line Chart for Residual Effects */}
          <Row className="mb-4">
            <Col md={{ span: 8, offset: 2 }}>
              <Card>
                <Card.Body>
                  <Card.Title className="text-center">
                    Residual Effects: Lost Revenues
                  </Card.Title>
                  <LinePlot
                    data={residualChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'top' },
                        title: {
                          display: true,
                          text: 'Yearly Lost Revenue (This Year vs. Cumulative)',
                        },
                      },
                      layout: {
                        padding: 10,
                      },
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: 'Year',
                          },
                        },
                        y: {
                          title: {
                            display: true,
                            text: 'Revenue Lost ($)',
                          },
                        },
                      },
                    }}
                    style={{ minHeight: '450px', maxHeight: '650px' }}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Table for Residual Effects */}
          <Row className="my-3">
            <Col>
              <Table striped bordered>
                <thead>
                  <tr>
                    <th>Fiscal Year</th>
                    <th>Revenue Lost This Year</th>
                    <th>Cumulative Lost Revenues</th>
                  </tr>
                </thead>
                <tbody>
                  {residualData.map((row) => (
                    <tr key={row.year}>
                      <td>{row.year}</td>
                      <td>{formatCurrency(row.lostThisYear)}</td>
                      <td>{formatCurrency(row.cumulativeLost)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default StressTest2;
