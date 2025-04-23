'use client';

import React, { useState } from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';

type ForecastType = 'Average' | 'Multiplier';

interface ForecastTypeDropdownProps {
  onChange: (type: ForecastType) => void;
}

const ForecastTypeDropdown: React.FC<ForecastTypeDropdownProps> = ({ onChange }) => {
  const [selectedOption, setSelectedOption] = useState<ForecastType>('Average');
  const options: ForecastType[] = ['Average', 'Multiplier'];

  const handleSelect = (eventKey: string | null): void => {
    if (!eventKey) return;
    const key = eventKey as ForecastType;
    setSelectedOption(key);
    onChange(key);
  };

  return (
    <DropdownButton
      size="sm"
      title={selectedOption}
      onSelect={handleSelect}
    >
      {options
        .filter(opt => opt !== selectedOption)
        .map(opt => (
          <Dropdown.Item key={opt} eventKey={opt}>
            {opt}
          </Dropdown.Item>
        ))}
    </DropdownButton>
  );
};

export default ForecastTypeDropdown;
