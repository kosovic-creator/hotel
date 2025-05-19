/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/rezervacije/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const url = new URL(request.url);

  // Preciznije parsiranje ID-a regex-om
  const match = url.pathname.match(/\/api\/rezervacije\/(\d+)/);
  const id = match ? parseInt(match[1], 10) : null;

  if (!id) {
    return NextResponse.json(
      { greska: 'Neispravan ID rezervacije' },
      { status: 400 }
    );
  }

  try {
    const rezervacija = await prisma.rezervacija.findUnique({
      where: { id },
      include: {
        apartman: true,
        korisnik: {
          select: {
            id: true,
            ime: true,
            email: true
          }
        }
      }
    });

    if (!rezervacija) {
      return NextResponse.json(
        { greska: 'Rezervacija nije pronađena' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...rezervacija,
      // Formatiranje datuma ako je potrebno
      pocetak: rezervacija.pocetak.toISOString(),
      kraj: rezervacija.kraj.toISOString(),
      createdAt: rezervacija.createdAt.toISOString()
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

    // Pretvori datume u ISO string ako postoje
    if (body.pocetak) body.pocetak = new Date(body.pocetak).toISOString();
    if (body.kraj) body.kraj = new Date(body.kraj).toISOString();

    const azuriranaRezervacija = await prisma.rezervacija.update({
      where: { id: Number(id) },
      data: body
    });

    return NextResponse.json(azuriranaRezervacija);
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
