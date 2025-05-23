/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
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

// CREATE
export async function POST(request: NextRequest) {
  const body = await request.json();
  const novaRezervacija = await prisma.rezervacija.create({
    data: body,
  });
  return NextResponse.json(novaRezervacija);
}

// READ (svi todo)
export async function GET() {
  try {
    const rezervacije = await prisma.rezervacija.findMany({
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
