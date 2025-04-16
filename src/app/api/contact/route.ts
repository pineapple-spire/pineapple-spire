import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// eslint-disable-next-line import/prefer-default-export
export async function POST(request: Request) {
  try {
    const { email, message } = await request.json();

    if (!email || !message) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    await prisma.contactUsData.create({
      data: {
        email,
        message,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating contact message:', error);
    return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
  }
}
