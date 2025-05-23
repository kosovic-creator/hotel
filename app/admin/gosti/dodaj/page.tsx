'use client'
import { useRouter } from 'next/navigation';
import { useState } from 'react'

export default function DodajGosta() {

  const [ime, setIme] = useState<string>('');
  const [prezime, setPrezime] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const router = useRouter();

  async function noviGost() {
    try {
      const body = {
        ime,
        prezime,
        email,
      };
      const response = await fetch(`/api/hotel/gosti`, {
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
      setIme('');
      setPrezime('');
      setEmail('');
      router.push('/admin/gosti');
    } catch (error) {
      console.error('Greška u dodavanju novog gosta:', error);
    }
  } return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <p className="text-2xl  text-center text-gray-800">Novi Gost</p>
          <input
            type="text"
            value={ime}
            onChange={(e) => setIme(e.target.value)}
            placeholder="Ime"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            value={prezime}
            onChange={(e) => setPrezime(e.target.value)}
            placeholder="Prezime"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="button"
            onClick={noviGost}
            className="bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
          >
            Dodaj Gosta
          </button>
      </div>
    </div>
  );
}
