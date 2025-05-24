/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';

// import Toast from '@/components/ui/Toast';

interface Sobe {
  id: number;
  ime: string;
  opis: string;
  cijena: number;
  slike: string[];
}
export default function DetaljiSobe() {
  const params = useParams();
  const router = useRouter();

  const [naziv, setNaziv] = useState<string>('');
  const [opis, setOpis] = useState<string>('');
  const [cijena, setCijena] = useState<number>(0);
  const [slike, setSlike] = useState<string[]>([]);

  async function novaSoba() {
    try {
      const body = {
       naziv,
        opis,
        cijena,
        slike,
      };
      const response = await fetch(`/api/hotel/sobe`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Greška kod servera');
      }
      const data = await response.json();
      console.log('Dodato:', data);
      setNaziv('');
      setOpis('');
      setCijena(0);
      setSlike([]);
      router.push('/admin/sobe');
    } catch (error) {
      console.error('Greška u dodavanju novog gosta:', error);
    }
  } return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <p className="text-2xl  text-center text-gray-800">Nova Soba</p>
          <input
            type="text"
            value={naziv}
            onChange={(e) => setNaziv(e.target.value)}
            placeholder="Ime"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            value={opis}
            onChange={(e) => setOpis(e.target.value)}
            placeholder="Opis"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            value={cijena}
            onChange={(e) => setCijena(Number(e.target.value))}
            placeholder="Email"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
 <input
            type="text"
            value={slike}
            onChange={(e) => setOpis(e.target.value)}
            placeholder="Slike (odvojene zarezom)"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="button"
            onClick={novaSoba}
            className="bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
          >
            Dodaj Sobu
          </button>
      </div>
    </div>
  );
}
