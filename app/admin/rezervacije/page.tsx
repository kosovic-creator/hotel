// app/rezervacije/page.tsx
'use client';

import React, { useEffect, useState } from 'react';

type Rezervacija = {
  id: number;
  apartman: { naziv: string };
  korisnik: { ime: string };
  pocetak: string;
  kraj: string;
  gosti: number;
  status: string;
};

export default function RezervacijePage() {
  const [rezervacije, setRezervacije] = useState<Rezervacija[]>([]);
  const [form, setForm] = useState({
    apartmanId: '',
    korisnikId: '',
    pocetak: '',
    kraj: '',
    gosti: 1,
  });

  // Učitaj rezervacije
  useEffect(() => {
    fetch('/api/rezervacije')
      .then(res => res.json())
      .then(data => setRezervacije(data));
  }, []);

  // Dodavanje nove rezervacije
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/rezervacije', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const nova = await res.json();
      setRezervacije(prev => [...prev, nova]);
      setForm({
        apartmanId: '',
        korisnikId: '',
        pocetak: '',
        kraj: '',
        gosti: 1,
      });
    } else {
      alert('Greška pri dodavanju rezervacije');
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1>Rezervacije</h1>
      <table border={1} cellPadding={8} cellSpacing={0} style={{ width: '100%', marginBottom: 32 }}>
        <thead className='bg-gray-200 text-gray-600 '>
          <tr>
            <th>ID</th>
            <th>Apartman</th>
            <th>Korisnik</th>
            <th>Početak</th>
            <th>Kraj</th>
            <th>Gosti</th>
            <th>Status</th>
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
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Dodaj rezervaciju</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <input
          type="number"
          placeholder="ID apartmana"
          value={form.apartmanId}
          onChange={e => setForm(f => ({ ...f, apartmanId: e.target.value }))}
          required
        />
        <input
          type="number"
          placeholder="ID korisnika"
          value={form.korisnikId}
          onChange={e => setForm(f => ({ ...f, korisnikId: e.target.value }))}
          required
        />
        <input
          type="date"
          placeholder="Početak"
          value={form.pocetak}
          onChange={e => setForm(f => ({ ...f, pocetak: e.target.value }))}
          required
        />
        <input
          type="date"
          placeholder="Kraj"
          value={form.kraj}
          onChange={e => setForm(f => ({ ...f, kraj: e.target.value }))}
          required
        />
        <input
          type="number"
          placeholder="Broj gostiju"
          min={1}
          value={form.gosti}
          onChange={e => setForm(f => ({ ...f, gosti: Number(e.target.value) }))}
          required
        />
        <button type="submit">Dodaj</button>
      </form>
    </div>
  );
}
