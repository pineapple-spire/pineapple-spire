import { getServerSession } from 'next-auth';
import { loggedInProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import FSMClient from './FSMClient';

export default async function FiscalSustainabilityPage() {
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );

  return <FSMClient />;
}
