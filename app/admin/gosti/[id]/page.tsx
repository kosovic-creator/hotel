/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
// import Toast from '@/components/ui/Toast';

interface Gosti {
  id: number;
  ime: string;
  prezime: string;
  email: string;

}
export default function DetaljiGosta() {
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
  function brišiGosta(id: number) {
    fetch(`/api/hotel/gosti/${id}`, {
      method: 'DELETE',
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Server ne može da obradi zahtjev: ${response.status} ${errorText}`
          );
        }
        return response.json();
      })
      .then(() => {
        setGost(null);
        router.push('/admin/gosti');
      })
      .catch((error) => {
        setError(error); // Prikaži grešku korisniku
        console.error('Greška pri brisanju gosta:', error);
      });
  }
  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <div className="flex-col text-left p-2 ">
        <h1 className="text-2xl font-bold-1 p-2 text-left">Detalji Gosta</h1>
        <p className="p-3"><>Id:</> {gost?.id}</p>
        <p className="p-3"><>Naziv:</> {gost?.ime}</p>
        <p className="p-3"><>Opis:</> {gost?.prezime}</p>
        <p className="p-3"><>Cijena:</> {gost?.email}</p>
      </div>
      <button
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg font-medium transition"
        onClick={() => {
          brišiGosta(gost?.id as number);
        }}
      >
        Briši Gosta
      </button>
      <button
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg font-medium transition"
        onClick={() => {
          router.push(`/admin/gosti/uredi/${gost?.id}`);
        }}
      >
        Ažuriraj
      </button>

      {error && (
        <p className="mt-4 text-red-600 text-center">Error: {error.message}</p>
      )}
    </div>
  );
}
