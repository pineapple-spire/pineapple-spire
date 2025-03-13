'use client';

import { useState, ChangeEvent } from 'react';
import { Col, Container, Form, Row, Table } from 'react-bootstrap';
import { formatCurrency } from '@/lib/mathUtils';
import CommonTabs from '@/components/CommonTabs';

/* Stress Test 5 Component */
const StressTest5 = () => {
  // Default values matching Excel sheet
  const [presentValue, setPresentValue] = useState<number>(5000);
  const [interestRate, setInterestRate] = useState<number>(6.0); // Starts at 6% (user can change)
  const [term, setTerm] = useState<number>(30);

  // Track active tab
  const [activeTab, setActiveTab] = useState<'stressEffects' | 'residualEffects'>('stressEffects');

  // Handle input changes
  const handleChange = (setter: (value: number) => void) => (e: ChangeEvent<HTMLInputElement>) => {
    setter(parseFloat(e.target.value) || 0);
  };

  // Table 1: Stress Effects
  const calculateTableData = () => {
    let balance = presentValue;
    const rate = interestRate / 100;
    const rows = [];

    for (let year = 1; year <= term; year++) {
      const interestEarned = parseFloat((balance * rate).toFixed(2));
      balance = parseFloat((balance + interestEarned).toFixed(2));

      rows.push({
        year,
        balance: formatCurrency(balance),
        contribution: '$-', // No contributions
        interest: formatCurrency(interestEarned),
        total: formatCurrency(balance), // Balance after interest
      });
    }

    return rows;
  };

  // Table 2: Residual Effects
  const calculateResidualEffectsData = () => {
    let balance = presentValue;
    let cumulativeInterest = 0;
    const rate = interestRate / 100;
    const rows = [];

    for (let year = 1; year <= term; year++) {
      const interestEarned = parseFloat((balance * rate).toFixed(2));
      balance = parseFloat((balance + interestEarned).toFixed(2));
      cumulativeInterest += interestEarned;

      rows.push({
        year,
        principal: presentValue,
        annualReturnRate: `${interestRate.toFixed(2)}%`,
        lostEarningsForPrincipalCum: cumulativeInterest,
        totalInterestLostCum: cumulativeInterest,
      });
    }
    return rows;
  };

  return (
    <Container className="my-4">
      <h2>Decrease Bond Return Due to Increased Inflation</h2>
      <Row className="mb-3">
        <Form>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Present Value</Form.Label>
                <Form.Control
                  type="number"
                  value={presentValue}
                  onChange={handleChange(setPresentValue)}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Interest Rate (%)</Form.Label>
                <Form.Control
                  type="number"
                  value={interestRate}
                  onChange={handleChange(setInterestRate)}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Term (Years)</Form.Label>
                <Form.Control
                  type="number"
                  value={term}
                  onChange={handleChange(setTerm)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Row>

      <CommonTabs
        defaultTab="stressEffects"
        onTabChange={(tab) => setActiveTab(tab === 'residualEffects' ? 'residualEffects' : 'stressEffects')}
      />

      {activeTab === 'stressEffects' ? (
        <Row className="mb-3">
          <Col>
            <Table striped bordered hover className="mt-4">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Balance</th>
                  <th>Yearly Contribution</th>
                  <th>Interest Earned</th>
                  <th>Balance + Interest</th>
                </tr>
              </thead>
              <tbody>
                {calculateTableData().map((row) => (
                  <tr key={row.year}>
                    <td>{row.year}</td>
                    <td>{row.balance}</td>
                    <td>{row.contribution}</td>
                    <td>{row.interest}</td>
                    <td>{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      ) : (
        <Row className="mb-3">
          <Col>
            <h3>Residual Effects Table</h3>
            <Table striped bordered hover className="mt-4">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Principal</th>
                  <th>Annual Return Rate</th>
                  <th>Lost Earnings for Principal (Cumulative)</th>
                  <th>Total Interest Lost (Cumulative)</th>
                </tr>
              </thead>
              <tbody>
                {calculateResidualEffectsData().map((row) => (
                  <tr key={row.year}>
                    <td>{row.year}</td>
                    <td>{formatCurrency(row.principal)}</td>
                    <td>{row.annualReturnRate}</td>
                    <td>{formatCurrency(row.lostEarningsForPrincipalCum)}</td>
                    <td>{formatCurrency(row.totalInterestLostCum)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default StressTest5;
