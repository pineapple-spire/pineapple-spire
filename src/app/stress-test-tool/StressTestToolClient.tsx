'use client';

import React, { useState } from 'react';
import { StressScenario } from '@prisma/client';
import {
  Container,
  OverlayTrigger,
  Tooltip,
  Tabs,
  Tab,
} from 'react-bootstrap';
import { FaInfoCircle } from 'react-icons/fa';
import StressTest1 from '@/components/StressTest1';
import StressTest2 from '@/components/StressTest2';
import StressTest3 from '@/components/StressTest3';
import StressTest4 from '@/components/StressTest4';
import StressTest5 from '@/components/StressTest5';
import StressTestCustom from '@/components/StressTestCustom';

interface StressTestToolClientProps {
  initialScenarios: StressScenario[];
}

const StressTestToolClient: React.FC<StressTestToolClientProps> = ({
  initialScenarios,
}) => {
  const tests = [
    { id: 'stress1', label: 'Stress Test 1', component: <StressTest1 /> },
    { id: 'stress2', label: 'Stress Test 2', component: <StressTest2 /> },
    { id: 'stress3', label: 'Stress Test 3', component: <StressTest3 /> },
    { id: 'stress4', label: 'Stress Test 4', component: <StressTest4 /> },
    { id: 'stress5', label: 'Stress Test 5', component: <StressTest5 /> },
    {
      id: 'custom',
      label: 'Custom Stress Tests',
      component: <StressTestCustom initialScenarios={initialScenarios} />,
    },
  ];

  const [showInfo, setShowInfo] = useState(false);

  return (
    <Container className="py-4 text-center d-flex flex-column align-items-center">
      {/* Inline CSS injection */}
      <style>
        {`
          .nav-tabs .nav-link.active {
            background-color: #6c757d;
            color: white;
          }
          .nav-tabs .nav-link {
            cursor: pointer;
          }
        `}
      </style>

      <h2 className="mb-4 d-flex align-items-center gap-2">
        Stress Test Tool
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="info-tooltip">Click for Info</Tooltip>}
        >
          <FaInfoCircle
            style={{ cursor: 'pointer', color: '#6c757d' }}
            onClick={() => setShowInfo((v) => !v)}
          />
        </OverlayTrigger>
      </h2>

      {showInfo && (
        <div className="alert alert-info text-left w-100">
          Stress Test 1 through 5 are programmed and their backend is
          directly linked to the forecasting models. Analysts can add stress
          tests that redirect to Excel workbooks.
        </div>
      )}

      <Tabs defaultActiveKey="stress1" className="mb-3 w-100" fill>
        {tests.map((t) => (
          <Tab eventKey={t.id} title={t.label} key={t.id}>
            {t.component}
          </Tab>
        ))}
      </Tabs>
    </Container>
  );
};

export default StressTestToolClient;
