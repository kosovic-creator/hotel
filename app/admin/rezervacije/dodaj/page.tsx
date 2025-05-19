/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, isWithinInterval, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';
import Toast from '@/components/ui/Toast';
type Apartman = { id: number; naziv: string };
type Korisnik = { id: number; ime: string; prezime?: string };

export default function AddRezervacijaPage() {
  const [apartmani, setApartmani] = useState<Apartman[]>([]);
  const [korisnici, setKorisnici] = useState<Korisnik[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [form, setForm] = useState({
    apartmanId: '',
    korisnikId: '',
    pocetak: '',
    kraj: '',
    gosti: 1,
  });
  const [poruka, setPoruka] = useState('');
  const [rezervacije, setRezervacije] = useState<{ pocetak: string, kraj: string }[]>([]);
  const router = useRouter();
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
      setToast('Rezervacija uspješno dodata!');
      setForm({
        apartmanId: '',
        korisnikId: '',
        pocetak: '',
        kraj: '',
        gosti: 1,
      });
      router.push('/admin/rezervacije');
    } else {
      setPoruka('Greška pri dodavanju rezervacije.');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 24 }}>
      <h1>Dodaj rezervaciju</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 bg-white p-8 rounded-lg  border-gray-200"
      >
        <label className="flex flex-col gap-1 font-medium text-gray-700">
          Apartman:
          <select
            required
            value={form.apartmanId}
            onChange={e => setForm(f => ({ ...f, apartmanId: e.target.value }))}
            className="mt-1 p-2 border  rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Izaberi apartman</option>
            {apartmani.map(a => (
              <option key={a.id} value={a.id}>
                {a.naziv}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 font-medium text-gray-700">
          Korisnik:
          <select
            value={form.korisnikId}
            onChange={e => setForm(f => ({ ...f, korisnikId: e.target.value }))}
            className="mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded border">
            <b className="text-gray-700">Zauzeti periodi:</b>
            <ul className="list-disc ml-5">
              {rezervacije.map((r, i) => (
                <li key={i}>
                  {r.pocetak.slice(0, 10)} - {r.kraj.slice(0, 10)}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex flex-col gap-1 font-medium text-gray-700">
          Početak:
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
            className="mt-1 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholderText="Izaberi datum početka"
          />
        </div>
        <div className="flex flex-col gap-1 font-medium text-gray-700">
          Kraj:
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
            className="mt-1 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholderText="Izaberi datum kraja"
          />
        </div>
        <label className="flex flex-col gap-1 font-medium text-gray-700">
          Broj gostiju:
          <input
            type="number"
            min={1}
            required
            value={form.gosti}
            onChange={e => setForm(f => ({ ...f, gosti: Number(e.target.value) }))}
            className="mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-32"
          />
        </label>
        <button
          className="px-4 py-2 bg-black text-white rounded hover:bg-blue-900 transition-colors font-semibold mt-2"
          type="submit"
        >
          Dodaj rezervaciju
        </button>
        {poruka && (
          <div className="text-center text-sm mt-2 text-green-600 font-medium">{poruka}</div>
        )}
      </form>
      <Toast message={toast} />
    </div>
  );
}
