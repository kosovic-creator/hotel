import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  // Parsiraj apartmanId iz URL-a
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const apartmanIdStr = pathParts[pathParts.length - 1];
  const apartmanId = parseInt(apartmanIdStr, 10);

  if (isNaN(apartmanId)) {
    return NextResponse.json({ error: 'Neispravan apartmanId' }, { status: 400 });
  }

  const rezervacije = await prisma.rezervacija.findMany({
    where: { apartmanId },
    select: { pocetak: true, kraj: true }
  });

  return NextResponse.json(
    rezervacije.map(r => ({
      start: r.pocetak,
      end: r.kraj,
    }))
  );
}

