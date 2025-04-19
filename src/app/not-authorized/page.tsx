'use client';

import React from 'react';
import { Container, Card } from 'react-bootstrap';

/** Render a Not Authorized page if the user enters a URL that they don't have authorization for. */
const NotAuthorized: React.FC = () => (
  <Container
    fluid
    className="d-flex vh-100 align-items-center justify-content-center"
  >
    <Card
      className="text-center shadow-sm border-0 p-4"
      style={{ maxWidth: 450, width: '100%' }}
    >
      <Card.Title as="h2" className="mb-2">
        Access Denied
      </Card.Title>
      <Card.Text className="mb-4 text-muted">
        You don&apos;t have permission to be here.
      </Card.Text>
    </Card>
  </Container>
);

export default NotAuthorized;
