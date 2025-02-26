// MultiplierInput.tsx
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { useState } from 'react';

interface MultiplierInputProps {
  onMultiplierChange: (value: string) => void; // Callback function to send the value to the parent
}

const MultiplierInput: React.FC<MultiplierInputProps> = ({ onMultiplierChange }) => {
  const [multiplier, setMultiplier] = useState('');

  // Handle the multiplier input
  const handleMultiplier = (event: { target: { value: string } }) => {
    const inputNumber = event.target.value;
    setMultiplier(inputNumber);
    onMultiplierChange(inputNumber); // Call the parent function to pass the value
  };

  const handleClear = () => {
    setMultiplier('');
    onMultiplierChange(''); // Clear the value in the parent component as well
  };

  const numericMultiplier = parseFloat(multiplier);
  const isValidMultiplier =
    multiplier !== '' && !isNaN(numericMultiplier) && numericMultiplier >= 0 && numericMultiplier <= 100;

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
