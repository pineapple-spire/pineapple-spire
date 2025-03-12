'use client';

import { useState, ChangeEvent } from 'react';
import { Col, Container, Form, Row, Table, Button } from 'react-bootstrap';
import { calculateTableData } from '@/lib/mathUtils';

/* Stress Test 5 Component */
const StressTest5 = () => {
  // Default values (sample values)
  const defaultValues = {
    presentValue: 5000,
    interestRate: 6.0,
    term: 30,
    monthlyContribution: 100, // New input field for monthly contribution
  };

  // State using object state for inputs
  const [inputs, setInputs] = useState(defaultValues);

  // Destructure state variables
  const { presentValue, interestRate, term, monthlyContribution } = inputs;

  // Helper function to sanitize input (truncates and clamps values)
  const sanitizeInput = (value: number, min: number, max: number, decimals: number = 2) => {
    if (Number.isNaN(value) || value === Infinity || value === -Infinity) return min;
    return Math.max(min, Math.min(max, parseFloat(value.toFixed(decimals))));
  };

  // Handle input changes dynamically with validation
  const handleChange = (
    field: keyof typeof inputs,
    min: number,
    max: number,
    decimals?: number,
  ) => (e: ChangeEvent<HTMLInputElement>) => {
    let inputValue = parseFloat(e.target.value) || min; // Default to min if empty/invalid

    if (field === 'interestRate') {
      inputValue = Math.max(0, inputValue); // Ensure interest rate cannot be negative
    }

    setInputs((prev) => ({
      ...prev,
      [field]: sanitizeInput(inputValue, min, max, decimals),
    }));
  };

  // Reset values to default (sample) values
  const resetValues = () => {
    setInputs(defaultValues); // Reset state to the initial default values
  };

  return (
    <Container className="my-4">
      <h2>Scenario #5 - Decrease Bond Return to 1.7% Due to Increased Inflation</h2>
      <Row className="mb-3">
        <Col md={4}>
          {/* Form Inputs */}
          <Form>
            {[
              {
                label: 'Present Value',
                field: 'presentValue',
                placeholder: '5000',
                min: 0,
                max: 1_000_000,
                decimals: 0,
              },
              { label: 'Interest Rate (%)', field: 'interestRate', placeholder: '6.0', min: 0, max: 100, decimals: 2 },
              { label: 'Term (Years)', field: 'term', placeholder: '30', min: 1, max: 100, decimals: 0 },
              {
                label: 'Monthly Contribution',
                field: 'monthlyContribution',
                placeholder: '100',
                min: 0,
                max: 1_000_000,
                decimals: 0,
              },
            ].map(({ label, field, placeholder, min, max, decimals }) => (
              <Form.Group className="mb-3" key={field}>
                <Form.Label>{label}</Form.Label>
                <Form.Control
                  type="number"
                  placeholder={placeholder}
                  value={inputs[field as keyof typeof inputs] || ''}
                  onChange={handleChange(field as keyof typeof inputs, min, max, decimals)}
                />
              </Form.Group>
            ))}
            {/* Reset Button */}
            <Button variant="secondary" onClick={resetValues}>Reset to Default</Button>
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
              {calculateTableData(
                presentValue,
                interestRate,
                term,
                monthlyContribution,
              ).map(({ year, balance, contribution, interest, total }) => (
                <tr key={year}>
                  <td>{year}</td>
                  <td>{balance}</td>
                  <td>{contribution}</td>
                  <td>{interest}</td>
                  <td>{total}</td>
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
