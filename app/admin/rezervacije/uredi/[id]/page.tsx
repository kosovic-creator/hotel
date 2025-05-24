'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
// import Toast from '@/components/ui/Toast';

interface Rezervacija {
  sobaId: number;
  gostId: number;
  pocetak: string;
  kraj: string;
  osoba: number;
}

export default function AzurirajRezervaciju() {
const params = useParams();
  const id = params?.id as string;
  const [sobaId, setSobaId] = useState<string>('');
  const [prezime, setPrezime] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const router = useRouter();
  const [gostId, setGostId] = useState<number>(0);
  const [error, setError] = useState<Error | null>(null);
  const [rezervacija, setRezervacija] = useState<Rezervacija | null>(null);

  useEffect(() => {
    async function učitajGostaId() {
      try {
        const response = await fetch(`/api/hotel/gosti/${id}`);
        if (!response.ok) {
          throw new Error('Greška ko servera');
        }
        const data = await response.json();
        setRezervacija(data);
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
            className="bg-black text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
          >
            Ažuriraj gosta
          </button>
          <button
          className="bg-gray-400 hover:bg-grey-500 text-white px-4 py-1 rounded-lg font-medium transition"
          onClick={() => {
            router.push(`/admin/gosti`);
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


//   const [toast, setToast] = useState<string | null>(null);
//   const router = useRouter();
//   const params = useParams<{ id: string }>();
//   const [form, setForm] = useState<Rezervacija>({
//     apartmanId: 0,
//     korisnikId: 0,
//     pocetak: '',
//     kraj: '',
//     gosti: 1,
//   });
//   const [greske, setGreske] = useState<Record<string, string[]>>({});
//   const [loading, setLoading] = useState(false);

//   // Učitaj postojeće podatke rezervacije
//   useEffect(() => {
//     async function fetchRezervacija() {
//       const res = await fetch(`/api/rezervacije/${params.id}`);
//       if (res.ok) {
//         const data = await res.json();
//         setForm({
//           apartmanId: data.apartmanId ?? 0,
//           korisnikId: data.korisnikId ?? 0,
//           pocetak: data.pocetak ? data.pocetak.slice(0, 16) : '',
//           kraj: data.kraj ? data.kraj.slice(0, 16) : '',
//           gosti: data.gosti ?? 1,
//         });
//       }
//     }
//     fetchRezervacija();
//   }, [params.id]);

//   // Handler za promjenu inputa
//   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const { name, value } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: name === 'gosti' || name === 'apartmanId' || name === 'korisnikId'
//         ? Number(value)
//         : value,
//     }));
//   }
//   // Slanje forme
//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setLoading(true);
//     setGreske({});
//     const res = await fetch(`/api/rezervacije/${params.id}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(form),
//     });

//     if (res.ok) {
//         setToast('Rezervacija je uspešno izmjenjena!');
//       router.push('/admin/rezervacije');
//     } else {
//       const data = await res.json();
//       setGreske(data.greske?.fieldErrors || {});
//     }
//     setLoading(false);
//   }

//   return (
//     <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-xl shadow-md">
//       <h2 className="text-2xl  mb-6 text-center text-black">Ažuriraj Rezervaciju</h2>
//       <form onSubmit={handleSubmit} className="space-y-5">
//         <div>
//           <label className="block font-medium">Apartman ID</label>
//           <input
//             type="number"
//             name="apartmanId"
//             value={form.apartmanId}
//             onChange={handleChange}
//             className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             required
//           />
//           {greske.apartmanId && <p className="text-red-500 text-sm">{greske.apartmanId.join(', ')}</p>}
//         </div>
//         <div>
//           <label className="block font-medium">Korisnik ID</label>
//           <input
//             type="number"
//             name="korisnikId"
//             value={form.korisnikId}
//             onChange={handleChange}
//             className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             required
//           />
//           {greske.korisnikId && <p className="text-red-500 text-sm">{greske.korisnikId.join(', ')}</p>}
//         </div>
//         <div>
//           <label className="block font-medium">Početak</label>
//           <input
//             type="datetime-local"
//             name="pocetak"
//             value={form.pocetak}
//             onChange={handleChange}
//             className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             required
//           />
//           {greske.pocetak && <p className="text-red-500 text-sm">{greske.pocetak.join(', ')}</p>}
//         </div>
//         <div>
//           <label className="block font-medium">Kraj</label>
//           <input
//             type="datetime-local"
//             name="kraj"
//             value={form.kraj}
//             onChange={handleChange}
//             className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             required
//           />
//           {greske.kraj && <p className="text-red-500 text-sm">{greske.kraj.join(', ')}</p>}
//         </div>
//         <div>
//           <label className="block font-medium">Broj gostiju</label>
//           <input
//             type="number"
//             name="gosti"
//             min={1}
//             value={form.gosti}
//             onChange={handleChange}
//             className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//             required
//           />
//           {greske.gosti && <p className="text-red-500 text-sm">{greske.gosti.join(', ')}</p>}
//         </div>
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-black text-white font-semibold py-2 rounded hover:bg-blue-900 transition"
//         >
//           {loading ? 'Ažuriranje...' : 'Ažuriraj'}
//         </button>
//       </form>
//       <Toast message={toast} />
//     </div>
//   );
// }
