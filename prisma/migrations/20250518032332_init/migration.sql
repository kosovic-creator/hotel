-- CreateTable
CREATE TABLE "Apartman" (
    "id" TEXT NOT NULL,
    "naziv" TEXT NOT NULL,
    "opis" TEXT NOT NULL,
    "cijena" DOUBLE PRECISION NOT NULL,
    "slike" TEXT[],

    CONSTRAINT "Apartman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rezervacija" (
    "id" TEXT NOT NULL,
    "apartmanId" TEXT NOT NULL,
    "korisnikId" TEXT NOT NULL,
    "pocetak" TIMESTAMP(3) NOT NULL,
    "kraj" TIMESTAMP(3) NOT NULL,
    "gosti" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'na čekanju',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rezervacija_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Korisnik" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "lozinka" TEXT NOT NULL,
    "ime" TEXT,
    "prezime" TEXT,

    CONSTRAINT "Korisnik_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Korisnik_email_key" ON "Korisnik"("email");

-- AddForeignKey
ALTER TABLE "Rezervacija" ADD CONSTRAINT "Rezervacija_apartmanId_fkey" FOREIGN KEY ("apartmanId") REFERENCES "Apartman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rezervacija" ADD CONSTRAINT "Rezervacija_korisnikId_fkey" FOREIGN KEY ("korisnikId") REFERENCES "Korisnik"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
