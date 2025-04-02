'use client';

import { useState, ChangeEvent } from 'react';
import { Col, Container, Form, Row, Table } from 'react-bootstrap';
import { calculateInterestAndBalance } from '@/lib/mathUtils';

/* Stress Test 5 Component */
const StressTest5 = () => {
  // Default values matching Excel sheet
  const [presentValue, setPresentValue] = useState<string>('5000'); // Initialize as string for empty input handling
  const [interestRate, setInterestRate] = useState<string>('6.0'); // Initialize as string for empty input handling
  const [term, setTerm] = useState<string>('30'); // Initialize as string for empty input handling
  // Initialize as string for empty input handling
  const [monthlyContribution, setMonthlyContribution] = useState<string>('100');

  // Handle input changes
  const handleChange = (setter: (value: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value); // Update state with the input value (it can be empty)
  };

  // Convert the input to number or fallback to default values if empty
  const getNumericValue = (value: string, defaultValue: number) => {
    const numericValue = parseFloat(value);
    return Number.isNaN(numericValue) ? defaultValue : numericValue;
  };

  // Get the table data from the utility function
  const tableData = calculateInterestAndBalance(
    getNumericValue(presentValue, 5000),
    getNumericValue(interestRate, 6.0),
    getNumericValue(term, 30),
  );

  return (
    <Container className="my-4">
      <h2>Scenario #5 - Decrease Bond Return to 1.7% Due to Increased Inflation</h2>
      <Row className="mb-3">
        <Col md={4}>
          {/* Form Inputs */}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Present Value</Form.Label>
              <Form.Control
                type="number"
                value={presentValue}
                onChange={handleChange(setPresentValue)}
                placeholder="Enter amount"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Interest Rate (%)</Form.Label>
              <Form.Control
                type="number"
                value={interestRate}
                onChange={handleChange(setInterestRate)}
                placeholder="Enter interest rate"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Term (Years)</Form.Label>
              <Form.Control
                type="number"
                value={term}
                onChange={handleChange(setTerm)}
                placeholder="Enter term"
              />
            </Form.Group>
            {/* New Input for Monthly Contribution */}
            <Form.Group className="mb-3">
              <Form.Label>Monthly Contribution</Form.Label>
              <Form.Control
                type="number"
                value={monthlyContribution}
                onChange={handleChange(setMonthlyContribution)}
                placeholder="Enter monthly contribution"
              />
            </Form.Group>
          </Form>
        </Col>

        {/* Main Table */}
        <Col md={8}>
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
              {tableData.map((row) => (
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
    </Container>
  );
};

export default StressTest5;
