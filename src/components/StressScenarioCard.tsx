'use client';

import React from 'react';
import { Card } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

interface StressScenarioProps {
  id: number;
  title: string;
  description: string;
}

const StressScenarioCard: React.FC<StressScenarioProps> = ({ id, title, description }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/stress-test-tool/${id}`);
  };

  return (
    <Card className="mb-3" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <Card.Body className="d-flex justify-content-between align-items-center">
        <section>
          <h5>{title}</h5>
          <p>{description}</p>
        </section>
        <span>&gt;</span>
      </Card.Body>
    </Card>
  );
};

export default StressScenarioCard;
