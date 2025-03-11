'use client';

import React, { useState, useMemo } from 'react';
import { Table, Container, Col, Row, Form, Tabs, Tab } from 'react-bootstrap';
import { formatCurrency } from '@/lib/mathUtils';

// eslint-disable-next-line max-len
const generateData = (startYear: number, increaseRate: number, startExpense: number) => Array.from({ length: 12 }, (_, i) => {
  const year = startYear + i;
  const expense = Math.round(startExpense * (1 + increaseRate / 100) ** i);
  return { year, expense };
});

const StressTest4 = () => {
  const [increaseRate, setIncreaseRate] = useState(2.5);
  const [returnRate, setReturnRate] = useState(6.02);
  const [initialExpense, setInitialExpense] = useState(52589);

  const expenseData = useMemo(
    () => generateData(2025, increaseRate, 1315),
    [increaseRate],
  );
  const investmentData = useMemo(
    () => expenseData.map(({ year, expense }, index) => {
      const principal = -expense;
      const lostEarnings = Math.round(principal * ((1 + returnRate / 100) ** (index + 1) - 1));

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
      lostInterest: lostEarnings, // Match lost interest to lost earnings
      totalLost: principal + lostEarnings,
    })),
    [investmentData],
  );

  return (
    <Container className="my-4">
      <Tabs defaultActiveKey="stressEffects" id="effects-tabs">
        <Tab eventKey="stressEffects" title="Stress Effects">
          <Row className="mb-3">
            <Col md={6}>
              <h5>Operating Expense Increase Analysis</h5>
              <Form.Group as={Row}>
                <Form.Label column sm={6}>Initial Expense:</Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="number"
                    value={initialExpense}
                    onChange={(e) => setInitialExpense(parseFloat(e.target.value) || 0)}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row}>
                <Form.Label column sm={6}>Annual Increase Rate:</Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="number"
                    value={increaseRate}
                    onChange={(e) => setIncreaseRate(parseFloat(e.target.value) || 0)}
                  />
                </Col>
              </Form.Group>
            </Col>
            <Col md={6}>
              <h5>Investment Analysis</h5>
              <Form.Group as={Row}>
                <Form.Label column sm={6}>Annual Return Rate:</Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="number"
                    value={returnRate}
                    onChange={(e) => setReturnRate(parseFloat(e.target.value) || 0)}
                  />
                </Col>
              </Form.Group>
            </Col>
          </Row>
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
                      <td style={{ color: 'red' }}>{formatCurrency(expense)}</td>
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
                      <td style={{ color: 'red' }}>{formatCurrency(principal)}</td>
                      <td style={{ color: 'red' }}>{formatCurrency(lostEarnings)}</td>
                      <td style={{ color: 'red' }}>{formatCurrency(totalImpact)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Tab>
        <Tab eventKey="residualEffects" title="Residual Effects">
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
                  <td style={{ color: 'red' }}>{formatCurrency(principal)}</td>
                  <td style={{ color: 'red' }}>{formatCurrency(lostInterest)}</td>
                  <td style={{ color: 'red' }}>{formatCurrency(totalLost)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default StressTest4;
