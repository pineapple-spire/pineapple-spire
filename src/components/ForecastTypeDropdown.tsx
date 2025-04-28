'use client';

import React from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';

export type ForecastType = 'Average' | 'Multiplier';

interface ForecastTypeDropdownProps {
  value: ForecastType;
  onChange: (type: ForecastType) => void;
}

const ForecastTypeDropdown: React.FC<ForecastTypeDropdownProps> = ({ value, onChange }) => {
  const options: ForecastType[] = ['Average', 'Multiplier'];

  const handleSelect = (eventKey: string | null): void => {
    if (!eventKey) return;
    onChange(eventKey as ForecastType);
  };

  return (
    <DropdownButton
      size="sm"
      title={value}
      onSelect={handleSelect}
    >
      {options
        .filter(opt => opt !== value)
        .map(opt => (
          <Dropdown.Item key={opt} eventKey={opt}>
            {opt}
          </Dropdown.Item>
        ))}
    </DropdownButton>
  );
};

export default ForecastTypeDropdown;
