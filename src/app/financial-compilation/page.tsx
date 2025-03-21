import { getServerSession } from 'next-auth';
import { loggedInProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import { generateRandomFinancialData } from '@/lib/mathUtils';
import FinancialCompilationClient from './FinancialCompilationClient';

export default async function FinancialCompilationPage() {
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(session as {
    user: { email: string; id: string; randomKey: string };
  } | null);

  const randomData = generateRandomFinancialData(2025);
  return <FinancialCompilationClient initialData={randomData} />;
}
