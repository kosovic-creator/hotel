-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "Gost" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "ime" TEXT,
    "prezime" TEXT,

    CONSTRAINT "Gost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sobe" (
    "id" SERIAL NOT NULL,
    "naziv" TEXT NOT NULL,
    "opis" TEXT NOT NULL,
    "cijena" DOUBLE PRECISION NOT NULL,
    "slike" TEXT[],

    CONSTRAINT "Sobe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rezervacija" (
    "id" SERIAL NOT NULL,
    "sobeId" INTEGER NOT NULL,
    "gostId" INTEGER,
    "pocetak" TIMESTAMP(3) NOT NULL,
    "kraj" TIMESTAMP(3) NOT NULL,
    "osoba" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'na čekanju',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rezervacija_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test" (
    "id" SERIAL NOT NULL,
    "ime" TEXT NOT NULL,
    "broj" INTEGER,

    CONSTRAINT "test_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Gost_email_key" ON "Gost"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Rezervacija" ADD CONSTRAINT "Rezervacija_sobeId_fkey" FOREIGN KEY ("sobeId") REFERENCES "Sobe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rezervacija" ADD CONSTRAINT "Rezervacija_gostId_fkey" FOREIGN KEY ("gostId") REFERENCES "Gost"("id") ON DELETE SET NULL ON UPDATE CASCADE;
