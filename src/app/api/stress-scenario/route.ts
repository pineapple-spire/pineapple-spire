import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line import/prefer-default-export
export async function POST(request: Request) {
  try {
    const { title, description } = await request.json();

    const newScenario = await prisma.stressScenario.create({
      data: { title, description },
    });

    return NextResponse.json(newScenario);
  } catch (error) {
    console.error('Error creating stress scenario:', error);
    return NextResponse.json(
      { error: 'Error creating stress scenario' },
      { status: 500 },
    );
  }
}
