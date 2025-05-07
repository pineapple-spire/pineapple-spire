import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (id) {
    const rec = await prisma.stressTest2Scenario.findUnique({
      where: { id: Number(id) },
      select: {
        initialPercent: true,
        baseRevenue: true,
        growthRate: true,
        startYear: true,
        totalYears: true,
      },
    });
    return NextResponse.json(rec);
  }

  const list = await prisma.stressTest2Scenario.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true },
  });
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  const {
    title,
    initialPercent,
    baseRevenue,
    growthRate,
    startYear,
    totalYears,
  } = await req.json();

  const created = await prisma.stressTest2Scenario.create({
    data: {
      title,
      initialPercent,
      baseRevenue,
      growthRate,
      startYear,
      totalYears,
    },
  });

  return NextResponse.json(created);
}
