'use client';

import React, { useState } from 'react';
import { Table, Container, Col, Row, Form, Tabs, Tab } from 'react-bootstrap';
import { formatCurrency } from '@/lib/mathUtils';

const generateData = (
  startYear: number,
  initialExpense: number,
  increaseRate: number,
) => Array.from({ length: 12 }, (_, i) => {
  const year = startYear + i;
  const expense = Math.round(initialExpense * (1 + increaseRate / 100) ** i);
  return { year, expense };
});

// TODO: Replace with real data.
const fakeData1 = generateData(2025, 1315, 2.5);
const fakeData2 = fakeData1.map(({ year, expense }, index) => ({
  year,
  principal: -expense,
  lostEarnings: -(index * 250),
  totalImpact: -expense - index * 250,
}));

const residualEffectsData = fakeData1.map(({ year, expense }, index) => ({
  year,
  principal: -expense,
  lostInterest: -(index * 80),
  totalLost: -(index * 80 + expense),
}));

const StressTest4: React.FC = () => {
  const [increaseRate, setIncreaseRate] = useState(2.5);
  const [returnRate, setReturnRate] = useState(6.02);
  const [initialExpense, setInitialExpense] = useState(1315);

  return (
    <Container className="my-4">
      <Tabs defaultActiveKey="stressEffects" id="effects-tabs">
        <Tab eventKey="stressEffects" title="Stress Effects">
          <Row className="mb-3">
            <Col md={6}>
              <h5>Operating Expense Increase Analysis</h5>
              <Form.Group as={Row} controlId="initialExpense">
                <Form.Label column sm={6}>
                  Initial Expense:
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="number"
                    value={initialExpense}
                    step="1"
                    onChange={(e) => setInitialExpense(parseFloat(e.target.value))}
                  />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="increaseRate">
                <Form.Label column sm={6}>
                  Annual Increase Rate:
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="number"
                    value={increaseRate}
                    step="0.1"
                    onChange={(e) => setIncreaseRate(parseFloat(e.target.value))}
                  />
                </Col>
              </Form.Group>
            </Col>

            <Col md={6}>
              <h5>Investment Analysis</h5>
              <Form.Group as={Row} controlId="returnRate">
                <Form.Label column sm={6}>
                  Annual Return Rate:
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="number"
                    value={returnRate}
                    step="0.1"
                    onChange={(e) => setReturnRate(parseFloat(e.target.value))}
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
                  {fakeData1.map(({ year, expense }) => (
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
                  {fakeData2.map(({ year, principal, lostEarnings, totalImpact }) => (
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
