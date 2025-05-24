/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
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

  // Define učitajGostaId with useCallback to avoid dependency issues
  const učitajGostaId =useCallback(async () => {
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
      setError(null);
    } catch (error) {
      setError(error as Error);
    }
  }, [id]);

  useEffect(() => {
    if (id) učitajGostaId();
  }, [id, učitajGostaId]);

  return (
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <p className="text-2xl  text-center text-gray-800">Ažuriranje Gosta</p>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            učitajGostaId();
          }}
        >
          <input
            type="text"
            value={ime}
            readOnly
            placeholder="Unesite ime"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            value={prezime}
            readOnly
            placeholder="Unesite prezime"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            value={email}
            readOnly
            placeholder="Unesite email"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {/* <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
          >
            Ažuriraj gosta
          </button> */}
        </form>
        {error && (
          <p className="mt-4 text-red-600 text-center">Error: {error.message}</p>
        )}
      </div>
  );
}
