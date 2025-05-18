import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const noviApartman = await prisma.apartman.create({
      data: body
    });
    return NextResponse.json(noviApartman, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Greška pri kreiranju apartmana' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const apartmani = await prisma.apartman.findMany();
  return NextResponse.json(apartmani);
}
model Apartman {
  id          Int           @id @default(autoincrement())
  naziv       String
  opis        String
  cijena      Float
  slike       String[]
  rezervacije Rezervacija[]
}

Na osnovu ovog api i prisma-schema Apartmai,napravi mi tsx tabelu.