'use client';

import React, { useState, useEffect } from 'react';

type Apartman = { id: number; naziv: string };
type Korisnik = { id: number; ime: string; prezime?: string };

export default function AddRezervacijaPage() {
  const [apartmani, setApartmani] = useState<Apartman[]>([]);
  const [korisnici, setKorisnici] = useState<Korisnik[]>([]);
  const [form, setForm] = useState({
    apartmanId: '',
    korisnikId: '',
    pocetak: '',
    kraj: '',
    gosti: 1,
  });
  const [poruka, setPoruka] = useState('');

  // Učitaj apartmane i korisnike
  useEffect(() => {
    fetch('/api/apartmani')
      .then(res => res.json())
      .then(setApartmani);
    fetch('/api/korisnici')
      .then(res => res.json())
      .then(setKorisnici);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPoruka('');
    // Konvertuj ID-jeve u brojeve i datume u ISO stringove
    const data = {
      ...form,
      apartmanId: Number(form.apartmanId),
      korisnikId: Number(form.korisnikId),
      pocetak: new Date(form.pocetak).toISOString(),
      kraj: new Date(form.kraj).toISOString(),
    };
    const res = await fetch('/api/rezervacije', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setPoruka('Rezervacija uspješno dodata!');
      setForm({
        apartmanId: '',
        korisnikId: '',
        pocetak: '',
        kraj: '',
        gosti: 1,
      });
    } else {
      setPoruka('Greška pri dodavanju rezervacije.');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 24 }}>
      <h1>Dodaj rezervaciju</h1>
      <form   onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <label>
          Apartman:
          <select
            required
            value={form.apartmanId}
            onChange={e => setForm(f => ({ ...f, apartmanId: e.target.value }))}
          >
            <option value="">Izaberi apartman</option>
            {apartmani.map(a => (
              <option key={a.id} value={a.id}>
                {a.naziv}
              </option>
            ))}
          </select>
        </label>
        <label>
          Korisnik:
          <select
            required
            value={form.korisnikId}
            onChange={e => setForm(f => ({ ...f, korisnikId: e.target.value }))}
          >
            <option value="">Izaberi korisnika</option>
                    {korisnici.map(k => (
                      <option key={k.id} value={k.id}>
                        {k.ime} {k.prezime}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Početak:
                  <input
                    type="date"
                    required
                    value={form.pocetak}
                    onChange={e => setForm(f => ({ ...f, pocetak: e.target.value }))}
                  />
                </label>
                <label>
                  Kraj:
                  <input
                    type="date"
                    required
                    value={form.kraj}
                    onChange={e => setForm(f => ({ ...f, kraj: e.target.value }))}
                  />
                </label>
                <label>
                  Broj gostiju:
                  <input
                    type="number"
                    min={1}
                    required
                    value={form.gosti}
                    onChange={e => setForm(f => ({ ...f, gosti: Number(e.target.value) }))}
                  />
                </label>
                <button type="submit">Dodaj rezervaciju</button>
                {poruka && <div>{poruka}</div>}
              </form>
            </div>
  );
}
Htio bi da se pri dodavanju počertka i kraja rezervacije vidim koji su datumi dostupni odnosno rezervisani nedostupni.