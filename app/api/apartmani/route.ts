/* eslint-disable @typescript-eslint/no-unused-vars */
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
