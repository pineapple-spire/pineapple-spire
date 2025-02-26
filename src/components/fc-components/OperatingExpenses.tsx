'use client';

import { Col, Container, Dropdown, DropdownButton, InputGroup, Form, Row, Table } from 'react-bootstrap';
import { useState } from 'react';
import FCNavbar from '@/components/fc-components/FCNavbar';
import MultiplierInput from '@/components/fc-components/MultiplierInput';

// Define the years for the table
const years = Array.from({ length: 12 }, (_, i) => 2025 + i);

// Define the financial categories for this page
const financialCategories = [
  'Salaries & Benefits',
  'Rent & Overhead',
  'Depreciation & Amortization',
  'Interest',
  'Total Operating Expenses',
  'Operating Expenses %',
  'Profit (loss) from Operations',
  'Profit (loss) from Operations %',
];

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

/* Creates Operating Expenses table */
const FCTable = () => {
  const [multiplier, setMultiplier] = useState<string>('');

  // Function to handle multiplier change and update state in FCTable
  const handleMultiplierChange = (value: string) => {
    setMultiplier(value);
  };
  return (
    <Container>
      <Row>
        <FCNavbar />
      </Row>
      <Row className="m-3">
        <Col>
          <h3 style={{ fontWeight: '600', color: '#4e73df' }}>Operating Expenses</h3>
          <p className="text-muted" style={{ fontSize: '1rem' }}>
            Analyze the different types of operating expenses and their forecast.
          </p>
        </Col>
        <Col>
          <MultiplierInput onMultiplierChange={handleMultiplierChange} />
        </Col>
      </Row>
      <Row>
        <div className="my-3" style={{ overflowX: 'auto', width: '100%' }}>
          <Table striped bordered>
            <thead>
              <tr>
                <th>Select Forecast Type</th>
                <th>Name</th>
                {years.map((year) => (
                  <th key={year}>{year}</th> // Displays years 2025–2036
                ))}
              </tr>
            </thead>
            <tbody>
              {financialCategories.map((name) => (
                <tr key={name}>
                  <td>{!(name.includes('Expenses') || name.includes('%')) ? <ForecastTypeDropdown /> : null}</td>
                  <td>{name}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Row>
    </Container>
  );
};

export default FCTable;
