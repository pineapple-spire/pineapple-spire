import { getServerSession } from 'next-auth';
import { loggedInProtectedPage } from '@/lib/page-protection';
import authOptions from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import StressTestToolClient from './StressTestToolClient';

export default async function StressTestToolPage() {
  const session = await getServerSession(authOptions);
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );

  const scenarios = await prisma.stressScenario.findMany({
    orderBy: { title: 'asc' },
  });

  return <StressTestToolClient initialScenarios={scenarios} />;
}
