'use client';

import { useState } from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';

// ForecastTypeDropdown component
const ForecastTypeDropdown = ({ onChange }: { onChange: (type: string) => void }) => {
  const [selectedOption, setSelectedOption] = useState('Select');

  const handleSelect = (eventKey: string | null) => {
    if (eventKey) {
      setSelectedOption(eventKey);
      onChange(eventKey); // Call the parent onChange function with the selected option
    }
  };

  return (
    <DropdownButton size="sm" title={selectedOption} onSelect={handleSelect}>
      <Dropdown.Item eventKey="Average">Average</Dropdown.Item>
      <Dropdown.Item eventKey="Multiplier">Multiplier</Dropdown.Item>
    </DropdownButton>
  );
};

export default ForecastTypeDropdown;
