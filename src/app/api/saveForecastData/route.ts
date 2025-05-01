import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Update path as needed

// eslint-disable-next-line import/prefer-default-export
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.records || !Array.isArray(body.records)) {
      return NextResponse.json({ success: false, error: 'Missing or invalid records' }, { status: 400 });
    }

    await prisma.forecastData.createMany({
      data: body.records,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
