'use client';

import React, { useState, useMemo, ChangeEvent } from 'react';
import { Container, Row, Col, Form, Table } from 'react-bootstrap';
import { formatCurrency } from '@/lib/mathUtils';
import CommonTabs from '@/components/CommonTabs';

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

  // Generate expense data
  const expenseData = useMemo(
    () => generateData(2025, increaseRate, 1315),
    [increaseRate],
  );

  // Calculate investment data based on expenseData
  const investmentData = useMemo(() => expenseData.map(({ year, expense }, index) => {
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
  }), [expenseData, returnRate]);

  // Residual effects from investmentData
  const residualEffectsData = useMemo(() => investmentData.map(({ year, principal, lostEarnings }) => ({
    year,
    principal,
    lostInterest: lostEarnings,
    totalLost: principal + lostEarnings,
  })), [investmentData]);

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
      ) : (
        <>
          <h5 className="mt-3">Residual Effects Analysis</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Year</th>
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
        </>
      )}
    </Container>
  );
};

export default StressTest4;
