/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function SobeId() {
  type Sobe = {
    id: number;
    naziv: string;
    opis: string;
    cijena: number;
    slike: string[];
  };

  const params = useParams();
  const id = params?.id as string;
  const [error, setError] = useState<Error | null>(null);
  const [soba, setSoba] = useState<Sobe | null>(null);
  const [sobaId, setSobaId] = useState<number| null>(null);
  const [naziv, setNaziv] = useState<string>('');
  const [opis, setOpis] = useState<string>('');
  const [cijena, setCijena] = useState<number>(0);
  const [slike, setSlike] = useState<string[]>([]);
  const router = useRouter();


  useEffect(() => {
    async function učitajSobuId() {
      try {
        const response = await fetch(`/api/hotel/sobe/${id}`);
        if (!response.ok) {
          throw new Error('Greška kod servera');
        }
        const data = await response.json();
        setSoba(data);
        setSobaId(data.id);
        setNaziv(data.naziv);
        setOpis(data.opis);
        setCijena(data.cijena);
        setSlike(data.slike);

      } catch (error) {
        setError(error as Error);
      }
    }
    if (id) učitajSobuId();
  }, [id]);
  function brišiSobu(id: number) {
    fetch(`/api/hotel/sobe/${id}`, {
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
        setSoba(null);
        router.push('/admin/sobe');
      })
      .catch((error) => {
        setError(error); // Prikaži grešku korisniku
        console.error('Greška pri brisanju gosta:', error);
      });
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div >
        <h1 className="text-2xl font-bold-1 p-2 text-left">Detalji Sobe</h1>
        <p className="p-3"><>Id:</> {soba?.id}</p>
        <p className="p-3"><>Naziv:</> {soba?.naziv}</p>
        <p className="p-3"><>Opis:</> {soba?.opis}</p>
        <p className="p-3"><>Cijena:</> {soba?.cijena}</p>
         <p className="p-3"><>Cijena:</> {soba?.slike}</p>
        <button
          className="bg-gray-400 hover:bg-grey-500 text-white px-4 py-1 rounded-lg font-medium transition"
          onClick={() => {
            router.push(`/admin/sobe`);
          }}
        >
          Nazad
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg font-medium transition"
          onClick={() => {
            brišiSobu(soba?.id as number);
          }}
        >
          Briši Sobu
        </button>
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg font-medium transition"
          onClick={() => {
            router.push(`/admin/sobe/uredi/${soba?.id}`);
          }}
        >
          Ažuriraj
        </button>
        {error && (
          <p className="mt-4 text-red-600 text-center">Error: {error.message}</p>
        )}
      </div>

    </div>
  );
}