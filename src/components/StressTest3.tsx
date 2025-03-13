'use client';

import { Container, Form, Row, Table } from 'react-bootstrap';
import { useState, ChangeEvent } from 'react';
import { calculateCompoundInterest, formatCurrency } from '@/lib/mathUtils';
import CommonTabs from '@/components/CommonTabs';

/**
 * This stress test calculates the financial impact of a one-time expense
 * and tracks the associated loss in earnings over multiple fiscal years.
 */
const StressTest3 = () => {
  const [activeTab, setActiveTab] = useState<'stressEffects' | 'residualEffects'>('stressEffects');

  const [annualRate, setAnnualRate] = useState(6.02);
  const [oneTimeEvent] = useState(50000);

  // Yearly data
  const [data, setData] = useState<{
    [year: number]: { amount: number; lost: number };
  }>(
    // Initialize data for years 2025 through 2025 + 11 (12 total)
    Array.from({ length: 12 }, (_, i) => 2025 + i).reduce((acc, year) => {
      acc[year] = { amount: 0, lost: 0 };
      return acc;
    }, {} as { [year: number]: { amount: number; lost: number } }),
  );

  // Handle changes to the annual rate and the yearly amounts
  const handleInputUpdate = (
    year?: number,
    value?: string,
    isRateChange?: boolean,
  ) => {
    const newData = { ...data };

    if (isRateChange && value !== undefined) {
      // If the input is the annual rate
      const newRate = parseFloat(value) || 0;
      setAnnualRate(newRate);
    } else if (year !== undefined && value !== undefined) {
      newData[year].amount = parseInt(value, 10) || 0;
    }

    // Reset lost earnings before recalculating
    Object.keys(newData).forEach((y) => {
      newData[Number(y)].lost = 0;
    });

    // Recalculate lost earnings
    Object.keys(newData)
      .map(Number)
      .sort((a, b) => a - b)
      .forEach((startYear) => {
        const principal = newData[startYear].amount;

        // For each subsequent year, compound from startYear's amount
        for (let i = 0; i < Object.keys(newData).length; i++) {
          const futureYear = startYear + i;
          if (newData[futureYear]) {
            const rateUsed = isRateChange ? parseFloat(value || '0') || annualRate : annualRate;
            const totalAmount = calculateCompoundInterest(principal, rateUsed, i + 1);
            newData[futureYear].lost += parseInt(totalAmount.toFixed(0), 10);
          }
        }
      });

    setData(newData);
  };

  return (
    <Container className="my-4">
      <Row className="mb-3">
        <h3>
          One-time &quot;X&quot; Event of $
          {oneTimeEvent}
        </h3>
        <Row md={6}>
          <Form.Group controlId="returnRate">
            <Form.Label>Annual Return Rate (%)</Form.Label>
            <Form.Control
              type="number"
              value={annualRate}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputUpdate(undefined, e.target.value, true)}
              onBlur={(e) => {
                if (e.target.value.trim() === '') {
                  handleInputUpdate(undefined, '6.02', true);
                }
              }}
              placeholder="Enter annual return rate"
            />
          </Form.Group>
        </Row>
      </Row>

      {/* Common Tabs */}
      <CommonTabs
        defaultTab="stressEffects"
        onTabChange={(tab) => setActiveTab(tab === 'residualEffects' ? 'residualEffects' : 'stressEffects')}
      />

      {activeTab === 'stressEffects' ? (
        <Row>
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
