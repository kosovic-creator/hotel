/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop(); // ili koristite regex za preciznije

  try {
    const rezervacija = await prisma.rezervacija.findUnique({
      where: { id: Number(id) },
      include: { apartman: true }
    });

    if (!rezervacija) {
      return NextResponse.json(
        { greska: 'Rezervacija nije pronađena' },
        { status: 404 }
      );
    }

    return NextResponse.json(rezervacija);
  } catch (error) {
    return NextResponse.json(
      { greska: 'Serverska greška' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  try {
    const body = await req.json();

    const azuriranaRezervacija = await prisma.rezervacija.update({
      where: { id: Number(id) },
      data: body
    });

    return NextResponse.json(azuriranaRezervacija);
  } catch (error) {
    return NextResponse.json(
      { greska: 'Greška pri ažuriranju' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
