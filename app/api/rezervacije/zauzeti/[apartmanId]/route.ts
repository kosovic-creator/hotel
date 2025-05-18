// app/api/rezervacije/zauzeti/[apartmanId]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { apartmanId: string } }
) {
  const apartmanId = parseInt(params.apartmanId, 10);
  const rezervacije = await prisma.rezervacija.findMany({
    where: { apartmanId },
    select: { pocetak: true, kraj: true }
  });

  // Vraća niz intervala
  return NextResponse.json(
    rezervacije.map(r => ({
      start: r.pocetak,
      end: r.kraj,
    }))
  );
}
