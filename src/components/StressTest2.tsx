'use client';

import { Col, Container, Form, InputGroup, Row, Table } from 'react-bootstrap';
import { useState } from 'react';

/* Input form to get percentage to calculate the decrease in revenue */
const PercentInput = () => {
  const [percent, setPercent] = useState('');
  const handlePercent = (event: { target: { value: any; }; }) => {
    const inputNumber = event.target.value;
    if (inputNumber === '') {
      setPercent('');
    } else {
      setPercent(inputNumber);
    }
  };
  return (
    <InputGroup className="mb-3">
      <InputGroup.Text>
        % Decrease in Revenues
      </InputGroup.Text>
      <Form.Control
        placeholder="Enter a number 0-100"
        value={percent}
        onChange={handlePercent}
      />
    </InputGroup>
  );
};

/* Table for stress test 2 */
const StressTest2 = () => (
  <Container>
    <Row className="m-3">
      <Col className="mx-auto">
        <h4>60% Sustained drop in return rate of investment</h4>
      </Col>
      <Col>
        <PercentInput />
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
          <tr>
            <td>2025</td>
          </tr>
          <tr>
            <td>2026</td>
          </tr>
          <tr>
            <td>2027</td>
          </tr>
          <tr>
            <td>2028</td>
          </tr>
          <tr>
            <td>2029</td>
          </tr>
          <tr>
            <td>2030</td>
          </tr>
          <tr>
            <td>2031</td>
          </tr>
          <tr>
            <td>2032</td>
          </tr>
          <tr>
            <td>2033</td>
          </tr>
          <tr>
            <td>2034</td>
          </tr>
          <tr>
            <td>2035</td>
          </tr>
          <tr>
            <td>2036</td>
          </tr>
        </tbody>
      </Table>
    </Row>
  </Container>
);

export default StressTest2;
