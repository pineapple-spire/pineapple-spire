'use client';

import React from 'react';
import { Card } from 'react-bootstrap';

interface StressScenarioCardProps {
  title: string;
  description: string;
}

const StressScenarioCard: React.FC<StressScenarioCardProps> = ({ title, description }) => (
  <Card className="mb-3">
    <Card.Body className="d-flex justify-content-between align-items-center">
      <section>
        <h5>{title}</h5>
        <p>{description}</p>
      </section>
      <span>&gt;</span>
    </Card.Body>
  </Card>
);

export default StressScenarioCard;
