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