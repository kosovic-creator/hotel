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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
        <p className="text-3xl font-bold text-center text-black-700 mb-2">Novi Gost</p>
        <div className="space-y-4">
          <input
            type="text"
            value={ime}
            onChange={(e) => setIme(e.target.value)}
            placeholder="Ime"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            type="text"
            value={prezime}
            onChange={(e) => setPrezime(e.target.value)}
            placeholder="Prezime"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
        <button
          type="button"
          onClick={noviGost}
          className="w-full bg-gray-900 text-white font-semibold py-2 rounded-lg hover:bg-gray-700 transition"
        >
          Dodaj Gosta
        </button>
      </div>
    </div>
  );
}
