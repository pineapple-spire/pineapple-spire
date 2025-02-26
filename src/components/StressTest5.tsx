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
    { year: 1, balance: '$10,000', contribution: '$1,000', interest: '$170', total: '$11,170' },
    { year: 2, balance: '$11,170', contribution: '$1,000', interest: '$190.89', total: '$12,360.89' },
    { year: 3, balance: '$12,360.89', contribution: '$1,000', interest: '$212.13', total: '$13,572.02' },
    { year: 4, balance: '$13,572.02', contribution: '$1,000', interest: '$234.72', total: '$14,806.74' },
    { year: 5, balance: '$14,806.74', contribution: '$1,000', interest: '$257.68', total: '$16,064.42' },
    { year: 6, balance: '$16,064.42', contribution: '$1,000', interest: '$281.01', total: '$17,345.43' },
    { year: 7, balance: '$17,345.43', contribution: '$1,000', interest: '$304.73', total: '$18,650.16' },
    { year: 8, balance: '$18,650.16', contribution: '$1,000', interest: '$328.85', total: '$19,978.01' },
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
