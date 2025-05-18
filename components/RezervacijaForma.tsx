/* eslint-disable @typescript-eslint/no-unused-vars */
// components/RezervacijaForma.tsx
'use client';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function RezervacijaForma({ apartmanId }: { apartmanId: string }) {
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
