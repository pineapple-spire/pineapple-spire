'use client';

import { Col, Container, Form, Row, Table } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { calculateCompoundInterest, formatCurrency } from '@/lib/mathUtils';
import CommonTabs from '@/components/CommonTabs';

/**
 * This stress test calculates the financial impact of a one-time expense
 * and tracks the associated loss in earnings over multiple fiscal years.
 */
const StressTest3 = () => {
  const [activeTab, setActiveTab] = useState<any>('stressEffects');
  const [annualRate, setAnnualRate] = useState(6.02);
  const [oneTimeEvent] = useState(50000);

  const [data, setData] = useState<{ [year: number]: { amount: number; lost: number } }>(
    Array.from({ length: 12 }, (_, i) => 2025 + i).reduce((acc, year) => {
      acc[year] = { amount: 0, lost: 0 };
      return acc;
    }, {} as { [year: number]: { amount: number; lost: number } }),
  );

  const handleInputUpdate = (year?: number, value: string = '', isRateChange = false) => {
    const newData = { ...data };

    if (isRateChange) {
      // If the change is from the annual rate input
      const newRate = parseFloat(value) || 0; // Ensure value is always parsed
      setAnnualRate(newRate);
    } else if (year !== undefined) {
      // If the change is from a yearly expense input
      newData[year].amount = parseInt(value, 10) || 0;
    }

    // Reset lost earnings before recalculating
    Object.keys(newData).forEach((y) => (newData[Number(y)].lost = 0));

    // Recalculate lost earnings based on updated values
    Object.keys(newData)
      .map(Number)
      .sort((a, b) => a - b)
      .forEach((startYear) => {
        const principal = newData[startYear].amount;
        for (let i = 0; i < Object.keys(newData).length; i++) {
          const futureYear = startYear + i;
          if (newData[futureYear]) {
            const totalAmount = calculateCompoundInterest(
              principal,
              isRateChange ? parseFloat(value) || annualRate : annualRate,
              i + 1,
            );
            newData[futureYear].lost += parseInt(totalAmount.toFixed(0), 10);
          }
        }
      });

    setData(newData);
  };

  useEffect(() => {
    handleInputUpdate(); // Run once on mount to calculate lost earnings
  }, []);

  return (
    <Container>
      <h3>
        One-time &quot;X&quot; Event of $
        {oneTimeEvent}
      </h3>

      <CommonTabs
        defaultTab="stressEffects"
        onTabChange={(tab) => setActiveTab(tab === 'residualEffects' ? 'residualEffects' : 'stressEffects')}
      />

      {activeTab === 'stressEffects' ? (
        // If the selected tab is 'Stress Effects', allow the user to enter
        // annual return rates and track the increase in expenses.
        <Row>
          <Col className="p-2">
            <Form.Group controlId="returnRate">
              <Form.Label>Annual Return Rate (%)</Form.Label>
              <Form.Control
                type="number"
                value={annualRate}
                onChange={(e) => handleInputUpdate(undefined, e.target.value, true)}
                onBlur={(e) => {
                  if (e.target.value.trim() === '') {
                    handleInputUpdate(undefined, '6.02', true);
                  }
                }}
                placeholder="Enter annual return rate (%)"
              />
            </Form.Group>
          </Col>
          <Table striped bordered>
            <thead>
              <tr>
                <th>Fiscal Year</th>
                <th>Increase in Expenses ($)</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(data)
                .map(Number)
                .sort((a, b) => a - b)
                .map((year) => (
                  <tr key={year}>
                    <td>{year}</td>
                    <td>
                      <Form.Control
                        type="number"
                        value={data[year].amount}
                        onChange={(e) => handleInputUpdate(year, e.target.value)}
                        onBlur={(e) => {
                          if (e.target.value.trim() === '') {
                            handleInputUpdate(year, '0');
                          }
                        }}
                        placeholder="Enter $ amount"
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Row>
      ) : (
        // Else, show the 'Residual Effects' tab with details on lost earnings
        <Row>
          <Table striped bordered>
            <thead>
              <tr>
                <th>Fiscal Year</th>
                <th>Principal</th>
                <th>Lost Earnings</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(data)
                .map(Number)
                .sort((a, b) => a - b)
                .map((year) => (
                  <tr key={year}>
                    <td>{year}</td>
                    <td>{formatCurrency(data[year].amount)}</td>
                    <td>{formatCurrency(data[year].lost)}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Row>
      )}
    </Container>
  );
};

export default StressTest3;
