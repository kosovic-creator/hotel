/* eslint-disable @typescript-eslint/no-unused-vars */
// components/RezervacijaForma.tsx
'use client';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function RezervacijaForma({ apartmanId }: { apartmanId: number }) {
  const [pocetak, setPocetak] = useState<Date | null>(null);
  const [kraj, setKraj] = useState<Date | null>(null);
  const [gosti, setGosti] = useState(1);

  const potvrdiRezervaciju = async () => {
    const odgovor = await fetch('/api/rezervacije', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apartmanId,
        korisnikId: 1, // Zamijeniti sa stvarnim ID-om
        pocetak: pocetak?.toISOString(),
        kraj: kraj?.toISOString(),
        gosti
      })
    });

    if (odgovor.ok) {
      alert('Rezervacija uspješna!');
    }
  };

  return (
    <div className="max-w-md p-6 bg-white rounded-lg shadow">
      <div className="mb-4">
        <label className="block mb-2">Odaberite datume:</label>
        <DatePicker
          selected={pocetak}
          onChange={(dates: [Date | null, Date | null]) => {
            const [start, end] = dates;
            setPocetak(start);
            setKraj(end);
          }}
          startDate={pocetak}
          endDate={kraj}
          selectsRange
          minDate={new Date()}
          inline
        />
      </div>
      <button
        onClick={potvrdiRezervaciju}
        className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
      >
        Rezerviši
      </button>
    </div>
  );
}

api  :
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const RezervacijaSchema = z.object({
  apartmanId: z.number().int().positive(),
  korisnikId: z.string().uuid(),
  pocetak: z.string().datetime(),
  kraj: z.string().datetime(),
  gosti: z.number().int().positive()
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validacija = RezervacijaSchema.safeParse(body);

    if (!validacija.success) {
      return NextResponse.json(
        { greske: validacija.error.flatten() },
        { status: 400 }
      );
    }

    const novaRezervacija = await prisma.rezervacija.create({
      data: {
        ...validacija.data,
        apartmanId: validacija.data.apartmanId,
        korisnikId: Number(validacija.data.korisnikId),
        pocetak: new Date(validacija.data.pocetak),
        kraj: new Date(validacija.data.kraj)
      }
    });

    return NextResponse.json(novaRezervacija, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { greska: 'Serverska greška' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  try {
    const rezervacije = await prisma.rezervacija.findMany({
      include: { apartman: true }
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

page.tsx:
import RezervacijaForma from "@/components/RezervacijaForma";


export default function Home() {
  return (
    <>
<RezervacijaForma apartmanId={1} />
    </>
  );
}


 Kada probam da rezervišem apartman daje grešku:
  ✓ Compiled /api/rezervacije in 546ms
 POST /api/rezervacije 400 in 726ms
 Gdje griješim?