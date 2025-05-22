import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Nevalidan JSON u telu zahteva." }, { status: 400 });
  }
  const { email, password, role } = body;
  const user = await prisma.user.update({
    where: { id: Number(id) }, // koristi broj prema modelu
    data: { email, password, role },
  });
  return NextResponse.json(user);
}
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
const { id } = await params; // <--- OBAVEZNO
  await prisma.user.delete({ where: { id: Number(id) } });
  return NextResponse.json({ message: 'Deleted' });
}
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
const { id } = await params; // <--- OBAVEZNO


  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
  });

  if (!user) {
    return NextResponse.json({ message: 'Korisnik nije nađen' }, { status: 404 });
  }

  return NextResponse.json(user);
}
