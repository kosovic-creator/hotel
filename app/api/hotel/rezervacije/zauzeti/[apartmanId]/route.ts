import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const apartmanId = parseInt(pathParts[pathParts.length - 1], 10);

  if (isNaN(apartmanId)) {
    return NextResponse.json({ error: 'Neispravan ID apartmana' }, { status: 400 });
  }

  const rezervacije = await prisma.rezervacija.findMany({
    where: { apartmanId },
    select: {
      pocetak: true,
      kraj: true,
      korisnik: {
        select: {
          ime: true,
          prezime: true
        }
      }
    }
  });

  return NextResponse.json(
    rezervacije.map(r => ({
      start: r.pocetak,
      end: r.kraj,
      imeKorisnika: r.korisnik?.ime ?? null,
      prezimeKorisnika: r.korisnik?.prezime ?? null
    }))
  );
}
