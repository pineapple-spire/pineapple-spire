import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (id) {
    const rec = await prisma.stressTest1Scenario.findUnique({
      where: { id: Number(id) },
      select: { data: true },
    });
    return NextResponse.json(rec?.data);
  }

  const list = await prisma.stressTest1Scenario.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true },
  });
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  const { title, data } = await req.json();
  const created = await prisma.stressTest1Scenario.create({
    data: { title, data },
  });
  return NextResponse.json(created);
}
