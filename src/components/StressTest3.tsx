'use client';

import React, { useState, ChangeEvent } from 'react';
import {
  Container, Form, Row, Table, Card, Col,
} from 'react-bootstrap';
import { calculateCompoundInterest, formatCurrency } from '@/lib/mathUtils';
import CommonTabs from '@/components/CommonTabs';
import LinePlot from '@/components/LinePlot';

/**
 * This stress test calculates the financial impact of a one-time expense
 * and tracks the associated loss in earnings over multiple fiscal years.
 */
const StressTest3 = () => {
  const [activeTab, setActiveTab] = useState<'stressEffects' | 'residualEffects'>('stressEffects');

  const [annualRate, setAnnualRate] = useState(6.02);
  const [oneTimeEvent] = useState(50000);

  // Initialize data for years 2025 through 2025 + 11 (12 total years)
  const [data, setData] = useState<{
    [year: number]: { amount: number; lost: number };
  }>(() => {
    const obj: { [year: number]: { amount: number; lost: number } } = {};
    for (let y = 2025; y < 2025 + 12; y++) {
      obj[y] = { amount: 0, lost: 0 };
    }
    return obj;
  });

  /**
   * Handle input changes for either the annual rate or the "amount" for each year.
   */
  const handleInputUpdate = (
    year?: number,
    value?: string,
    isRateChange?: boolean,
  ) => {
    // Make a copy of our data
    const newData = { ...data };

    // If user changed the annual rate
    if (isRateChange && value !== undefined) {
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
    const sortedYears = Object.keys(newData).map(Number).sort((a, b) => a - b);

    sortedYears.forEach((startYear) => {
      const principal = newData[startYear].amount;

      // For each subsequent year, compound from startYear's amount
      for (let i = 0; i < sortedYears.length; i++) {
        const futureYear = startYear + i;
        if (newData[futureYear]) {
          // Use updated rate if user just changed it, else use current annualRate
          const rateUsed = isRateChange ? parseFloat(value || '0') || annualRate : annualRate;
          const totalAmount = calculateCompoundInterest(principal, rateUsed, i + 1);
          // Accumulate lost earnings in that futureYear
          newData[futureYear].lost += parseInt(totalAmount.toFixed(0), 10);
        }
      }
    });

    setData(newData);
  };

  // Prepare an array of sorted years
  const sortedYears = Object.keys(data).map(Number).sort((a, b) => a - b);

  /**
   * Prepare chart data for the "Stress Effects" tab:
   * Plot the year vs. data[year].amount
   */
  const stressChartData = {
    labels: sortedYears.map((year) => year.toString()),
    datasets: [
      {
        label: 'Increased Expenses',
        data: sortedYears.map((year) => data[year].amount),
        borderColor: 'red',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  /**
   * Prepare chart data for the "Residual Effects" tab:
   * Plot the year vs. data[year].lost
   */
  const residualChartData = {
    labels: sortedYears.map((year) => year.toString()),
    datasets: [
      {
        label: 'Lost Earnings',
        data: sortedYears.map((year) => data[year].lost),
        borderColor: 'blue',
        fill: false,
        tension: 0.1,
      },
    ],
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

      <CommonTabs
        defaultTab="stressEffects"
        onTabChange={(tab) => setActiveTab(tab === 'residualEffects' ? 'residualEffects' : 'stressEffects')}
      />

      {activeTab === 'stressEffects' ? (
        <>
          {/* Line Chart for Stress Effects (Increased Expenses) */}
          <Row className="mb-4">
            <Col md={{ span: 8, offset: 2 }}>
              <Card>
                <Card.Body>
                  <Card.Title className="text-center">
                    Increased Expenses Over Time
                  </Card.Title>
                  <LinePlot
                    data={stressChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'top' },
                        title: {
                          display: true,
                          text: 'Yearly Increased Expenses',
                        },
                      },
                      layout: {
                        padding: 10,
                      },
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: 'Year',
                          },
                        },
                        y: {
                          title: {
                            display: true,
                            text: 'Expenses ($)',
                          },
                        },
                      },
                    }}
                    style={{ minHeight: '450px', maxHeight: '650px' }}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Table for Stress Effects */}
          <Row>
            <Table striped bordered>
              <thead>
                <tr>
                  <th>Fiscal Year</th>
                  <th>Increase in Expenses ($)</th>
                </tr>
              </thead>
              <tbody>
                {sortedYears.map((year) => (
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
        </>
      ) : (
        <>
          {/* Line Chart for Residual Effects (Lost Earnings) */}
          <Row className="mb-4">
            <Col md={{ span: 8, offset: 2 }}>
              <Card>
                <Card.Body>
                  <Card.Title className="text-center">
                    Lost Earnings Over Time
                  </Card.Title>
                  <LinePlot
                    data={residualChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'top' },
                        title: {
                          display: true,
                          text: 'Yearly Lost Earnings',
                        },
                      },
                      layout: {
                        padding: 10,
                      },
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: 'Year',
                          },
                        },
                        y: {
                          title: {
                            display: true,
                            text: 'Lost Earnings ($)',
                          },
                        },
                      },
                    }}
                    style={{ minHeight: '450px', maxHeight: '650px' }}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Table for Residual Effects */}
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
                {sortedYears.map((year) => (
                  <tr key={year}>
                    <td>{year}</td>
                    <td>{formatCurrency(data[year].amount)}</td>
                    <td>{formatCurrency(data[year].lost)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Row>
        </>
      )}
    </Container>
  );
};

export default StressTest3;
