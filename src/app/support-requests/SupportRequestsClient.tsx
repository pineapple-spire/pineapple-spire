'use client';

import React, { useState } from 'react';
import {
  Container,
  Table,
  Button,
  ButtonGroup,
  Badge,
} from 'react-bootstrap';
import { ContactUsData, ReportPageData } from '@prisma/client';
import swal from 'sweetalert';

type RequestType = 'contact' | 'report';
type RequestStatus = 'ALL' | 'ACTIVE' | 'RESOLVED' | 'ARCHIVED';

interface SupportRequestsClientProps {
  contactRecords: ContactUsData[];
  reportRecords: ReportPageData[];
}

function getBadgeVariant(status: 'ACTIVE' | 'RESOLVED' | 'ARCHIVED'): string {
  switch (status) {
    case 'ACTIVE':
      return 'success';
    case 'RESOLVED':
      return 'secondary';
    case 'ARCHIVED':
    default:
      return 'warning';
  }
}

export default function SupportRequestsClient({
  contactRecords: initialContacts,
  reportRecords: initialReports,
}: SupportRequestsClientProps) {
  const [viewType, setViewType] = useState<RequestType>('contact');
  const [statusFilter, setStatusFilter] = useState<RequestStatus>('ALL');
  const [contacts, setContacts] = useState(initialContacts);
  const [reports, setReports] = useState(initialReports);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const handleStatusUpdate = async (
    type: RequestType,
    id: number,
    newStatus: string,
  ) => {
    let actionText: string;
    if (newStatus === 'ARCHIVED') {
      actionText = 'Archive';
    } else if (newStatus === 'RESOLVED') {
      actionText = 'Resolve';
    } else {
      actionText = 'Restore';
    }

    const ok = await swal({
      title: `${actionText} entry?`,
      text: `Change status to ${newStatus.toLowerCase()}?`,
      icon: 'warning',
      buttons: ['Cancel', actionText],
      dangerMode: newStatus === 'ARCHIVED',
    });
    if (!ok) return;

    setLoadingIds((ids) => [...ids, id]);
    try {
      const res = await fetch(`/api/support/${type}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Update failed');
      const updated = await res.json();

      const updateState = (items: any[], setter: React.Dispatch<any>) => setter(
        items.map((item) => (item.id === id ? { ...item, status: updated.status } : item)),
      );

      if (type === 'contact') {
        updateState(contacts, setContacts);
      } else {
        updateState(reports, setReports);
      }

      swal(`${actionText}d`, `Entry marked ${newStatus.toLowerCase()}.`, 'success', {
        timer: 2000,
      });
    } catch (error) {
      console.error(error);
      swal('Error', 'Unable to update status.', 'error');
    } finally {
      setLoadingIds((ids) => ids.filter((i) => i !== id));
    }
  };

  const filteredRecords = () => {
    const data = viewType === 'contact' ? contacts : reports;
    return statusFilter === 'ALL'
      ? data
      : data.filter((r: any) => r.status === statusFilter);
  };

  const renderTable = () => {
    const rows = filteredRecords();
    const isContact = viewType === 'contact';

    if (rows.length === 0) {
      return (
        <p>
          No
          {' '}
          {statusFilter.toLowerCase()}
          {' '}
          {isContact ? 'contact messages' : 'problem reports'}
          .
        </p>
      );
    }

    return (
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>{isContact ? 'Submitted At' : 'Reported At'}</th>
            <th>Email</th>
            <th>{isContact ? 'Message' : 'Problem'}</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((rec: any) => (
            <tr key={rec.id}>
              <td>{new Date(rec.createdAt).toLocaleString()}</td>
              <td>{rec.email}</td>
              <td>{isContact ? rec.message : rec.problem}</td>
              <td>
                <Badge bg={getBadgeVariant(rec.status)}>
                  {rec.status}
                </Badge>
              </td>
              <td>
                <ButtonGroup>
                  {rec.status !== 'RESOLVED' && (
                    <Button
                      size="sm"
                      variant="outline-primary"
                      disabled={loadingIds.includes(rec.id)}
                      onClick={() => handleStatusUpdate(viewType, rec.id, 'RESOLVED')}
                    >
                      {(loadingIds.includes(rec.id) && 'Resolving...') || 'Resolve'}
                    </Button>
                  )}
                  {rec.status !== 'ARCHIVED' && (
                    <Button
                      size="sm"
                      variant="outline-warning"
                      disabled={loadingIds.includes(rec.id)}
                      onClick={() => handleStatusUpdate(viewType, rec.id, 'ARCHIVED')}
                    >
                      {(loadingIds.includes(rec.id) && 'Archiving...') || 'Archive'}
                    </Button>
                  )}
                  {rec.status === 'ARCHIVED' && (
                    <Button
                      size="sm"
                      variant="outline-success"
                      disabled={loadingIds.includes(rec.id)}
                      onClick={() => handleStatusUpdate(viewType, rec.id, 'ACTIVE')}
                    >
                      {(loadingIds.includes(rec.id) && 'Restoring...') || 'Restore'}
                    </Button>
                  )}
                </ButtonGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4 text-center">Support Requests</h1>
      <ButtonGroup className="mb-3 justify-content-center">
        <Button
          variant={viewType === 'contact' ? 'primary' : 'outline-primary'}
          onClick={() => setViewType('contact')}
        >
          Contact Messages
        </Button>
        <Button
          variant={viewType === 'report' ? 'primary' : 'outline-primary'}
          onClick={() => setViewType('report')}
        >
          Problem Reports
        </Button>
      </ButtonGroup>
      <br />
      <ButtonGroup className="mb-3 justify-content-center">
        {['ALL', 'ACTIVE', 'RESOLVED', 'ARCHIVED'].map((s) => (
          <Button
            key={s}
            variant={statusFilter === s ? 'dark' : 'outline-dark'}
            onClick={() => setStatusFilter(s as RequestStatus)}
          >
            {s}
          </Button>
        ))}
      </ButtonGroup>

      {renderTable()}
    </Container>
  );
}
