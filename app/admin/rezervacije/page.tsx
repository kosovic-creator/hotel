/* eslint-disable @typescript-eslint/no-unused-vars */
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


  return (

    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1>Rezervacije</h1>
<button onClick={() => window.location.href = '/admin/dodaj'} className='bg-blue-500 text-white px-4 py-2 rounded'>
  Dodaj rezervaciju
</button>
      <table border={1} cellPadding={8} cellSpacing={0} style={{ width: '100%', marginBottom: 32 }}>
        <thead className='bg-gray-200 text-gray-600 '>
          <tr className='text-left text-sm font-semibold border-b border-gray-400'>
            <th>ID</th>
            <th>Apartman</th>
            <th>Korisnik</th>
            <th>Početak</th>
            <th>Kraj</th>
            <th>Gosti</th>
            <th>Status</th>
             <th>Email</th>
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
  );
}
