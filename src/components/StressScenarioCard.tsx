'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

interface StressScenarioProps {
  id: number;
  title: string;
  description: string;
  excelWorkbookUrl: string;
}

const StressScenarioCard: React.FC<StressScenarioProps> = ({ id, title, description, excelWorkbookUrl }) => {
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
          <Link
            href={excelWorkbookUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open Excel Workbook
          </Link>
        </section>
        <span>&gt;</span>
      </Card.Body>
    </Card>
  );
};

export default StressScenarioCard;
