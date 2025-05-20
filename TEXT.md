package.json:
{
  "name": "apartmani",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
   "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint",
    "db:migrate": "npx prisma migrate dev",
    "db:reset": "prisma migrate reset && prisma migrate dev"
  },
  "dependencies": {
    "@next-auth/prisma-adapter": "^1.0.7",
    "@prisma/client": "^6.8.2",
    "@radix-ui/react-label": "^2.1.6",
    "@radix-ui/react-select": "^2.2.4",
    "@radix-ui/react-slot": "^1.2.2",
    "bcryptjs": "^3.0.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.511.0",
    "next": "15.3.2",
    "next-auth": "^4.24.11",
    "react": "^19.0.0",
    "react-datepicker": "^8.3.0",
    "react-dom": "^19.0.0",
    "tailwind-merge": "^3.3.0",
    "zod": "^3.24.4"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-datepicker": "^6.2.0",
    "@types/react-dom": "^19",
    "@types/uuid": "^10.0.0",
    "eslint": "^9",
    "eslint-config-next": "15.3.2",
    "prisma": "^6.8.2",
    "tailwindcss": "^4",
    "tw-animate-css": "^1.3.0",
    "typescript": "^5"
  }
}
Vercel build:
prisma generate && next build

schema-prusma:
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-3.0.x"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Korisnik {
  id          Int          @id @default(autoincrement())
  email       String       @unique
  lozinka     String
  ime         String?
  prezime     String?
  rezervacije Rezervacija[]
}

model Apartman {
  id          Int           @id @default(autoincrement())
  naziv       String
  opis        String
  cijena      Float
  slike       String[]
  rezervacije Rezervacija[]
}

model Rezervacija {
  id          Int       @id @default(autoincrement())
  apartman    Apartman  @relation(fields: [apartmanId], references: [id])
  apartmanId  Int
  korisnik    Korisnik?  @relation(fields: [korisnikId], references: [id])
  korisnikId  Int?
  pocetak     DateTime
  kraj        DateTime
  gosti       Int
  status      String    @default("na čekanju")
  createdAt   DateTime  @default(now())
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
}
db: DATABASE_URL="postgresql://neondb_owner:npg_mqtT6cgL8EWe@ep-broad-river-a4kdyeed-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"

Pitanje je sledeće:
U lokalom okruženju normalno se uloguijem sa nalogom koji je u bazi, mđutim to ne mogu na Vercelu, iako su podaci o korisniku u neon bazi net dobri?
