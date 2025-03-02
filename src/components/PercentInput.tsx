import { Form, InputGroup } from 'react-bootstrap';
import { ChangeEvent } from 'react';

/**
 * A controlled input component for entering a percentage.
 *
 * @param percent - The current percentage value as a string.
 * @param onChange - A callback to update the percentage value.
 */
interface PercentInputProps {
  percent: string;
  onChange: (value: string) => void;
}

const PercentInput = ({ percent, onChange }: PercentInputProps) => {
  const handlePercent = (event: ChangeEvent<HTMLInputElement>) => {
    const inputNumber = event.target.value;
    onChange(inputNumber);
  };

  return (
    <InputGroup className="mb-3">
      <InputGroup.Text>% Decrease in Revenues</InputGroup.Text>
      <Form.Control
        placeholder="Enter a number 0-100"
        value={percent}
        onChange={handlePercent}
      />
    </InputGroup>
  );
};

export default PercentInput;
