'use client';

import React from 'react';
import { Container, Card } from 'react-bootstrap';

/* Render a Not Found page if the user enters a URL that doesn't match any route. */
const NotFound: React.FC = () => (
  <Container
    fluid
    className="d-flex vh-100 align-items-center justify-content-center"
  >
    <Card
      className="text-center shadow-sm border-0 p-4"
      style={{ maxWidth: 450, width: '100%' }}
    >
      <Card.Title as="h2" className="mb-2">
        404. That&apos;s an error.
      </Card.Title>
      <Card.Text className="mb-4 text-muted">
        Here by mistake?
      </Card.Text>
    </Card>
  </Container>
);

export default NotFound;
