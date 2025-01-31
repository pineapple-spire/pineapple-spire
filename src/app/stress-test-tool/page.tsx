import React from 'react';
import { Container, Button } from 'react-bootstrap';
import StressScenarioCard from '@/components/StressScenarioCard';

/** The Stress Test Tool page. */
const StressTestTool = () => (
  <Container as="section" className="text-center py-4">
    <h2>Stress Test Tool</h2>
    <section className="my-3">
      <StressScenarioCard
        title="Stress Scenario #1"
        description="Description of Stress Test #1"
      />
      <StressScenarioCard
        title="Stress Scenario #2"
        description="Description of Stress Test #2"
      />
      <Button variant="primary" className="mt-3" aria-label="Add Scenario">
        +
      </Button>
    </section>
  </Container>
);

export default StressTestTool;
