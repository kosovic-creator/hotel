/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Rezervacija {
  id: number;
  pocetak: string;
  kraj: string;
  brojGostiju: number;
  napomena?: string;
}

interface Props {
  rezervacija: Rezervacija;
  onUpdated?: (rez: Rezervacija) => void;
}

export default function UpdateRezervacijaForm({ rezervacija, onUpdated }: Props) {
  if (!rezervacija) {
    return <div>Učitavanje...</div>;
  }
  const params = useParams();
  const id = params?.id;
  const [form, setForm] = useState({
    pocetak: rezervacija.pocetak.slice(0, 10),
    kraj: rezervacija.kraj.slice(0, 10),
    brojGostiju: rezervacija.brojGostiju,
    napomena: rezervacija.napomena || '',
  });
  const [loading, setLoading] = useState(false);
  const [greska, setGreska] = useState<string | null>(null);
  const [uspeh, setUspeh] = useState(false);
  const [inputId, setInputId] = useState(Number(id));
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    setInputId(Number(id));
  }, [id]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGreska(null);
    setUspeh(false);

    try {
      const res = await fetch(`/api/rezervacije/${rezervacija.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          brojGostiju: Number(form.brojGostiju),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.greska || 'Greška pri ažuriranju');
      }
      const data = await res.json();
      setUspeh(true);
      if (onUpdated) onUpdated(data);

    } catch (err: any) {
      setGreska(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow space-y-4"
    >
      <h2 className="text-xl font-bold mb-4">Ažuriraj rezervaciju</h2>
      <div>
        <label className="block mb-1 font-medium">Početak</label>
        <input
          type="date"
          name="pocetak"
          value={form.pocetak}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Kraj</label>
        <input
          type="date"
          name="kraj"
          value={form.kraj}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Broj gostiju</label>
        <input
          type="number"
          name="brojGostiju"
          value={form.brojGostiju}
          min={1}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Napomena</label>
        <textarea
          name="napomena"
          value={form.napomena}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          rows={2}
        />
      </div>
      {greska && <div className="text-red-600">{greska}</div>}
      {uspeh && <div className="text-green-600">Uspešno ažurirano!</div>}
      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded hover:bg-blue-900 transition"
        disabled={loading}
      >
        {loading ? 'Ažuriranje...' : 'Ažuriraj'}
      </button>
    </form>
  );
}