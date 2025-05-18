'use client';
import { useState } from 'react';

export default function ApartmanForma() {
  const [form, setForm] = useState({
    naziv: '',
    opis: '',
    cijena: '',
    slike: ''
  });
  const [poruka, setPoruka] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPoruka('');
    const res = await fetch('/api/apartmani', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        cijena: parseFloat(form.cijena),
        slike: form.slike.split(',').map((s) => s.trim()).filter(Boolean)
      })
    });
    if (res.ok) setPoruka('Apartman uspešno dodat!');
    else setPoruka('Greška pri unosu apartmana.');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md p-4 border rounded space-y-3">
      <h2 className="text-lg font-bold">Unos apartmana</h2>
      <input
        name="naziv"
        type="text"
        placeholder="Naziv"
        value={form.naziv}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />
      <textarea
        name="opis"
        placeholder="Opis"
        value={form.opis}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        name="cijena"
        type="number"
        placeholder="Cijena"
        value={form.cijena}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
        min={0}
      />
      <input
        name="slike"
        type="text"
        placeholder="URL slike (odvojiti zarezom)"
        value={form.slike}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Sačuvaj apartman
      </button>
      {poruka && <div className="mt-2 text-green-600">{poruka}</div>}
    </form>
  );
}
