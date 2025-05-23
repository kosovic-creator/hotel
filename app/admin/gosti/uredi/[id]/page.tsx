/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
// import Toast from '@/components/ui/Toast';

interface Gosti {
  gostId: number;
  ime: string;
  prezime: string;
  email: string;

}
export default function AzurirajGosta() {
  const params = useParams();
  const id = params?.id as string;
  const [ime, setIme] = useState<string>('');
  const [prezime, setPrezime] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const router = useRouter();
  const [gostId, setGostId] = useState<number>(0);
  const [error, setError] = useState<Error | null>(null);
  const [gost, setGost] = useState<Gosti | null>(null);

  useEffect(() => {
    async function učitajGostaId() {
      try {
        const response = await fetch(`/api/hotel/gosti/${id}`);
        if (!response.ok) {
          throw new Error('Greška ko servera');
        }
        const data = await response.json();
        setGost(data);
        setGostId(data.id);
        setIme(data.ime);
        setPrezime(data.prezime);
        setEmail(data.email);
      } catch (error) {
        setError(error as Error);
      }
    }
    if (id) učitajGostaId();
  }, [id]);

  async function azirirajGosta() {
    try {
      const response = await fetch(`/api/hotel/gosti/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ ime, prezime, email }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Nema odgovora sa servera');
      }
      const data = await response.json();
      console.log('Updated:', data);
      setIme('');
      setPrezime('');
      setEmail('');
      router.push('/admin/gosti');
    } catch (error) {
      console.error('Greska pri azuriranju gosta', error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <p className="text-2xl  text-center text-gray-800">Ažuriranje Gosta</p>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            azirirajGosta();
          }}
        >
          <input
            type="text"
            value={ime}
            onChange={(e) => setIme(e.target.value)}
            placeholder="Unesite ime"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            value={prezime}
            onChange={(e) => setPrezime(e.target.value)}
            placeholder="Unesite prezime"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Unesite email"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
          >
            Ažuriraj gosta
          </button>
        </form>
        {error && (
          <p className="mt-4 text-red-600 text-center">Error: {error.message}</p>
        )}
      </div>
    </div>
  );
}
