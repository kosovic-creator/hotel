model Rezervacija {
  id          String   @id @default(uuid())
  apartman    Apartman @relation(fields: [apartmanId], references: [id])
  apartmanId  String
  korisnik    Korisnik @relation(fields: [korisnikId], references: [id])
  korisnikId  String
  pocetak     DateTime
  kraj        DateTime
  gosti       Int
  status      String   @default("na čekanju")
  createdAt   DateTime @default(now())

}

model Korisnik {
  id            String    @id @default(uuid())
  email         String    @unique
  lozinka       String
  ime           String?
  prezime       String?
  rezervacije   Rezervacija[]
}



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
u bazi

[
    {
        "id": 1,
        "apartmanId": 1,
        "korisnikId": 1,
        "pocetak": "2025-05-18T00:00:00.000Z",
        "kraj": "2025-05-20T00:00:00.000Z",
        "gosti": 2,
        "status": "na čekanju",
        "createdAt": "2025-05-18T05:14:01.933Z",
        "apartman": {
            "id": 1,
            "naziv": "aleksić apartman",
            "opis": "pogled na Goricu",
            "cijena": 35,
            "slike": []
        }
    }
]


{


        "pocetak": "2025-06-18T12:00:00.000Z",
        "kraj": "2025-06-20T12:00:00.000Z"

        }
        JSON:
        {
    "dostupno": false
}
Znači trebal bi da bude" "dostupno": true".O čemu se radi?