
// app/rezervacije/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
type Rezervacija = {
  id: number;
  apartman: { naziv: string };
  korisnik: { ime: string; email: string };
  pocetak: string;
  kraj: string;
  gosti: number;
  status: string;
};

export default function RezervacijePage() {
  const [rezervacije, setRezervacije] = useState<Rezervacija[]>([]);

  // Dodajte ovaj useEffect
  useEffect(() => {
    fetch('/api/rezervacije')
      .then(res => res.json())
      .then(data => setRezervacije(data))
      .catch(err => console.error('Greška pri učitavanju:', err));
  }, []); // Prazan niz znači da se poziva samo pri prvom renderu


  return (

    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Rezervacije</h1>

      <div style={{ margin: '20px 0', display: 'flex', gap: 16 }}>
        <button type='button' onClick={() => window.location.href = '/admin/rezervacije/dodaj'} className="px-4 py-2 bg-black text-white rounded hover:bg-blue-900">
          Dodaj rezervaciju
        </button>
      </div>
     <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-200">
            <tr >
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Apartman</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Korisnik</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Početak</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kraj</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gosti</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"></th>
            </tr>
          </thead>
          <tbody>
            {rezervacije.map(r => (
              <tr key={r.id}>
                <td className="px-6 py-4 whitespace-nowrap">{r.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{r.apartman?.naziv}</td>
                <td className="px-6 py-4 whitespace-nowrap">{r.korisnik?.ime}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(r.pocetak).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(r.kraj).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{r.gosti}</td>
                <td className="px-6 py-4 whitespace-nowrap">{r.status}</td>
                <td className="px-6 py-4 whitespace-nowrap">{r.korisnik?.email}</td>
                <td>

                  <div className="flex gap-2 flex-row-reverse w-full">
                    <Link href={`/admin/rezervacije/${r.id}`} >
                      <button className="px-4 py-2 rounded bg-black text-white hover:bg-yellow-600 transition">Pregled</button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
