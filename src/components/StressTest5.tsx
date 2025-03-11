'use client';

import { useState, ChangeEvent } from 'react';
import { Col, Container, Form, Row, Table } from 'react-bootstrap';
import { calculateTableData } from '@/lib/mathUtils';

/* Stress Test 5 Component */
const StressTest5 = () => {
  // Default values matching Excel sheet
  const [presentValue, setPresentValue] = useState<number>(5000);
  const [interestRate, setInterestRate] = useState<number>(6.0); // Starts at 6% (user can change)
  const [term, setTerm] = useState<number>(30);

  // Handle input changes
  const handleChange = (setter: (value: number) => void) => (e: ChangeEvent<HTMLInputElement>) => {
    setter(parseFloat(e.target.value) || 0);
  };

  return (
    <Container className="my-4">
      <h2>Scenario #5 - Decrease Bond Return to 1.7% Due to Increased Inflation</h2>
      <Row className="mb-3">
        <Col md={4}>
          {/* Form Inputs */}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Present Value</Form.Label>
              <Form.Control type="number" value={presentValue} onChange={handleChange(setPresentValue)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Interest Rate (%)</Form.Label>
              <Form.Control type="number" value={interestRate} onChange={handleChange(setInterestRate)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Term (Years)</Form.Label>
              <Form.Control type="number" value={term} onChange={handleChange(setTerm)} />
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
              {calculateTableData(presentValue, interestRate, term).map((row) => (
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
