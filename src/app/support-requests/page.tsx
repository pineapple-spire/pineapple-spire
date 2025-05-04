import React from 'react';
import { getContactUsData, getReportData } from '@/lib/dbActions';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { analystOrAdminProtectedPage } from '@/lib/page-protection';
import SupportRequestsClient from './SupportRequestsClient';

export default async function SupportRequestsPage() {
  const session = await getServerSession(authOptions);
  analystOrAdminProtectedPage(session as {
    user: { email: string; id: string; randomKey: string };
  } | null);

  const [contactRecords, reportRecords] = await Promise.all([
    getContactUsData(),
    getReportData(),
  ]);

  return (
    <SupportRequestsClient
      contactRecords={contactRecords}
      reportRecords={reportRecords}
    />
  );
}
