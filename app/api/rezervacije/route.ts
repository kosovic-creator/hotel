/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

const RezervacijaSchema = z.object({
  apartmanId: z.number().int().positive(),
  korisnikId: z.number().int().positive(), // Promijenite u number
  pocetak: z.string().datetime(),
  kraj: z.string().datetime(),
  gosti: z.number().int().positive()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.pocetak) body.pocetak = new Date(body.pocetak).toISOString();
    if (body.kraj) body.kraj = new Date(body.kraj).toISOString();

    const validacija = RezervacijaSchema.safeParse(body);

    if (!validacija.success) {
      return NextResponse.json(
        { greske: validacija.error.flatten() },
        { status: 400 }
      );
    }

  const novaRezervacija = await prisma.rezervacija.create({
    data: {
      ...validacija.data,
      pocetak: new Date(validacija.data.pocetak),
      kraj: new Date(validacija.data.kraj)
    }
  });

    return NextResponse.json(novaRezervacija, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { greska: 'Serverska greška' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
    redirect('/admin/rezervacije');
  }
}

export async function GET() {
  try {
    const rezervacije = await prisma.rezervacija.findMany({
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
    return NextResponse.json(rezervacije);
  } catch (error) {
    return NextResponse.json(
      { greska: 'Greška pri dohvatu rezervacija' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
