'use client';

import React, { useState, useMemo, ChangeEvent } from 'react';
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

const StressTest4: React.FC = () => {
  // Inputs
  const [initialExpense, setInitialExpense] = useState<number>(52589);
  const [increaseRate, setIncreaseRate] = useState<number>(2.5);
  const [returnRate, setReturnRate] = useState<number>(6.02);

  // UI State
  const [activeTab, setActiveTab] = useState<'stressEffects' | 'residualEffects'>(
    'stressEffects',
  );
  const [isSaving, setIsSaving] = useState(false);
  const handleValueChange = (
    setter: (val: number) => void,
  ) => (
    e: ChangeEvent<HTMLInputElement>,
  ) => setter(parseFloat(e.target.value) || 0);

  // Computed data
  const expenseData = useMemo(
    () => generateData(2025, increaseRate, initialExpense),
    [increaseRate, initialExpense],
  );

  const investmentData = useMemo(
    () => expenseData.map(({ year, expense }, idx) => {
      const principal = -expense;
      const lostEarnings = Math.round(
        principal * ((1 + returnRate / 100) ** (idx + 1) - 1),
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

  const residualEffectsData = useMemo(
    () => investmentData.map(({ year, principal, lostEarnings }) => ({
      year,
      principal,
      lostInterest: lostEarnings,
      totalLost: principal + lostEarnings,
    })),
    [investmentData],
  );

  const stressEffectsChartData = useMemo(
    () => ({
      labels: expenseData.map((d) => d.year.toString()),
      datasets: [
        {
          label: 'Increase in Expenses',
          data: expenseData.map((d) => d.expense),
          borderColor: 'red',
          fill: false,
          tension: 0.1,
        },
        {
          label: 'Total Impact',
          data: investmentData.map((d) => d.totalImpact),
          borderColor: 'green',
          fill: false,
          tension: 0.1,
        },
      ],
    }),
    [expenseData, investmentData],
  );

  const residualChartData = useMemo(
    () => ({
      labels: residualEffectsData.map((d) => d.year.toString()),
      datasets: [
        {
          label: 'Lost Interest',
          data: residualEffectsData.map((d) => d.lostInterest),
          borderColor: 'blue',
          fill: false,
          tension: 0.1,
        },
        {
          label: 'Total Interests Lost',
          data: residualEffectsData.map((d) => d.totalLost),
          borderColor: 'orange',
          fill: false,
          tension: 0.1,
        },
      ],
    }),
    [residualEffectsData],
  );

  // === Save Scenario Handler ===
  const handleSave = async () => {
    const title = (await swal({
      text: 'Enter a title for this scenario (this will be used for version selection):',
      content: {
        element: 'input',
        attributes: {
          placeholder: 'Scenario Title',
          type: 'text',
        },
      },
      buttons: ['Cancel', 'Save'],
    })) as string;
    if (!title) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/stress-test/4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          initialExpense,
          increaseRate,
          returnRate,
        }),
      });
      if (!res.ok) throw new Error();
      await res.json();
      swal('Saved!', 'Scenario saved successfully.', 'success');
    } catch (err) {
      console.error(err);
      swal('Error', 'Failed to save scenario.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container className="my-4">
      {/* Inputs */}
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group controlId="initialExpense">
            <Form.Label>Initial Expense</Form.Label>
            <Form.Control
              type="number"
              value={initialExpense}
              onChange={handleValueChange(setInitialExpense)}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="increaseRate">
            <Form.Label>Annual Increase Rate (%)</Form.Label>
            <Form.Control
              type="number"
              value={increaseRate}
              onChange={handleValueChange(setIncreaseRate)}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="returnRate">
            <Form.Label>Annual Return Rate (%)</Form.Label>
            <Form.Control
              type="number"
              value={returnRate}
              onChange={handleValueChange(setReturnRate)}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Tabs */}
      <CommonTabs
        defaultTab="stressEffects"
        onTabChange={(tab) => setActiveTab(
          tab === 'residualEffects' ? 'residualEffects' : 'stressEffects',
        )}
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
          {/* Stress Effects Chart */}
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
                          text: 'Expenses & Impact Over Time',
                        },
                      },
                      scales: {
                        x: { title: { display: true, text: 'Year' } },
                        y: { title: { display: true, text: 'Amount ($)' } },
                      },
                    }}
                    style={{ minHeight: '450px', maxHeight: '650px' }}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Stress Effects Tables */}
          <Row>
            <Col md={6}>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Expense</th>
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
                  {investmentData.map(
                    ({ year, principal, lostEarnings, totalImpact }) => (
                      <tr key={year}>
                        <td>{year}</td>
                        <td>{formatCurrency(principal)}</td>
                        <td>{formatCurrency(lostEarnings)}</td>
                        <td>{formatCurrency(totalImpact)}</td>
                      </tr>
                    ),
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
        </>
      ) : (
        <>
          {/* Residual Effects Chart */}
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
                          text: 'Lost Interest vs Total Lost',
                        },
                      },
                      scales: {
                        x: { title: { display: true, text: 'Year' } },
                        y: { title: { display: true, text: 'Amount ($)' } },
                      },
                    }}
                    style={{ minHeight: '450px', maxHeight: '650px' }}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Residual Effects Table */}
          <Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Principal</th>
                  <th>Lost Interest</th>
                  <th>Total Lost</th>
                </tr>
              </thead>
              <tbody>
                {residualEffectsData.map(
                  ({ year, principal, lostInterest, totalLost }) => (
                    <tr key={year}>
                      <td>{year}</td>
                      <td>{formatCurrency(principal)}</td>
                      <td>{formatCurrency(lostInterest)}</td>
                      <td>{formatCurrency(totalLost)}</td>
                    </tr>
                  ),
                )}
              </tbody>
            </Table>
          </Row>
        </>
      )}
    </Container>
  );
};

export default StressTest4;
