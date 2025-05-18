/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const noviKorisnik = await prisma.korisnik.create({
      data: body
    });
    return NextResponse.json(noviKorisnik, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Greška pri kreiranju korisnika' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const korisnici = await prisma.korisnik.findMany();
  return NextResponse.json(korisnici);
}


export async function GET() {
  const apartmani = await prisma.apartman.findMany();
  return NextResponse.json(apartmani);
}
model Korisnik {
  id          Int          @id @default(autoincrement())
  email       String       @unique
  lozinka     String
  ime         String?
  prezime     String?
  rezervacije Rezervacija[]
}

Na osnovu ovog api i prisma-schema Korisnik,napravi mi tsx tabelu.