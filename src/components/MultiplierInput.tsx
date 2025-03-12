'use client';

import { Form, Button, InputGroup } from 'react-bootstrap';
import { useState } from 'react';

interface MultiplierInputProps {
  onMultiplierChange: (value: number) => void; // Callback function to send the numeric value to the parent
}

const MultiplierInput: React.FC<MultiplierInputProps> = ({ onMultiplierChange }) => {
  const [multiplier, setMultiplier] = useState<string>(''); // Keeping it as a string to manage the input format

  const handleMultiplier = (event: { target: { value: string } }) => {
    const inputNumber = event.target.value;
    setMultiplier(inputNumber);
    const numericMultiplier = parseFloat(inputNumber);

    // Pass the numeric value to the parent if valid
    if (!Number.isNaN(numericMultiplier) && numericMultiplier >= 0 && numericMultiplier <= 100) {
      onMultiplierChange(numericMultiplier); // Call the parent function with the numeric value
    }
  };

  const handleClear = () => {
    setMultiplier(''); // Reset the local state
    onMultiplierChange(1); // Reset the multiplier to 1 in the parent (or whatever default value you prefer)
  };

  const numericMultiplier = parseFloat(multiplier);
  const isValidMultiplier = multiplier !== '' && !Number.isNaN(numericMultiplier) && numericMultiplier
  >= 0 && numericMultiplier <= 100;

  return (
    <Form.Group className="mb-3" style={{ maxWidth: '400px', width: '100%' }}>
      <Form.Label htmlFor="multiplierInput" style={{ fontWeight: 'bold', textAlign: 'center' }}>
        Enter % Multiplier
      </Form.Label>
      <InputGroup>
        <Form.Control
          id="multiplierInput"
          type="number"
          placeholder="Enter a number 0-100"
          value={multiplier}
          onChange={handleMultiplier}
          min="0"
          max="100"
          step="1"
          isInvalid={!isValidMultiplier && multiplier !== ''}
        />
        {multiplier && (
          <Button
            variant="outline-secondary"
            onClick={handleClear}
            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
          >
            Clear
          </Button>
        )}
      </InputGroup>

      <Form.Control.Feedback type="invalid">Please enter a number between 0 and 100.</Form.Control.Feedback>
    </Form.Group>
  );
};

export default MultiplierInput;
