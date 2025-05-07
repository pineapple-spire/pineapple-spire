'use client';

import React, { useState } from 'react';
import { StressScenario } from '@prisma/client';
import {
  Container,
  Dropdown,
  OverlayTrigger,
  Tooltip,
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

  const [selected, setSelected] = useState(tests[0]);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <Container className="py-4 text-center d-flex flex-column align-items-center">
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

      <Dropdown className="mb-3">
        <Dropdown.Toggle variant="primary" id="stress-test-dropdown">
          {selected.label}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {tests.map((t) => (
            <Dropdown.Item key={t.id} onClick={() => setSelected(t)}>
              {t.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      {selected.component}
    </Container>
  );
};

export default StressTestToolClient;
