'use client';

import React, { useState } from 'react';
import { StressScenario } from '@prisma/client';
import {
  Container,
  Button,
  Modal,
  Form,
  Spinner,
  Alert,
} from 'react-bootstrap';
import StressScenarioCard from '@/components/StressScenarioCard';

interface CustomStressTestsProps {
  initialScenarios: StressScenario[];
}

export default function CustomStressTests({
  initialScenarios,
}: CustomStressTestsProps) {
  const [scenarios, setScenarios] = useState<StressScenario[]>(initialScenarios);
  const [showModal, setShowModal] = useState(false);
  const [newScenario, setNewScenario] = useState({
    title: '',
    description: '',
    excelWorkbookUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleModalClose = () => {
    setShowModal(false);
    setNewScenario({ title: '', description: '', excelWorkbookUrl: '' });
    setError('');
  };
  const handleModalShow = () => setShowModal(true);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setNewScenario({ ...newScenario, [e.target.name]: e.target.value });
  };

  const handleAddScenario = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/stress-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newScenario),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to add scenario');
      }

      const saved: StressScenario = await res.json();
      setScenarios((prev) => [...prev, saved]);
      handleModalClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container fluid className="py-4 text-center bg-transparent">
      <h3>Custom Stress Tests (Redirect to Workbook)</h3>
      <hr />
      <div className="d-flex flex-column gap-3 align-items-center mb-4 bg-transparent">
        {scenarios.map((s) => (
          <StressScenarioCard
            key={s.id}
            id={s.id}
            title={s.title}
            description={s.description}
          />
        ))}
      </div>
      <Button variant="outline-primary" onClick={handleModalShow}>
        Add Custom Scenario
      </Button>

      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Stress Scenario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleAddScenario}>
            <Form.Group controlId="scenarioTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                value={newScenario.title}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </Form.Group>

            <Form.Group controlId="scenarioDescription" className="mt-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newScenario.description}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </Form.Group>

            <Form.Group controlId="scenarioExcelLink" className="mt-3">
              <Form.Label>Excel Workbook URL</Form.Label>
              <Form.Control
                type="url"
                name="excelWorkbookUrl"
                value={newScenario.excelWorkbookUrl}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </Form.Group>

            <div className="d-grid gap-2 mt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Adding...
                  </>
                ) : (
                  'Add Scenario'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
