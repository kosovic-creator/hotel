export async function PUT(req: Request) {
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  try {
    const body = await req.json();

    const azuriranaRezervacija = await prisma.rezervacija.update({
      where: { id: Number(id) },
      data: body
    });

    return NextResponse.json(azuriranaRezervacija);
  } catch (error) {
    return NextResponse.json(
      { greska: 'Greška pri ažuriranju' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
Postman:  metod PUT http://localhost:3000/api/rezervacije/1
body:
      {
        "apartmanId": 1,
        "korisnikId": 1,
        "pocetak": "2025-06-18",
        "kraj": "2025-06-20",
       "gosti":5
        }

 Greška JSON:
{
    "greska": "Greška pri ažuriranju"
}

neznam gdje je greška?