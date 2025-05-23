// app/api/rezervacije/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const url = new URL(request.url);

  // Preciznije parsiranje ID-a regex-om
  const match = url.pathname.match(/\/api\/korisnici\/(\d+)/);
  const id = match ? parseInt(match[1], 10) : null;

  if (!id) {
    return NextResponse.json(
      { greska: 'Neispravan ID korisnika' },
      { status: 400 }
    );
  }

  try {
    const korisnici= await prisma.korisnik.findUnique({
      where: { id }


    });

    if (!korisnici) {
      return NextResponse.json(
        { greska: 'Korisnik nije pronađena' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...korisnici,
      // Formatiranje datuma ako je potrebno

    });
  } catch (error) {
    console.error('Greška:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { greska: 'Serverska greška', detalji: errorMessage },
      { status: 500 }
    );
  }
}


export async function PUT(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  try {
    const body = await req.json();

    const azuriranKorisnik = await prisma.korisnik.update({
      where: { id: Number(id) },
      data: body
    });

    return NextResponse.json(azuriranKorisnik);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { greska: 'Greška pri ažuriranju' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const id = parseInt(url.pathname.split('/').pop() || '', 10); // Parse `id` as a number

  if (isNaN(id)) {
    return NextResponse.json({ message: 'ID nije prosleđen ili nije validan broj.' }, { status: 400 });
  }

  await prisma.korisnik.delete({ where: { id } }); // Use `id` as a number
  return NextResponse.json({ message: 'Deleted' });
}
