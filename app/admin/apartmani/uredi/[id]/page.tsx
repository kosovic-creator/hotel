/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Toast from '@/components/ui/Toast';
import { UploadButton } from '@/lib/uploadthing';

type Apartman = {
    id: number;
    naziv: string;
    opis: string;
    cijena: number;
    slike: string;
    // add other properties as needed
  };

export default function UpdateApartman() {
   const [toast, setToast] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [form, setForm] = useState<Apartman>({
    id: 0,
    naziv: '',
    opis: '',
    cijena: 0,
    slike: '',
    // add other properties as needed
  });

  const [greske, setGreske] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  // Učitaj postojeće podatke apartmana
  useEffect(() => {
    async function fetchApartman() {
      const res = await fetch(`/api/apartmani/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setForm({
          id: data.apartmanId ?? 0,
          naziv: data.naziv ?? '',
          opis: data.opis ?? '',
          cijena: data.cijena ?? 0,
          slike: data.slika ?? '',
        });
      }
    }
    fetchApartman();
  }, [params.id]);

  //Handler za promjenu inputa
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  }

  // Slanje forme
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setGreske({});

    // Filtriraj samo dozvoljena polja
    const { naziv, opis, cijena, slike } = form;
    const body = {
      naziv,
      opis,
      cijena,
      slike: slike
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean), // ovo će napraviti string[]
    };
    const images = form.slike.split(',').map((s) => s.trim()).filter(Boolean);
    const res = await fetch(`/api/apartmani/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
        setToast('Apartman je uspješno ažuriran!');
      router.push('/apartmani');
    } else {
      const data = await res.json();
      setGreske(data.greske?.fieldErrors || {});
    }
    setLoading(false);
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl  mb-6 text-center text-black">Ažuriraj Apartman</h2>
      <form onSubmit={handleSubmit} className="space-y-5">


        <div>
          <label className="block font-medium">Naziv</label>
          <input
            type="text"
            name="naziv"
            value={form.naziv}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          {greske.naziv && <p className="text-red-500 text-sm">{greske.naziv.join(', ')}</p>}
        </div>
        <div>
          <label className="block font-medium">Opis</label>
          <input
            type="text"
            name="opis"
            value={form.opis}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          {greske.opis && <p className="text-red-500 text-sm">{greske.opis.join(', ')}</p>}
        </div>
        <div>
          <input
            type="text"
            name="slike"
            value={form.slike}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="URL slike (odvojiti zarezom)"
          />
          {greske.slike && <p className="text-red-500 text-sm">{greske.slike.join(', ')}</p>}
          <div className='flex gap-2'>
            <UploadButton
              endpoint='imageUploader'
              onClientUploadComplete={(res: { url: string }[]) => {
                setForm((prev) => ({
                  ...prev,
                  slike: [
                    ...prev.slike
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
                    res[0].url,
                  ].join(','),
                }));
              }}
              onUploadError={(error: Error) => {
                setToast(`ERROR! ${error.message}`);
              }}
            />
          </div>
        </div>
        <div>
          <label className="block font-medium">Cijena</label>
          <input
            type="number"
            name="cijena"
            min={1}
            value={form.cijena}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"

          />
          {greske.cijena && <p className="text-red-500 text-sm">{greske.cijena.join(', ')}</p>}
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
