'use client';

import React, { useState } from 'react';
import { StressScenario } from '@prisma/client';
import { Container, Button, Modal, Form } from 'react-bootstrap';
import StressScenarioCard from '@/components/StressScenarioCard';

interface StressTestToolClientProps {
  initialScenarios: StressScenario[];
}

const StressTestToolClient: React.FC<StressTestToolClientProps> = ({ initialScenarios }) => {
  const [scenarios, setScenarios] = useState(initialScenarios);
  const [showModal, setShowModal] = useState(false);
  const [newScenario, setNewScenario] = useState({ title: '', description: '' });

  const handleModalClose = () => {
    setShowModal(false);
    setNewScenario({ title: '', description: '' });
  };

  const handleModalShow = () => setShowModal(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewScenario({ ...newScenario, [e.target.name]: e.target.value });
  };

  const handleAddScenario = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch('/api/stress-scenario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newScenario),
    });

    if (res.ok) {
      const savedScenario: StressScenario = await res.json();
      setScenarios([...scenarios, savedScenario]);
      handleModalClose();
    } else {
      console.error('Failed to add new test!');
    }
  };

  return (
    <Container as="section" className="text-center py-4">
      <h2>Stress Test Tool</h2>
      <section className="my-3">
        {scenarios.map((s) => (
          <StressScenarioCard key={s.id} id={s.id} title={s.title} description={s.description} />
        ))}
        <Button variant="primary" className="mt-3" aria-label="Add Scenario" onClick={handleModalShow}>
          +
        </Button>
      </section>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Stress Scenario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddScenario}>
            <Form.Group controlId="scenarioTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newScenario.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="scenarioDescription" className="mt-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={newScenario.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Add Scenario
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default StressTestToolClient;
