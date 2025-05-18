/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/rezervacije/dostupnost/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { apartmanId, pocetak, kraj } = await req.json();

    const postojeceRezervacije = await prisma.rezervacija.findMany({
      where: {
        apartmanId,
        OR: [
          { pocetak: { lte: new Date(kraj) } },
          { kraj: { gte: new Date(pocetak) } }
        ]
      }
    });

    return NextResponse.json({ dostupno: postojeceRezervacije.length === 0 });

  } catch (error) {
    return NextResponse.json(
      { greska: 'Greška pri provjeri dostupnosti' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
