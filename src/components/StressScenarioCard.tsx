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
    <Card
      onClick={handleCardClick}
      className="shadow-sm"
      style={{
        width: '200%',
        cursor: 'pointer',
        border: '1px solid #ddd',
        backgroundColor: '#f8f9fa',
        padding: '15px 20px',
      }}
    >
      <Card.Body className="d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-1">{title}</h5>
          <p className="mb-0 text-muted">{description}</p>
        </div>
        <span style={{ fontSize: '1.5rem', color: '#6c757d' }}>&rarr;</span>
      </Card.Body>
    </Card>
  );
};

export default StressScenarioCard;
