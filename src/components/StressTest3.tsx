'use client';

import { Col, Container, Form, Nav, Row, Table } from 'react-bootstrap';
import { useState } from 'react';
import { calculateCompoundInterest } from '@/lib/mathUtils';

/**
 * This stress test calculates the financial impact of a one-time expense
 * and tracks the associated loss in earnings over multiple fiscal years.
 */
const StressTest3 = () => {
  const [annualRate, setAnnualRate] = useState(6.02);
  const [oneTimeEvent] = useState(50000);

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setAnnualRate(value);
  };

  const [data, setData] = useState<{ [year: number]: { amount: number; lost: number } }>(
    Array.from({ length: 12 }, (_, i) => 2025 + i).reduce((acc, year) => {
      acc[year] = { amount: 0, lost: 0 };
      return acc;
    }, {} as { [year: number]: { amount: number; lost: number } }),
  );

  const handleInputChange = (year: number, value: string) => {
    const amountValue = parseInt(value, 10);
    const newData = { ...data };
    newData[year].amount = amountValue;
    Object.keys(newData).forEach((y) => (newData[Number(y)].lost = 0));

    Object.keys(newData)
      .map(Number)
      .sort((a, b) => a - b)
      .forEach((startYear) => {
        const principal = newData[startYear].amount;
        for (let i = 0; i < Object.keys(newData).length; i++) {
          const futureYear = startYear + i;
          if (newData[futureYear]) {
            const totalAmount = calculateCompoundInterest(principal, annualRate, i + 1);
            newData[futureYear].lost += parseInt(totalAmount.toFixed(0), 10);
          }
        }
      });

    setData(newData);
  };

  const [activeTab, setActiveTab] = useState<any>('stressEffects');

  return (
    <Container>
      <h3>
        One-time &quot;X&quot; Event of $
        {oneTimeEvent}
      </h3>
      <Nav variant="tabs" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)}>
        <Nav.Item>
          <Nav.Link eventKey="stressEffects">Stress Effects</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="residualEffects">Residual Effects</Nav.Link>
        </Nav.Item>
      </Nav>
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
                onChange={handleRateChange}
                placeholder="Enter annual return rate"
              />
            </Form.Group>
          </Col>
          <Table striped bordered>
            <thead>
              <tr>
                <th>Fiscal Year</th>
                <th>Increase in Expenses</th>
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
                        onChange={(e) => handleInputChange(year, e.target.value)}
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
                    <td>{data[year].amount}</td>
                    <td>{data[year].lost}</td>
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
