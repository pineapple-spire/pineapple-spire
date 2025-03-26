'use client';

import React, { useState, useMemo, ChangeEvent } from 'react';
import { Container, Row, Col, Form, Table, Card } from 'react-bootstrap';
import { formatCurrency } from '@/lib/mathUtils';
import CommonTabs from '@/components/CommonTabs';
import LinePlot from '@/components/LinePlot';

// Generates expense data for 12 consecutive years starting from startYear.
const generateData = (
  startYear: number,
  increaseRate: number,
  startExpense: number,
) => Array.from({ length: 12 }, (_, i) => {
  const year = startYear + i;
  const expense = Math.round(startExpense * (1 + increaseRate / 100) ** i);
  return { year, expense };
});

const StressTest4 = () => {
  const [increaseRate, setIncreaseRate] = useState(2.5);
  const [returnRate, setReturnRate] = useState(6.02);
  const [initialExpense, setInitialExpense] = useState(52589);

  const [activeTab, setActiveTab] = useState<'stressEffects' | 'residualEffects'>('stressEffects');

  const handleValueChange = (setter: (val: number) => void) => (e: ChangeEvent<HTMLInputElement>) => {
    setter(parseFloat(e.target.value) || 0);
  };

  const expenseData = useMemo(
    () => generateData(2025, increaseRate, 1315),
    [increaseRate],
  );

  // Calculate investment data based on expenseData.
  const investmentData = useMemo(
    () => expenseData.map(({ year, expense }, index) => {
      const principal = -expense;
      const lostEarnings = Math.round(
        principal * ((1 + returnRate / 100) ** (index + 1) - 1),
      );
      return {
        year,
        principal,
        lostEarnings,
        totalImpact: principal + lostEarnings,
      };
    }),
    [expenseData, returnRate],
  );

  // Residual effects data derived from investmentData.
  const residualEffectsData = useMemo(
    () => investmentData.map(({ year, principal, lostEarnings }) => ({
      year,
      principal,
      lostInterest: lostEarnings,
      totalLost: principal + lostEarnings,
    })),
    [investmentData],
  );

  // Prepare chart data for "stressEffects" tab.
  // It shows two datasets: Increase in Expenses and Total Impact.
  const stressEffectsChartData = useMemo(
    () => ({
      labels: expenseData.map(({ year }) => year.toString()),
      datasets: [
        {
          label: 'Increase in Expenses',
          data: expenseData.map(({ expense }) => expense),
          borderColor: 'red',
          fill: false,
          tension: 0.1,
        },
        {
          label: 'Total Impact (Investment)',
          data: investmentData.map(({ totalImpact }) => totalImpact),
          borderColor: 'green',
          fill: false,
          tension: 0.1,
        },
      ],
    }),
    [expenseData, investmentData],
  );

  // Prepare chart data for "residualEffects" tab.
  const residualChartData = useMemo(
    () => ({
      labels: residualEffectsData.map(({ year }) => year.toString()),
      datasets: [
        {
          label: 'Lost Interest',
          data: residualEffectsData.map(({ lostInterest }) => lostInterest),
          borderColor: 'blue',
          fill: false,
          tension: 0.1,
        },
        {
          label: 'Total Interests Lost',
          data: residualEffectsData.map(({ totalLost }) => totalLost),
          borderColor: 'orange',
          fill: false,
          tension: 0.1,
        },
      ],
    }),
    [residualEffectsData],
  );

  return (
    <Container className="my-4">
      <Row className="mb-3">
        <Col md={6}>
          <h5>Operating Expense Increase Analysis</h5>
          <Form.Group as={Row} className="mb-2">
            <Form.Label column sm={6}>Initial Expense:</Form.Label>
            <Col sm={6}>
              <Form.Control
                type="number"
                value={initialExpense}
                onChange={handleValueChange(setInitialExpense)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-2">
            <Form.Label column sm={6}>Annual Increase Rate:</Form.Label>
            <Col sm={6}>
              <Form.Control
                type="number"
                value={increaseRate}
                onChange={handleValueChange(setIncreaseRate)}
              />
            </Col>
          </Form.Group>
        </Col>

        <Col md={6}>
          <h5>Investment Analysis</h5>
          <Form.Group as={Row} className="mb-2">
            <Form.Label column sm={6}>Annual Return Rate:</Form.Label>
            <Col sm={6}>
              <Form.Control
                type="number"
                value={returnRate}
                onChange={handleValueChange(setReturnRate)}
              />
            </Col>
          </Form.Group>
        </Col>
      </Row>

      <CommonTabs
        defaultTab="stressEffects"
        onTabChange={(tab) => setActiveTab(tab === 'residualEffects' ? 'residualEffects' : 'stressEffects')}
      />

      {activeTab === 'stressEffects' ? (
        <>
          {/* Line Chart for Stress Effects */}
          <Row className="mb-4">
            <Col md={{ span: 8, offset: 2 }}>
              <Card>
                <Card.Body>
                  <Card.Title className="text-center">
                    Yearly Increase in Expenses vs Total Impact
                  </Card.Title>
                  <LinePlot
                    data={stressEffectsChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'top' },
                        title: {
                          display: true,
                          text: 'Yearly Expenses & Impact',
                        },
                      },
                      layout: { padding: 10 },
                      scales: {
                        x: { title: { display: true, text: 'Fiscal Year' } },
                        y: { title: { display: true, text: 'Amount ($)' } },
                      },
                    }}
                    style={{ minHeight: '450px', maxHeight: '650px' }}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Tables for Stress Effects */}
          <Row>
            <Col md={6}>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Fiscal Year</th>
                    <th>Increase in Expenses</th>
                  </tr>
                </thead>
                <tbody>
                  {expenseData.map(({ year, expense }) => (
                    <tr key={year}>
                      <td>{year}</td>
                      <td>{formatCurrency(expense)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
            <Col md={6}>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Principal</th>
                    <th>Lost Earnings</th>
                    <th>Total Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {investmentData.map(({ year, principal, lostEarnings, totalImpact }) => (
                    <tr key={year}>
                      <td>{year}</td>
                      <td>{formatCurrency(principal)}</td>
                      <td>{formatCurrency(lostEarnings)}</td>
                      <td>{formatCurrency(totalImpact)}</td>
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
                    Residual Effects Analysis
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
                          text: 'Yearly Lost Interest vs Total Interests Lost',
                        },
                      },
                      layout: { padding: 10 },
                      scales: {
                        x: { title: { display: true, text: 'Fiscal Year' } },
                        y: { title: { display: true, text: 'Amount ($)' } },
                      },
                    }}
                    style={{ minHeight: '450px', maxHeight: '650px' }}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Table for Residual Effects */}
          <Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Fiscal Year</th>
                  <th>Principal</th>
                  <th>Lost Interest</th>
                  <th>Total Interests Lost</th>
                </tr>
              </thead>
              <tbody>
                {residualEffectsData.map(({ year, principal, lostInterest, totalLost }) => (
                  <tr key={year}>
                    <td>{year}</td>
                    <td>{formatCurrency(principal)}</td>
                    <td>{formatCurrency(lostInterest)}</td>
                    <td>{formatCurrency(totalLost)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Row>
        </>
      )}
    </Container>
  );
};

export default StressTest4;
