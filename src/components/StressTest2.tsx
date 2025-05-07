'use client';

import React, { useState, ChangeEvent } from 'react';
import swal from 'sweetalert';
import {
  Container,
  Row,
  Col,
  Form,
  Table,
  Card,
  Button,
  Spinner,
} from 'react-bootstrap';
import { formatCurrency } from '@/lib/mathUtils';
import CommonTabs from '@/components/CommonTabs';
import LinePlot from '@/components/LinePlot';

/**
 * Calculates yearly revenue and drop.
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
    return { year, totalRevenue, revenueDrop };
  });
}

/**
 * Computes residual lost revenue cumulative.
 */
function getResidualEffects(
  revenueData: { year: number; totalRevenue: number; revenueDrop: number }[],
) {
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

const StressTest2: React.FC = () => {
  // Input states (strings to allow empty/invalid)
  const [initialPercent, setInitialPercent] = useState<string>('2.25');
  const [baseRevenue, setBaseRevenue] = useState<string>('153034');
  const [growthRate, setGrowthRate] = useState<string>('0.015');
  const [startYear, setStartYear] = useState<string>('2025');
  const [totalYears, setTotalYears] = useState<string>('5');

  // Tab saving state
  const [activeTab, setActiveTab] = useState<'stressEffects' | 'residualEffects'>(
    'stressEffects',
  );
  const [isSaving, setIsSaving] = useState(false);

  // Parse numbers
  const dropPercent = Number(initialPercent) || 0;
  const baseRevenueNum = Number(baseRevenue) || 0;
  const growthRateNum = Number(growthRate) || 0;
  const startYearNum = Number(startYear) || 0;
  const totalYearsNum = Number(totalYears) || 0;

  // Data arrays
  const revenueData = getRevenueBreakdown(
    baseRevenueNum,
    growthRateNum,
    startYearNum,
    totalYearsNum,
    dropPercent,
  );
  const residualData = getResidualEffects(revenueData);

  // Chart configs
  const chartData = {
    labels: revenueData.map((r) => r.year.toString()),
    datasets: [
      {
        label: 'Total Revenue',
        data: revenueData.map((r) => r.totalRevenue),
        borderColor: 'green',
        fill: false,
        tension: 0.1,
      },
      {
        label: 'Revenue Drop',
        data: revenueData.map((r) => r.revenueDrop),
        borderColor: 'red',
        fill: false,
        tension: 0.1,
      },
    ],
  };
  const residualChartData = {
    labels: residualData.map((r) => r.year.toString()),
    datasets: [
      {
        label: 'Lost This Year',
        data: residualData.map((r) => r.lostThisYear),
        borderColor: 'blue',
        fill: false,
        tension: 0.1,
      },
      {
        label: 'Cumulative Lost',
        data: residualData.map((r) => r.cumulativeLost),
        borderColor: 'orange',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const onChange = (setter: (v: string) => void) => (e: ChangeEvent<HTMLInputElement>) => setter(e.target.value);
  const handleSave = async () => {
    const title = await swal({
      text: 'Enter a title for this scenario (this will be used for version selection):',
      content: {
        element: 'input',
      },
      buttons: ['Cancel', 'Save'],
    });
    if (!title) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/stress-test/2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          initialPercent: dropPercent,
          baseRevenue: baseRevenueNum,
          growthRate: growthRateNum,
          startYear: startYearNum,
          totalYears: totalYearsNum,
        }),
      });
      if (!res.ok) throw new Error();
      await res.json();
      swal('Saved', 'Scenario saved successfully!', 'success', { timer: 2000 });
    } catch {
      swal('Error', 'Failed to save scenario.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container className="my-4">
      <h2 className="mb-4">Model Revenue Drop over Desired Period</h2>

      {/* Input form */}
      <Form>
        <Row className="g-3 mb-3">
          <Col md={4}>
            <Form.Group controlId="initialPercent">
              <Form.Label>Initial Percent Drop (%)</Form.Label>
              <Form.Control
                type="number"
                value={initialPercent}
                onChange={onChange(setInitialPercent)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="baseRevenue">
              <Form.Label>Base Revenue ($)</Form.Label>
              <Form.Control
                type="number"
                value={baseRevenue}
                onChange={onChange(setBaseRevenue)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="growthRate">
              <Form.Label>Growth Rate (%)</Form.Label>
              <Form.Control
                type="number"
                step="0.001"
                value={growthRate}
                onChange={onChange(setGrowthRate)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="g-3 mb-4">
          <Col md={6}>
            <Form.Group controlId="startYear">
              <Form.Label>Start Year</Form.Label>
              <Form.Control
                type="number"
                value={startYear}
                onChange={onChange(setStartYear)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="totalYears">
              <Form.Label>Total Years</Form.Label>
              <Form.Control
                type="number"
                value={totalYears}
                onChange={onChange(setTotalYears)}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>

      {/* Tabs */}
      <CommonTabs
        defaultTab="stressEffects"
        onTabChange={(tab) => setActiveTab(tab === 'residualEffects' ? 'residualEffects' : 'stressEffects')}
      />

      {/* Save button */}
      <Row className="mb-3 mt-3">
        <Col xs={12}>
          <Button
            variant="success"
            onClick={handleSave}
            disabled={isSaving}
            className="w-100"
          >
            {isSaving
              ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  {' '}
                  Saving...
                </>
              )
              : 'Save Scenario'}
          </Button>
        </Col>
      </Row>

      {/* Content */}
      {activeTab === 'stressEffects' ? (
        <>
          {/* Chart */}
          <Row className="mb-4">
            <Col md={{ span: 8, offset: 2 }}>
              <Card>
                <Card.Body>
                  <Card.Title className="text-center">Revenue Comparison</Card.Title>
                  <LinePlot
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: 'Yearly Revenue vs. Drop' },
                      },
                      scales: {
                        x: { title: { display: true, text: 'Year' } },
                        y: { title: { display: true, text: 'Revenue ($)' } },
                      },
                    }}
                    style={{ minHeight: '450px', maxHeight: '650px' }}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Table */}
          <Row className="mb-4">
            <Col>
              <Table striped bordered>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Total Revenue</th>
                    <th>Drop This Year</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueData.map((r) => (
                    <tr key={r.year}>
                      <td>{r.year}</td>
                      <td>{formatCurrency(r.totalRevenue)}</td>
                      <td>{formatCurrency(r.revenueDrop)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </>
      ) : (
        <>
          {/* Residual Chart */}
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
                          text: 'Yearly Lost Revenue & Cumulative',
                        },
                      },
                      scales: {
                        x: { title: { display: true, text: 'Year' } },
                        y: { title: { display: true, text: 'Revenue Lost ($)' } },
                      },
                    }}
                    style={{ minHeight: '450px', maxHeight: '650px' }}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Residual Table */}
          <Row className="mb-4">
            <Col>
              <Table striped bordered>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Lost This Year</th>
                    <th>Cumulative Lost</th>
                  </tr>
                </thead>
                <tbody>
                  {residualData.map((r) => (
                    <tr key={r.year}>
                      <td>{r.year}</td>
                      <td>{formatCurrency(r.lostThisYear)}</td>
                      <td>{formatCurrency(r.cumulativeLost)}</td>
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
