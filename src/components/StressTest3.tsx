'use client';

import { Col, Container, Form, Nav, Row, Table } from 'react-bootstrap';
import { useState } from 'react';

const StressTest3 = () => {
  // Lets the user set the annual return rate
  const [annualRate, setAnnualRate] = useState(6.02);
  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setAnnualRate(value);
  };

  // Holds fiscal year, principal amount, and lost earnings for principal
  const [data, setData] = useState<{ [year: number]: { amount: number; lost: number } }>(
    Array.from({ length: 12 }, (_, i) => 2025 + i).reduce((acc, year) => {
      acc[year] = { amount: 0, lost: 0 };
      return acc;
    }, {} as { [year: number]: { amount: number; lost: number } }),
  );

  // Handles when the user changes the increase in expenses
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
            const totalAmount = principal * (1 + (annualRate / 100)) ** (i + 1) - principal;
            newData[futureYear].lost += parseInt(totalAmount.toFixed(0), 10);
          }
        }
      });
    setData(newData);
  };

  // Allows for the user to switch between 'Stress Effects' and 'Residual Effects'
  const [activeTab, setActiveTab] = useState<any>('stressEffects');

  // Tables for Stress Test 3
  return (
    // Navbar for switching between the 'Stress Effects' and 'Residual Effects' tabs
    <Container>
      <h3>One-time &quot;X&quot; Event of $50,000</h3>
      <Nav variant="tabs" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey)}>
        <Nav.Item>
          <Nav.Link eventKey="stressEffects">Stress Effects</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="residualEffects">Residual Effects</Nav.Link>
        </Nav.Item>
      </Nav>
      {activeTab === 'stressEffects' ? ( // If the selected tab is Stress Effects
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
      ) : ( // Else, show the 'Residual Effects' tab
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
