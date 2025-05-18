'use client';
import { useState } from 'react';

export default function KorisnikForma() {
  const [form, setForm] = useState({
    email: '',
    lozinka: '',
    ime: '',
    prezime: ''
  });
  const [poruka, setPoruka] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPoruka('');
    const res = await fetch('/api/korisnici', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) setPoruka('Korisnik uspešno dodat!');
    else setPoruka('Greška pri unosu korisnika.');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md p-4 border rounded space-y-3">
      <h2 className="text-lg font-bold">Unos korisnika</h2>
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <input
        name="lozinka"
        type="password"
        placeholder="Lozinka"
        value={form.lozinka}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <input
        name="ime"
        type="text"
        placeholder="Ime"
        value={form.ime}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        name="prezime"
        type="text"
        placeholder="Prezime"
        value={form.prezime}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Sačuvaj korisnika
      </button>
      {poruka && <div className="mt-2 text-green-600">{poruka}</div>}
    </form>
  );
}
