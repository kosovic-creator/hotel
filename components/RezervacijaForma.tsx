'use client';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type Interval = { start: Date; end: Date };

export default function RezervacijaForma({ apartmanId }: { apartmanId: number }) {
  const [pocetak, setPocetak] = useState<Date | null>(null);
  const [kraj, setKraj] = useState<Date | null>(null);
  const [zauzeti, setZauzeti] = useState<Interval[]>([]);

  useEffect(() => {
    fetch(`/api/rezervacije/zauzeti/${apartmanId}`)
      .then(res => res.json())
      .then((data: { start: string; end: string }[]) => {
        setZauzeti(
          data.map(i => ({
            start: new Date(i.start),
            end: new Date(i.end),
          }))
        );
      });
  }, [apartmanId]);

  const potvrdiRezervaciju = async () => {
    // ... tvoj kod za potvrdu rezervacije
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
          excludeDateIntervals={zauzeti}
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
