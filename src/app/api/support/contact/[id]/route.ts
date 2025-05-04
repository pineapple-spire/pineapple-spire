import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const ALLOWED_STATUSES = ['ACTIVE', 'RESOLVED', 'ARCHIVED'] as const;

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const id = parseInt(params.id, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  try {
    await prisma.contactUsData.delete({ where: { id } });
    return NextResponse.json({ message: 'Contact submission deleted' });
  } catch (error) {
    console.error('DELETE /contact error', error);
    return NextResponse.json(
      { error: 'Failed to delete contact submission' },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const id = parseInt(params.id, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { status } = body;
  if (!ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `Status must be one of ${ALLOWED_STATUSES.join(', ')}` },
      { status: 400 },
    );
  }

  try {
    const updated = await prisma.contactUsData.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PATCH /contact error', error);
    return NextResponse.json(
      { error: 'Failed to update contact submission' },
      { status: 500 },
    );
  }
}
