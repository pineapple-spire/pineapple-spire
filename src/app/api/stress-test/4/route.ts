import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (id) {
    const rec = await prisma.stressTest4Scenario.findUnique({
      where: { id: Number(id) },
      select: {
        initialExpense: true,
        increaseRate: true,
        returnRate: true,
      },
    });
    return NextResponse.json(rec);
  }

  const list = await prisma.stressTest4Scenario.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true },
  });
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  const { title, initialExpense, increaseRate, returnRate } = await req.json();
  const created = await prisma.stressTest4Scenario.create({
    data: {
      title,
      initialExpense,
      increaseRate,
      returnRate,
    },
  });
  return NextResponse.json(created);
}
