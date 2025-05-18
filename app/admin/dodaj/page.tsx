/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, isWithinInterval, parseISO } from 'date-fns';
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
    const [rezervacije, setRezervacije] = useState<{ pocetak: string, kraj: string }[]>([]);
    useEffect(() => {
        if (form.apartmanId) {
            fetch(`/api/rezervacije?apartmanId=${form.apartmanId}`)
                .then(res => res.json())
                .then(setRezervacije);
        } else {
            setRezervacije([]);
        }
    }, [form.apartmanId]);
  // Učitaj apartmane i korisnike
  useEffect(() => {
    fetch('/api/apartmani')
      .then(res => res.json())
      .then(setApartmani);
    fetch('/api/korisnici')
      .then(res => res.json())
      .then(setKorisnici);
  }, []);
    const isDateReserved = (date: Date) => {
        return rezervacije.some(r =>
            isWithinInterval(date, {
                start: parseISO(r.pocetak),
                end: parseISO(r.kraj)
            })
        );
    };
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
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
              {rezervacije.length > 0 && (
                  <div style={{ fontSize: 12, color: '#888' }}>
                      <b>Zauzeti periodi:</b>
                      <ul>
                          {rezervacije.map((r, i) => (
                              <li key={i}>
                                  {r.pocetak.slice(0, 10)} - {r.kraj.slice(0, 10)}
                              </li>
                          ))}
                      </ul>
                  </div>
              )}
              <DatePicker
                  selected={form.pocetak ? new Date(form.pocetak) : null}
                  onChange={date => setForm(f => ({ ...f, pocetak: date ? date.toISOString().slice(0, 10) : '' }))}
                  dateFormat="yyyy-MM-dd"
                  minDate={new Date()}
                  excludeDates={
                      rezervacije.flatMap(r => {
                          const dates = [];
                          let current = new Date(r.pocetak);
                          const end = new Date(r.kraj);
                          while (current <= end) {
                              dates.push(new Date(current));
                              current = addDays(current, 1);
                          }
                          return dates;
                      })
                  }
              />
              <DatePicker
                  selected={form.kraj ? new Date(form.kraj) : null}
                  onChange={date => setForm(f => ({ ...f, kraj: date ? date.toISOString().slice(0, 10) : '' }))}
                  dateFormat="yyyy-MM-dd"
                  minDate={new Date()}
                  excludeDates={
                      rezervacije.flatMap(r => {
                          const dates = [];
                          let current = new Date(r.pocetak);
                          const end = new Date(r.kraj);
                          while (current <= end) {
                              dates.push(new Date(current));
                              current = addDays(current, 1);
                          }
                          return dates;
                      })
                  }
              />
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
