import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (id) {
    const rec = await prisma.stressTest5Scenario.findUnique({
      where: { id: Number(id) },
      select: {
        presentValue: true,
        interestRate: true,
        term: true,
        fullyFunded: true,
        contributions: true, // JSON array of { year, contribution }
      },
    });
    return NextResponse.json(rec);
  }

  const list = await prisma.stressTest5Scenario.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true },
  });
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  const {
    title,
    presentValue,
    interestRate,
    term,
    fullyFunded,
    contributions,
  } = await req.json();

  const created = await prisma.stressTest5Scenario.create({
    data: {
      title,
      presentValue,
      interestRate,
      term,
      fullyFunded,
      contributions,
    },
  });

  return NextResponse.json(created);
}
