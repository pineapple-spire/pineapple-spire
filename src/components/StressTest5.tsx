'use client';

import { useState, useMemo, ChangeEvent } from 'react';
import { Col, Container, Form, Row, Table, Card } from 'react-bootstrap';
import { formatCurrency } from '@/lib/mathUtils';
import CommonTabs from '@/components/CommonTabs';
import LinePlot from '@/components/LinePlot';

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

  // Calculate table data for Stress Effects (using formatted values)
  const calculateTableData = () => {
    const rate = interestRate / 100;
    let balance = presentValue; // Start with the initial present value
    const rows = [];

    for (let year = 1; year <= term; year++) {
      const interestEarned = parseFloat((balance * rate).toFixed(2)); // Calculate interest based on current balance
      const total = parseFloat((balance + interestEarned).toFixed(2)); // Calculate balance + interest
      rows.push({
        year,
        balance: formatCurrency(balance), // Current balance
        contribution: '$-', // No contributions
        interest: formatCurrency(interestEarned), // Interest earned
        total: formatCurrency(total), // Balance + interest
      });
      balance = parseFloat((balance - interestEarned).toFixed(2)); // Decrease balance by interest earned
    }

    return rows;
  };

  // Calculate table data for Residual Effects (using formatted values)
  const calculateResidualEffectsData = (initialValue: number) => {
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
        principal: initialValue,
        annualReturnRate: `${interestRate.toFixed(2)}%`,
        lostEarningsForPrincipalCum: cumulativeInterest,
        totalInterestLostCum: cumulativeInterest,
      });
    }
    return rows;
  };

  // Compute raw data for charting in Stress Effects tab (for balance & annual interest)
  const stressEffectsRawData = useMemo(() => {
    const rate = interestRate / 100;
    let balance = presentValue; // Start with the initial present value
    const result = [];

    for (let year = 1; year <= term; year++) {
      const interestEarned = parseFloat((balance * rate).toFixed(2)); // Calculate interest based on current balance
      result.push({ year, balance, interestEarned }); // Push the current balance and interest earned
      balance = parseFloat((balance - interestEarned).toFixed(2)); // Decrease balance by interest earned
    }

    return result;
  }, [presentValue, interestRate, term]);

  // Prepare chart data for the Stress Effects tab
  const stressEffectsChartData = useMemo(() => ({
    labels: stressEffectsRawData.map(({ year }) => year.toString()),
    datasets: [
      {
        label: 'Balance',
        data: stressEffectsRawData.map(({ balance }) => balance),
        borderColor: 'green',
        fill: false,
        tension: 0.1,
      },
      {
        label: 'Interest Earned',
        data: stressEffectsRawData.map(({ interestEarned }) => interestEarned),
        borderColor: 'red',
        fill: false,
        tension: 0.1,
      },
    ],
  }), [stressEffectsRawData]);

  // Compute raw data for charting in Residual Effects tab (cumulative interest)
  const residualEffectsRawData = useMemo(() => {
    let balance = presentValue;
    let cumulativeInterest = 0;
    const rate = interestRate / 100;
    const result = [];
    for (let year = 1; year <= term; year++) {
      const interestEarned = balance * rate;
      balance += interestEarned;
      cumulativeInterest += interestEarned;
      result.push({ year, cumulativeInterest });
    }
    return result;
  }, [presentValue, interestRate, term]);

  // Prepare chart data for the Residual Effects tab
  const residualEffectsChartData = useMemo(() => ({
    labels: residualEffectsRawData.map(({ year }) => year.toString()),
    datasets: [
      {
        label: 'Cumulative Interest (Lost Earnings)',
        data: residualEffectsRawData.map(({ cumulativeInterest }) => cumulativeInterest),
        borderColor: 'blue',
        fill: false,
        tension: 0.1,
      },
    ],
  }), [residualEffectsRawData]);

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
        <>
          {/* Line Chart for Stress Effects */}
          <Row className="mb-3">
            <Col md={{ span: 8, offset: 2 }}>
              <Card>
                <Card.Body>
                  <Card.Title className="text-center">Yearly Balance & Interest Earned</Card.Title>
                  <LinePlot
                    data={stressEffectsChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'top' },
                        title: {
                          display: true,
                          text: 'Stress Effects: Balance vs Interest Earned',
                        },
                      },
                      layout: { padding: 10 },
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

          {/* Stress Effects Table */}
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
        </>
      ) : (
        <>
          {/* Line Chart for Residual Effects */}
          <Row className="mb-3">
            <Col md={{ span: 8, offset: 2 }}>
              <Card>
                <Card.Body>
                  <Card.Title className="text-center">Cumulative Lost Earnings</Card.Title>
                  <LinePlot
                    data={residualEffectsChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'top' },
                        title: {
                          display: true,
                          text: 'Residual Effects: Cumulative Lost Earnings',
                        },
                      },
                      layout: { padding: 10 },
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
                  {calculateResidualEffectsData(presentValue).map((row) => (
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
        </>
      )}
    </Container>
  );
};

export default StressTest5;
