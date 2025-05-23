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
