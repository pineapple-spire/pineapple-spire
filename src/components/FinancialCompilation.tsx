'use client';

import { Col, Container, Dropdown, DropdownButton, Row, Table } from 'react-bootstrap';
import { useState } from 'react';

/** Dropdown */
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

/* Renders a single row in the List Stuff table. See list/page.tsx. */
const FCTable = () => (
  <Container>
    <Row className="m-3">
      <Col className="mx-auto">
        <DropdownButton title="Financial Compilation" size="lg" className="text-start">
          <Dropdown.Item>Insert other tools here</Dropdown.Item>
        </DropdownButton>
      </Col>
      <Col>
        <p className="text-center fw-light bg-light justify-content-center">12 Year Forecast Output</p>
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
            <td>Revenue</td>
          </tr>
          <tr>
            <td><ForecastTypeDropdown /></td>
            <td>Net Sales</td>
          </tr>
        </tbody>
      </Table>
    </Row>
  </Container>
);

export default FCTable;
