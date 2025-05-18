
// app/rezervacije/page.tsx
'use client';

import React, { useEffect, useState } from 'react';

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

  // Ostatak koda ostaje isti...

  return (

    <div className="container mx-auto p-4">
      <h1>Rezervacije</h1>
<button onClick={() => window.location.href = '/admin/dodaj'} className='bg-blue-500 text-white px-4 py-2 rounded'>
  Dodaj rezervaciju
</button>
     <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
          <tr >
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Apartman</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Korisnik</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Početak</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kraj</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gosti</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
          </tr>
        </thead>
        <tbody>
          {rezervacije.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.apartman?.naziv}</td>
              <td>{r.korisnik?.ime}</td>
              <td>{new Date(r.pocetak).toLocaleDateString()}</td>
              <td>{new Date(r.kraj).toLocaleDateString()}</td>
              <td>{r.gosti}</td>
              <td>{r.status}</td>
              <td>{r.korisnik?.email}</td>

            </tr>
          ))}
        </tbody>
      </table>

    </div>
    {/* Closing the outermost div */}
    </div>
  );
}
