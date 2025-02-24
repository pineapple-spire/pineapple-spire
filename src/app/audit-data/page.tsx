import { getServerSession } from 'next-auth';
import { loggedInProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import AuditDataForm from '@/components/AuditDataForm';

export default async function AuditDataPage() {
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );

  return (
    <Container className="py-3">
      <Row className="mb-4">
        <Col>
          <h2 className="text-center">Audit Data</h2>
        </Col>
      </Row>
      <Row>
        <AuditDataForm />
      </Row>
    </Container>
  );
}
