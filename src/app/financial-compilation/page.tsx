import { getServerSession } from 'next-auth';
import { notUserProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import { getAuditData } from '@/lib/dbActions';
import FinancialCompilationClient from './FinancialCompilationClient';

export default async function FinancialCompilationPage() {
  const session = await getServerSession(authOptions);
  notUserProtectedPage(session as {
    user: { email: string; id: string; randomKey: string };
  } | null);

  const auditedData = await getAuditData();
  return <FinancialCompilationClient initialData={auditedData} />;
}
