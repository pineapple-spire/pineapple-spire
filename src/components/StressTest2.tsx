'use client';

import { Col, Container, Row, Table } from 'react-bootstrap';
import { useState } from 'react';
import { formatCurrency } from '@/lib/mathUtils';
import PercentInput from '@/components/PercentInput';

/**
 * StressTest2 calculates and displays a revenue drop scenario.
 */
const StressTest2 = () => {
  // Default percent drop is 60%
  const [percent, setPercent] = useState<string>('60');

  // Convert user input to a number (or default to 0 if invalid)
  const dropPercent = Number(percent) || 0;

  const baseRevenue = 153034; // Revenue for 2025
  const growthRate = 0.015; // 1.5% annual growth
  const startYear = 2025;
  const totalYears = 5; // 2025 to 2036

  const rows = Array.from({ length: totalYears }, (_, i) => {
    const year = startYear + i;
    // Revenue in year = baseRevenue * (1 + growthRate)^(year - startYear)
    const totalRevenue = baseRevenue * (1 + growthRate) ** i;
    // Revenue drop in dollars = totalRevenue * (dropPercent / 100)
    const revenueDrop = totalRevenue * (dropPercent / 100);
    return {
      year,
      totalRevenue,
      revenueDrop,
    };
  });

  return (
    <Container>
      <Row className="m-3">
        <Col className="mx-auto">
          <h4>60% Sustained Drop in Return Rate of Investment</h4>
        </Col>
        <Col>
          <PercentInput percent={percent} onChange={setPercent} />
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
