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
  Dropdown,
} from 'react-bootstrap';
import { FaInfoCircle } from 'react-icons/fa';
import StressScenarioCard from '@/components/StressScenarioCard';
import StressTest1 from '@/components/StressTest1';
import StressTest2 from '@/components/StressTest2';
import StressTest3 from '@/components/StressTest3';
import StressTest4 from '@/components/StressTest4';

interface StressTestToolClientProps {
  initialScenarios: StressScenario[];
}

// TODO: Add other stress tests.
const stressTests = [
  { id: 'stress1', label: 'Stress Test 1', component: <StressTest1 /> },
  { id: 'stress2', label: 'Stress Test 2', component: <StressTest2 /> },
  { id: 'stress3', label: 'Stress Test 3', component: <StressTest3 /> },
  { id: 'stress4', label: 'Stress Test 4', component: <StressTest4 /> },
];

const StressTestToolClient: React.FC<StressTestToolClientProps> = ({ initialScenarios }) => {
  const [selectedTest, setSelectedTest] = useState(stressTests[0]);
  const [scenarios, setScenarios] = useState(initialScenarios);
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

  const [showInfo, setShowInfo] = useState(false);
  const handleInfoClick = () => {
    setShowInfo((prev) => !prev);
  };

  const handleAddScenario = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
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
        const errorData = await res.json();
        setError(errorData.message || 'Failed to add new scenario!');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-4 text-center d-flex flex-column align-items-center">
      {/* Title Section */}
      <h2 className="mb-4 d-flex align-items-center justify-content-center gap-2">
        Stress Test Tool
        {' '}
        <FaInfoCircle
          style={{ cursor: 'pointer', color: '#6c757d' }}
          onClick={handleInfoClick}
          title="Click for Info"
        />
      </h2>
      {showInfo && (
        <div className="text-center alert alert-info">
          <p>
            This tool allows you to simulate different scenarios. It offers in-browser experience and custom scenarios.
          </p>
        </div>
      )}

      {/* Pre-Defined Scenario Cards (Coded Pages) */}
      <h3 className="align-items-left">
        Coded Stress Tests (In-Browser Experience)
      </h3>
      <hr />

      {/* TODO: Add the other four stress tests here in dropdown menu. */}
      <Dropdown className="mb-3">
        <Dropdown.Toggle variant="primary" id="stress-test-dropdown">
          {selectedTest.label}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {stressTests.map((test) => (
            <Dropdown.Item key={test.id} onClick={() => setSelectedTest(test)}>
              {test.label}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      {selectedTest.component}

      {/* Custom Scenario Cards (Excel Workbooks) */}
      <h3>
        Custom Stress Tests (Redirect to Workbook)
      </h3>
      <hr />
      <div className="d-flex flex-column gap-3 align-items-center mb-4">
        {scenarios.map((s) => (
          <StressScenarioCard
            key={s.id}
            id={s.id}
            title={s.title}
            description={s.description}
          />
        ))}
      </div>

      {/* Add Button */}
      <div className="position-relative">
        <Button
          variant="outline-primary"
          onClick={handleModalShow}
        >
          Add Custom Scenario
        </Button>
      </div>

      {/* Modal for Adding a New Scenario */}
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
                type="text"
                name="title"
                value={newScenario.title}
                onChange={handleInputChange}
                placeholder="Enter scenario title"
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
                placeholder="Enter scenario description"
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
                placeholder="https://example.com/workbook.xlsx"
                required
                disabled={isSubmitting}
              />
              <Form.Text className="text-muted">
                Please provide a valid URL to the Excel workbook.
              </Form.Text>
            </Form.Group>

            <div className="d-grid gap-2 mt-4">
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
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
};

export default StressTestToolClient;
