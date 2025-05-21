'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Toast from '@/components/ui/Toast';

interface Korisnici {
  korisnikId: number;
  ime: string;
  prezime: string;
  email: string;

}

export default function UpdateRezervacija() {
   const [toast, setToast] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [form, setForm] = useState<Korisnici>({
    korisnikId: 0,
    ime: '',
    prezime: '',
    email: '',

  });
  const [greske, setGreske] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  // Učitaj postojeće podatke rezervacije
  useEffect(() => {
    async function fetchRezervacija() {
      const res = await fetch(`/api/korisnici/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setForm({
          korisnikId: data.korisnikId,
          ime: data.ime,
          prezime: data.prezime,
          email: data.email,
        });
      }
    }
    fetchRezervacija();
  }, [params.id]);

  // Handler za promjenu inputa
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'korisnikId'
        ? Number(value)
        : value,
    }));
  }

  // Slanje forme
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setGreske({});
    const res = await fetch(`/api/korisnici/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
        setToast('Korisnik je uspešno izmjenjen!');
      router.push('/admin/korisnici');
    } else {
      const data = await res.json();
      setGreske(data.greske?.fieldErrors || {});
    }
    setLoading(false);
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl  mb-6 text-center text-black">Ažuriraj Korisnika</h2>
      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="block font-medium">Ime</label>
          <input
            type="text"
            name="ime"
            value={form.ime}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          {greske.ime && <p className="text-red-500 text-sm">{greske.ime.join(', ')}</p>}
        </div>
        <div>
          <label className="block font-medium">Prezime</label>
          <input
            type="text"
            name="prezime"
            value={form.prezime}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          {greske.prezime && <p className="text-red-500 text-sm">{greske.prezime.join(', ')}</p>}
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          {greske.email && <p className="text-red-500 text-sm">{greske.email.join(', ')}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white font-semibold py-2 rounded hover:bg-blue-900 transition"
        >
          {loading ? 'Ažuriranje...' : 'Ažuriraj'}
        </button>
      </form>
      <Toast message={toast} />
    </div>
  );
}
