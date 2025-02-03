import { prisma } from '@/lib/prisma';
import StressTestToolClient from './StressTestToolClient';

export default async function StressTestToolPage() {
  const scenarios = await prisma.stressScenario.findMany({
    orderBy: { title: 'asc' },
  });

  return <StressTestToolClient initialScenarios={scenarios} />;
}
