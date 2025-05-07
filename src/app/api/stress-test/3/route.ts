import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (id) {
    const rec = await prisma.stressTest3Scenario.findUnique({
      where: { id: Number(id) },
      select: {
        title: true,
        annualRate: true,
        events: true,
      },
    });
    return NextResponse.json(rec);
  }

  const list = await prisma.stressTest3Scenario.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true },
  });
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  const { title, annualRate, events } = await req.json();
  const created = await prisma.stressTest3Scenario.create({
    data: {
      title,
      annualRate,
      events,
    },
  });

  return NextResponse.json(created);
}
