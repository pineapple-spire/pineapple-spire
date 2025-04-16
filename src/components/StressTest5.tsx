'use client';

import { useState, useMemo, ChangeEvent } from 'react';
import { Col, Container, Form, Row, Table, Card } from 'react-bootstrap';
import { calculateResidualEffects, formatCurrency } from '@/lib/mathUtils';
import CommonTabs from '@/components/CommonTabs';
import LinePlot from '@/components/LinePlot';

/* Stress Test 5 Component */
const StressTest5 = () => {
  // Default values matching Excel sheet
  const [presentValue, setPresentValue] = useState<number | null>(5000);
  const [interestRate, setInterestRate] = useState<number | null>(6.0); // Starts at 6% (user can change)
  const [term, setTerm] = useState<number | null>(30);
  const [fullyFunded, setFullyFunded] = useState<number | null>(100); // Default to 100%

  // Track active tab
  const [activeTab, setActiveTab] = useState<'stressEffects' | 'residualEffects'>('stressEffects');

  // Handle input changes
  const handleChange = (setter: (value: number | null) => void) => (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numericValue = value === '' ? null : parseFloat(value);

    // Prevent negative values
    if (numericValue !== null && numericValue < 0) {
      return; // Do nothing if the value is negative
    }

    setter(numericValue);
  };

  // Calculate table data for Stress Effects (using formatted values)
  const calculateTableData = () => {
    if (presentValue === null || interestRate === null || term === null) {
      return []; // Return an empty array if any input is invalid
    }

    const rate = interestRate / 100;
    let balance = presentValue;
    const rows = [];

    for (let year = 1; year <= term; year++) {
      const interestEarned = parseFloat((balance * rate).toFixed(2));
      const total = parseFloat((balance + interestEarned).toFixed(2));
      rows.push({
        year,
        balance: formatCurrency(balance),
        contribution: '$-',
        interest: formatCurrency(interestEarned),
        total: formatCurrency(total),
      });
      balance = parseFloat((balance - interestEarned).toFixed(2));
    }

    return rows;
  };

  const generatePrincipals = (initialPrincipal: number, years: number, growthRate: number): number[] => {
    const principals = [];
    let currentPrincipal = initialPrincipal;

    for (let year = 1; year <= years; year++) {
      principals.push(parseFloat(currentPrincipal.toFixed(2)));
      currentPrincipal += currentPrincipal * (growthRate / 100); // Increase principal by the growth rate
    }

    return principals;
  };

  // Calculate table data for Residual Effects (using formatted values)
  const calculateResidualEffectsData = () => {
    if (presentValue === null || interestRate === null || term === null || fullyFunded === null) {
      return [];
    }

    // Dynamically generate the principals array
    const principals = generatePrincipals(215, term, 6.02); // Initial principal: 215, growth rate: 6.02%

    // Generate the fully funded boolean array based on the percentage
    const fullyFundedArray = Array(term).fill(fullyFunded === 100);

    // Pass the fully funded array to the calculateResidualEffects function
    return calculateResidualEffects(principals, 6.02, interestRate, term, fullyFundedArray);
  };

  // Compute raw data for charting in Stress Effects tab (for balance & annual interest)
  const stressEffectsRawData = useMemo(() => {
    const rate = (interestRate ?? 0) / 100;
    let balance = presentValue ?? 0; // Start with the initial present value
    const result = [];

    for (let year = 1; year <= (term ?? 0); year++) {
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
    if (presentValue === null || interestRate === null || term === null || fullyFunded === null) {
      return [];
    }

    // Dynamically generate the principals array
    const principals = generatePrincipals(215, term, 6.02); // Initial principal: 215, growth rate: 6.02%

    // Generate the fully funded boolean array based on the percentage
    const fullyFundedArray = Array(term).fill(fullyFunded === 100);

    // Calculate residual effects
    const residualEffects = calculateResidualEffects(principals, 6.02, interestRate, term, fullyFundedArray);

    return residualEffects.map(({ year, cumulativeLostEarnings }) => ({
      year,
      cumulativeInterest: cumulativeLostEarnings,
    }));
  }, [presentValue, interestRate, term, fullyFunded]);

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
                  value={presentValue === null ? '' : presentValue}
                  onChange={handleChange(setPresentValue)}
                  placeholder="Enter present value (e.g., 5000)"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Interest Rate (%)</Form.Label>
                <Form.Control
                  type="number"
                  value={interestRate === null ? '' : interestRate}
                  onChange={handleChange(setInterestRate)}
                  placeholder="Enter interest rate (e.g., 6.0)"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Term (Years)</Form.Label>
                <Form.Control
                  type="number"
                  value={term === null ? '' : term}
                  onChange={handleChange(setTerm)}
                  placeholder="Enter term in years (e.g., 30)"
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

      {activeTab === 'residualEffects' ? (
        <>
          {/* Input Form for Residual Effects */}
          <Row className="mb-3 justify-content-center">
            <Col md={6}>
              <Form>
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Fully Funded</Form.Label>
                      <Form.Control
                        type="number"
                        value={fullyFunded === null ? '' : fullyFunded}
                        onChange={handleChange(setFullyFunded)}
                        placeholder="Enter as a percentage (e.g., 100)"
                        min="0" // Prevents negative values in the UI
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>

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
                    <th>Lost Earnings</th>
                    <th>Cumulative Lost Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  {calculateResidualEffectsData().map((row) => (
                    <tr key={row.year}>
                      <td>{row.year}</td>
                      <td>{formatCurrency(row.principal)}</td>
                      <td>
                        6.02% →
                        {interestRate?.toFixed(2)}
                        %
                      </td>
                      <td>{formatCurrency(row.lostEarnings)}</td>
                      <td>{formatCurrency(row.cumulativeLostEarnings)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </>
      ) : (
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
      )}
    </Container>
  );
};

export default StressTest5;
