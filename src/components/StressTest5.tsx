'use client';

import { Col, Container, Form, InputGroup, Row, Table } from 'react-bootstrap';
import { useState } from 'react';

/* Input form to get values to calculate the decrease in revenue */
const PercentInput = () => {
  const [presentValue, setPresentValue] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [term, setTerm] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');

  const handlePresentValue = (event: { target: { value: any; }; }) => {
    setPresentValue(event.target.value);
  };

  const handleInterestRate = (event: { target: { value: any; }; }) => {
    setInterestRate(event.target.value);
  };

  const handleTerm = (event: { target: { value: any; }; }) => {
    setTerm(event.target.value);
  };

  const handleMonthlyContribution = (event: { target: { value: any; }; }) => {
    setMonthlyContribution(event.target.value);
  };
  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <InputGroup>
            <InputGroup.Text>
              Present Value
            </InputGroup.Text>
            <Form.Control
              placeholder="Enter a number"
              value={presentValue}
              onChange={handlePresentValue}
            />
          </InputGroup>
        </Col>
        <Col>
          <InputGroup>
            <InputGroup.Text>
              Interest Rate
            </InputGroup.Text>
            <Form.Control
              placeholder="Enter a percentage"
              value={interestRate}
              onChange={handleInterestRate}
            />
          </InputGroup>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col>
          <InputGroup>
            <InputGroup.Text>
              Term (in years)
            </InputGroup.Text>
            <Form.Control
              placeholder="Enter a whole number"
              value={term}
              onChange={handleTerm}
            />
          </InputGroup>
        </Col>
        <Col>
          <InputGroup>
            <InputGroup.Text>
              Monthly Contribution
            </InputGroup.Text>
            <Form.Control
              placeholder="Enter a percentage"
              value={monthlyContribution}
              onChange={handleMonthlyContribution}
            />
          </InputGroup>
        </Col>
      </Row>
    </Container>
  );
};

/* Table for stress test 5 */
const StressTest5 = () => {
  const tableData = [
    { year: 1, balance: '$50,000', contribution: '$-', interest: '$2,100', total: '$52,100' },
    { year: 2, balance: '$52,100', contribution: '$-', interest: '$2,188', total: '$54,288' },
    { year: 3, balance: '$54,288', contribution: '$-', interest: '$2,280', total: '$56,568' },
    { year: 4, balance: '$56,568', contribution: '$-', interest: '$2,376', total: '$59,944' },
    { year: 5, balance: '$58,944', contribution: '$-', interest: '$2,476', total: '$61,420' },
    { year: 6, balance: '$61,420', contribution: '$-', interest: '$2,580', total: '$63,999' },
    { year: 7, balance: '$63,999', contribution: '$-', interest: '$2,688', total: '$66,687' },
    { year: 8, balance: '$66,687', contribution: '$-', interest: '$2,801', total: '$72,407' },
  ];

  return (
    <Container className="my-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <h4 className="text-center">Decrease bond return to 1.7% due to increase inflation</h4>
          <PercentInput />
          <Table striped bordered hover className="mt-4">
            <thead>
              <tr>
                <th>Year</th>
                <th>Balance</th>
                <th>Yearly Contribution</th>
                <th>Interest Earned</th>
                <th>Interest + Balance</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
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
