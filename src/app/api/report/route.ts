import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line import/prefer-default-export
export async function POST(request: Request) {
  try {
    const { email, problem } = await request.json();

    if (!email || !problem) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    await prisma.reportPageData.create({
      data: {
        email,
        problem,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating reported problem:', error);
    return NextResponse.json({ error: 'Failed to report problem.' }, { status: 500 });
  }
}
