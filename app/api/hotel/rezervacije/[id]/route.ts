import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

function getIdFromRequest(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop(); // poslednji segment je id
  if (!id) throw new Error('ID id parametar nije nađen');
  return id;
}
// READ ONE
export async function GET(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    const rezervacije = await prisma.rezervacija.findUnique({
      where: { id: Number(id) },
      include: {
        sobe: true,
        gost: {
          select: {
            id: true,
            ime: true,
            email: true
          }
        }
      }
    });
    if (!rezervacije) return NextResponse.json({ error: 'Nije nađena Rezervacija' }, { status: 404 });
    return NextResponse.json(rezervacije);
  } catch {
    return NextResponse.json({ error: 'Neispravan ID' }, { status: 400 });
  }
}

// UPDATE
export async function PUT(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    const body = await request.json();
    const azurirano = await prisma.rezervacija.update({
      where: { id: Number(id) },
      data: body,
    });
    return NextResponse.json(azurirano);
  } catch {
    return NextResponse.json({ error: 'Rezervacija nije nađena ili nisu dobri podaci' }, { status: 404 });
  }
}

// DELETE
export async function DELETE(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    await prisma.rezervacija.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: 'Obrisana' });
  } catch {
    return NextResponse.json({ error: 'Nije nađena' }, { status: 404 });
  }
}
