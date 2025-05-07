import { getServerSession } from 'next-auth';
import { analystOrExecutiveProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import ViewAuditedDataTable from '@/components/ViewAuditedDataTable';

export default async function ViewAuditedDataPage() {
  const session = await getServerSession(authOptions);
  analystOrExecutiveProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );

  return (
    <Container className="py-3">
      <Row className="mb-4">
        <Col>
          <h2 className="text-center">Audited Data</h2>
        </Col>
      </Row>
      <Row>
        <ViewAuditedDataTable />
      </Row>
    </Container>
  );
}
