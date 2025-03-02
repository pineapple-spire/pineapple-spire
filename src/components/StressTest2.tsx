'use client';

import { useState, ChangeEvent } from 'react';
import { Container, Row, Col, Form, Table } from 'react-bootstrap';
import { formatCurrency } from '@/lib/mathUtils';

/**
 * StressTest2 calculates and displays a revenue drop scenario.
 */
const StressTest2 = () => {
  // Set default values for parameters
  const [initialPercent, setInitialPercent] = useState<string>('60');
  const [baseRevenue, setBaseRevenue] = useState<string>('153034');
  const [growthRate, setGrowthRate] = useState<string>('0.015');
  const [startYear, setStartYear] = useState<string>('2025');
  const [totalYears, setTotalYears] = useState<string>('5');

  // Convert input strings to numbers (or fallback to 0)
  const dropPercent = Number(initialPercent) || 0;
  const baseRevenueNum = Number(baseRevenue) || 0;
  const growthRateNum = Number(growthRate) || 0;
  const startYearNum = Number(startYear) || 0;
  const totalYearsNum = Number(totalYears) || 0;

  // Create revenue rows based on the provided parameters
  const rows = Array.from({ length: totalYearsNum }, (_, i) => {
    const year = startYearNum + i;
    // Revenue in a given year: baseRevenue * (1 + growthRate)^i
    const totalRevenue = baseRevenueNum * (1 + growthRateNum) ** i;
    // Revenue drop in dollars = totalRevenue * (dropPercent / 100)
    const revenueDrop = totalRevenue * (dropPercent / 100);
    return {
      year,
      totalRevenue,
      revenueDrop,
    };
  });

  const handleChange = (setter: (value: string) => void) => (e:
  ChangeEvent<HTMLInputElement>) => setter(e.target.value);

  return (
    <Container>
      <Row className="my-3">
        <Col>
          <h4>Customize Stress Test Parameters</h4>
          <Form>
            <Form.Group className="mb-3" controlId="initialPercent">
              <Form.Label>Initial Percent Drop</Form.Label>
              <Form.Control
                type="text"
                value={initialPercent}
                onChange={handleChange(setInitialPercent)}
                placeholder="Enter percent drop (0-100)"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="baseRevenue">
              <Form.Label>Base Revenue</Form.Label>
              <Form.Control
                type="text"
                value={baseRevenue}
                onChange={handleChange(setBaseRevenue)}
                placeholder="Enter base revenue"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="growthRate">
              <Form.Label>Growth Rate</Form.Label>
              <Form.Control
                type="text"
                value={growthRate}
                onChange={handleChange(setGrowthRate)}
                placeholder="Enter growth rate (e.g., 0.015 for 1.5%)"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="startYear">
              <Form.Label>Start Year</Form.Label>
              <Form.Control
                type="text"
                value={startYear}
                onChange={handleChange(setStartYear)}
                placeholder="Enter start year"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="totalYears">
              <Form.Label>Total Years</Form.Label>
              <Form.Control
                type="text"
                value={totalYears}
                onChange={handleChange(setTotalYears)}
                placeholder="Enter total number of years"
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Row>
        <Table striped bordered>
          <thead>
            <tr>
              <th>Fiscal Year</th>
              <th>Total Revenues</th>
              <th>Decrease in Revenues</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.year}>
                <td>{row.year}</td>
                <td>{formatCurrency(row.totalRevenue)}</td>
                <td>{formatCurrency(row.revenueDrop)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
    </Container>
  );
};

export default StressTest2;
