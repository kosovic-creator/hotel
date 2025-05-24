/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { UploadButton } from '@/lib/uploadthing';
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
        <p className="text-3xl font-bold text-center text-black mb-2">Nova Soba</p>
        <div className="space-y-4">
          <input
            type="text"
            value={naziv}
            onChange={(e) => setNaziv(e.target.value)}
            placeholder="Ime"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            type="text"
            value={opis}
            onChange={(e) => setOpis(e.target.value)}
            placeholder="Opis"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            type="number"
            value={cijena}
            onChange={(e) => setCijena(Number(e.target.value))}
            placeholder="Cijena"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res: { url: string }[]) => {
              setSlike(res.map((file) => file.url));
            }}
            onUploadError={(error: Error) => {
              alert(`Greška pri uploadu: ${error.message}`);
            }}
          />
          {slike.length > 0 && (
            <div className="flex gap-2 my-4">
              {slike.map((url, idx) => (
                <Image
                  key={idx}
                  src={url}
                  alt={`Slika ${idx + 1}`}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded"
                />
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={novaSoba}
          className="w-full bg-gray-900 text-white font-semibold py-2 rounded-lg hover:bg-gray-700 transition"
        >
          Dodaj Sobu
        </button>
      </div>
    </div>
  );
}
