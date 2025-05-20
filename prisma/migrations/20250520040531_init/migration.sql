-- CreateTable
CREATE TABLE "Korisnik" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "lozinka" TEXT NOT NULL,
    "ime" TEXT,
    "prezime" TEXT,

    CONSTRAINT "Korisnik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Apartman" (
    "id" SERIAL NOT NULL,
    "naziv" TEXT NOT NULL,
    "opis" TEXT NOT NULL,
    "cijena" DOUBLE PRECISION NOT NULL,
    "slike" TEXT[],

    CONSTRAINT "Apartman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rezervacija" (
    "id" SERIAL NOT NULL,
    "apartmanId" INTEGER NOT NULL,
    "korisnikId" INTEGER,
    "pocetak" TIMESTAMP(3) NOT NULL,
    "kraj" TIMESTAMP(3) NOT NULL,
    "gosti" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'na čekanju',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rezervacija_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Korisnik_email_key" ON "Korisnik"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Rezervacija" ADD CONSTRAINT "Rezervacija_apartmanId_fkey" FOREIGN KEY ("apartmanId") REFERENCES "Apartman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rezervacija" ADD CONSTRAINT "Rezervacija_korisnikId_fkey" FOREIGN KEY ("korisnikId") REFERENCES "Korisnik"("id") ON DELETE SET NULL ON UPDATE CASCADE;
