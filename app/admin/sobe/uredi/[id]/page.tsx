/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Toast from '@/components/ui/Toast';
import { UploadButton } from '@/lib/uploadthing';
// import error from 'next/error'; // Remove this import, not needed

type Sobe = {
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
  const [naziv, setNaziv] = useState<string>('');
  const [opis, setOpis] = useState<string>('');
  const [cijena, setCijena] = useState<number>(0);
  const [slike, setSlike] = useState<string[]>([]);
  const [error, setError] = useState<Error | null>(null);


  useEffect(() => {
    const id = params.id;
    async function učitajSobuId() {
      try {
        const response = await fetch(`/api/hotel/sobe/${id}`);
        if (!response.ok) {
          throw new Error('Greška na serveru');
        }
        const data = await response.json();
        setNaziv(data.naziv);
        setOpis(data.opis);
        setCijena(data.cijena);
        setSlike(data.slike);

      } catch (error) {
        setError(error as Error);
      }
    }
    if (id) učitajSobuId();
  }, [params.id]);

  async function azirirajSobu() {
    const id = params.id;
    try {
      const response = await fetch(`/api/hotel/sobe/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ naziv, opis, cijena, slike }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Nema odgovora sa servera');
      }
      const data = await response.json();
      console.log('Updated:', data);
       setNaziv('');
        setOpis('');
        setCijena(0);
        setSlike([]);
      router.push('/admin/sobe');
    } catch (error) {
      console.error('Greska pri azuriranju sobe', error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <p className="text-2xl  text-center text-gray-800">Ažuriranje Sobe</p>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            azirirajSobu();
          }}
        >
          <input
            type="text"
            value={naziv}
            onChange={(e) => setNaziv(e.target.value)}
            placeholder="Unesite naziv"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            value={opis}
            onChange={(e) => setOpis(e.target.value)}
            placeholder="Unesite opis"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            value={cijena}
            onChange={(e) => setCijena(Number(e.target.value))}
            placeholder="Unesite cijenu"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <UploadButton
                    endpoint="imageUploader" // zameni sa stvarnim endpointom ako je drugačiji
                    onClientUploadComplete={(res: { url: string }[]) => {
                      // Pretpostavljamo da res sadrži niz objekata sa url-om slike
                      setSlike(res.map((file) => file.url));
                    }}
                    onUploadError={(error: Error) => {
                      alert(`Greška pri uploadu: ${error.message}`);
                    }}
                  />

                  {slike.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
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
          <button
            type="submit"
            className="bg-black text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
          >
            Ažuriraj sobu
          </button>
          <button
            className="bg-gray-400 hover:bg-grey-500 text-white px-4 py-1 rounded-lg font-medium transition"
            onClick={() => {
              router.push(`/admin/sobe`);
            }}
          >
            Odloži
          </button>
        </form>
        {error && (
          <p className="mt-4 text-red-600 text-center">Error: {error.message}</p>
        )}
      </div>
    </div>
  );
}
