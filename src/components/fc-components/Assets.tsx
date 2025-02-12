'use client';

import { Col, Container, Dropdown, DropdownButton, InputGroup, Form, Row, Table } from 'react-bootstrap';
import { useState } from 'react';
import FCNavbar from '@/components/fc-components/FCNavbar';

/* Dropdown button for the user to select forecast type (average or multiplier) */
const ForecastTypeDropdown = () => {
  const [selectedOption, setSelectedOption] = useState('Select');
  const handleSelect = (eventKey: string | null) => {
    if (eventKey) {
      setSelectedOption(eventKey);
    }
  };
  return (
    <DropdownButton size="sm" title={selectedOption} onSelect={handleSelect}>
      <Dropdown.Item eventKey="Average">Average</Dropdown.Item>
      <Dropdown.Item eventKey="Multiplier">Multiplier</Dropdown.Item>
    </DropdownButton>
  );
};

/* Multiplier input form to calculate a fields multiplier */
const MultiplierInput = () => {
  const [multiplier, setMultiplier] = useState('');
  const handleMultiplier = (event: { target: { value: any; }; }) => {
    const inputNumber = event.target.value;
    if (inputNumber === '') {
      setMultiplier('');
    } else {
      setMultiplier(inputNumber);
    }
  };
  return (
    <InputGroup className="mb-3">
      <InputGroup.Text>
        Enter % Multiplier
      </InputGroup.Text>
      <Form.Control
        placeholder="Enter a number 0-100"
        value={multiplier}
        onChange={handleMultiplier}
      />
    </InputGroup>
  );
};

/* Creates Assets table */
const FCTable = () => (
  <Container>
    <Row>
      <FCNavbar />
    </Row>
    <Row className="m-3">
      <Col>
        <MultiplierInput />
      </Col>
    </Row>
    <Row>
      <Table striped bordered>
        <thead>
          <tr>
            <th>Select Forecast Type</th>
            <th>Name</th>
            <th>Year 1</th>
            <th>Year 2</th>
            <th>Year 3</th>
            <th>Year 4</th>
            <th>Year 5</th>
            <th>Year 6</th>
            <th>Year 7</th>
            <th>Year 8</th>
            <th>Year 9</th>
            <th>Year 10</th>
            <th>Year 11</th>
            <th>Year 12</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><ForecastTypeDropdown /></td>
            <td>Cash and Cash Equivalents</td>
          </tr>
          <tr>
            <td><ForecastTypeDropdown /></td>
            <td>Accounts Receivable</td>
          </tr>
          <tr>
            <td><ForecastTypeDropdown /></td>
            <td>Inventory</td>
          </tr>
          <tr>
            <td>|</td>
            <td>Total Current Assets</td>
          </tr>
          <tr>
            <td><ForecastTypeDropdown /></td>
            <td>Property, Plant, & Equipment</td>
          </tr>
          <tr>
            <td><ForecastTypeDropdown /></td>
            <td>Investment</td>
          </tr>
          <tr>
            <td>|</td>
            <td>Total Long Term Assets</td>
          </tr>
          <tr>
            <td>|</td>
            <td>Total Assets</td>
          </tr>
        </tbody>
      </Table>
    </Row>
  </Container>
);

export default FCTable;
