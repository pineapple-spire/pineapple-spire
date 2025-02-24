'use client';

import React, { useState } from 'react';
import { Table, Container, Col, Row, Form, Tabs, Tab } from 'react-bootstrap';

const fakeData1 = [
  { year: 2025, expense: 1315 },
  { year: 2026, expense: 1347 },
  { year: 2027, expense: 1381 },
  { year: 2028, expense: 1416 },
  { year: 2029, expense: 1451 },
  { year: 2030, expense: 1487 },
  { year: 2031, expense: 1525 },
  { year: 2032, expense: 1563 },
  { year: 2033, expense: 1602 },
  { year: 2034, expense: 1642 },
  { year: 2035, expense: 1683 },
  { year: 2036, expense: 1725 },
];

const fakeData2 = fakeData1.map(({ year, expense }, index) => ({
  year,
  principal: -expense,
  lostEarnings: -(index * 250),
  totalImpact: -expense - index * 250,
}));

const residualEffectsData = [
  { year: 2025, principal: -1315, lostInterest: -79, totalLost: -79 },
  { year: 2026, principal: -1314, lostInterest: -163, totalLost: -242 },
  { year: 2027, principal: -1323, lostInterest: -252, totalLost: -495 },
  { year: 2028, principal: -1317, lostInterest: -346, totalLost: -842 },
  { year: 2029, principal: -1318, lostInterest: -446, totalLost: -1289 },
  { year: 2030, principal: -1320, lostInterest: -552, totalLost: -1843 },
  { year: 2031, principal: -1318, lostInterest: -665, totalLost: -2509 },
  { year: 2032, principal: -1319, lostInterest: -784, totalLost: -3295 },
  { year: 2033, principal: -1319, lostInterest: -910, totalLost: -4207 },
  { year: 2034, principal: -1319, lostInterest: -1044, totalLost: -5254 },
  { year: 2035, principal: -1319, lostInterest: -1186, totalLost: -6443 },
  { year: 2036, principal: -1319, lostInterest: -1337, totalLost: -7783 },
];

const StressTest4: React.FC = () => {
  const [increaseRate, setIncreaseRate] = useState(2.5);
  const [returnRate, setReturnRate] = useState(6.02);

  return (
    <Container className="my-4">
      <Tabs defaultActiveKey="stressEffects" id="effects-tabs">
        <Tab eventKey="stressEffects" title="Stress Effects">
          <Row className="mb-3">
            <Col md={6}>
              <h5>Operating Expense Increase Analysis</h5>
              <Form.Group as={Row} controlId="increaseRate">
                <Form.Label column sm={6}>
                  Annual Increase Rate:
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="number"
                    value={increaseRate}
                    step="0.1"
                    onChange={(e) => setIncreaseRate(parseFloat(e.target.value))}
                  />
                </Col>
              </Form.Group>
            </Col>

            <Col md={6}>
              <h5>Operating Expense Increase Analysis</h5>
              <Form.Group as={Row} controlId="increaseRate">
                <Form.Label column sm={6}>
                  Annual Increase Rate:
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="number"
                    value={increaseRate}
                    step="0.1"
                    onChange={(e) => setReturnRate(parseFloat(e.target.value))}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="returnRate">
                <Form.Label column sm={6}>
                  Annual Return Rate:
                </Form.Label>
                <Col sm={6}>
                  <Form.Control
                    type="number"
                    value={returnRate}
                    step="0.1"
                    onChange={(e) => setReturnRate(parseFloat(e.target.value))}
                  />
                </Col>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Fiscal Year</th>
                    <th>Increase in Expenses</th>
                  </tr>
                </thead>
                <tbody>
                  {fakeData1.map(({ year, expense }) => (
                    <tr key={year}>
                      <td>{year}</td>
                      <td style={{ color: 'red' }}>
                        $
                        {expense.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>

            <Col md={6}>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Year</th>
                    <th>Principal</th>
                    <th>Lost Earnings</th>
                    <th>Total Impact</th>
                  </tr>
                </thead>
                <tbody>
                  {fakeData2.map(({ year, principal, lostEarnings, totalImpact }) => (
                    <tr key={year}>
                      <td>{year}</td>
                      <td style={{ color: 'red' }}>
                        ($
                        {Math.abs(principal).toLocaleString()}
                        )
                      </td>
                      <td style={{ color: 'red' }}>
                        ($
                        {Math.abs(lostEarnings).toLocaleString()}
                        )
                      </td>
                      <td style={{ color: 'red' }}>
                        ($
                        {Math.abs(totalImpact).toLocaleString()}
                        )
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="residualEffects" title="Residual Effects">
          <h5 className="mt-3">Residual Effects Analysis</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Year</th>
                <th>Principal</th>
                <th>Lost Interest</th>
                <th>Total Interests Lost</th>
              </tr>
            </thead>
            <tbody>
              {residualEffectsData.map(({ year, principal, lostInterest, totalLost }) => (
                <tr key={year}>
                  <td>{year}</td>
                  <td style={{ color: 'red' }}>
                    ($
                    {Math.abs(principal).toLocaleString()}
                    )
                  </td>
                  <td style={{ color: 'red' }}>
                    ($
                    {Math.abs(lostInterest).toLocaleString()}
                    )
                  </td>
                  <td style={{ color: 'red' }}>
                    ($
                    {Math.abs(totalLost).toLocaleString()}
                    )
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default StressTest4;
