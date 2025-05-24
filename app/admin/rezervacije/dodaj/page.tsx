/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import type Sobe from '@/types/sobe';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react'
import Rezervacija from '@/types/rezervacije';

type Sobe = {
    id: number;
    ime: string;
    opis: string;
    cijena: number;
    slike: string[];
};
interface Gosti {
  gostId: number;
  ime: string;
  prezime: string;
  email: string;

}
export default function DodajRezrvaciju() {

  const [sobaId, setSobaId] = useState<number>();
  const [gostId, setGostId] = useState<number>();
  const [pocetak, setPocetak] = useState<string>('');
  const [kraj, setKraj] = useState<string>('');
  const [osoba, setOsoba] = useState<number>();
  const [soba, setSoba] = useState<Sobe[]>([]);
  const [gost, setGost] = useState<Gosti[]>([]);
  const router = useRouter();

  async function noviGost() {
   useEffect(() => {
    fetch('/api/hotel/sobe')
      .then(res => res.json())
      .then(setSoba);
    fetch('/api/hotel/gosti')
      .then(res => res.json())
      .then(setGost);
  }, []);

    try {
      const body = {
        sobaId,
        gostId,
        pocetak,
        kraj,
        osoba,
      };

      const response = await fetch(`/api/hotel/rezervacije`, {
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

      setSobaId(undefined);
      setGostId(undefined);
      setPocetak('');
      setKraj('');
      setOsoba(undefined);

      router.push('/admin/gosti');
    } catch (error) {
      console.error('Greška u dodavanju novog gosta:', error);
    }
    //   // Učitaj apartmane i korisnike

  } return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
        <p className="text-3xl font-bold text-center text-black-700 mb-2">Nova Rezervacija</p>
        <div className="space-y-4">
               <select
          required
          value={sobaId}
          onChange={e => setSobaId(e.target.value ? Number(e.target.value) : undefined)}
          className="mt-1 p-2 border  rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Izaberi sobu</option>
          {soba.map(a => (
            <option key={a.id} value={a.id}>
              {a.id}
            </option>
          ))}
        </select>
        <select
          value={gostId}
          onChange={e => setGostId(e.target.value ? Number(e.target.value) : undefined)}
          className="mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Izaberi gosta</option>
          {gost.map(k => (
            <option key={k.gostId} value={k.gostId}>
              {k.ime} {k.prezime}
            </option>
          ))}
        </select>
          {/* <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          /> */}
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






// import React, { useState, useEffect } from 'react';
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { addDays, isWithinInterval, parseISO } from 'date-fns';
// import { useRouter } from 'next/navigation';
// import Toast from '@/components/ui/Toast';
// type Apartman = { id: number; naziv: string };
// type Korisnik = { id: number; ime: string; prezime?: string };

// export default function AddRezervacijaPage() {
//   const [soba, setSoba] = useState<Apartman[]>([]);
//   const [korisnici, setKorisnici] = useState<Korisnik[]>([]);
//   const [toast, setToast] = useState<string | null>(null);
//   const [form, setForm] = useState({
//     apartmanId: '',
//     korisnikId: '',
//     pocetak: '',
//     kraj: '',
//     gosti: '', // <-- promjena ovdje
//   });
//   const [poruka, setPoruka] = useState('');
//   const [rezervacije, setRezervacije] = useState<{ pocetak: string, kraj: string }[]>([]);
//   const router = useRouter();
//   useEffect(() => {
//     if (form.apartmanId) {
//       fetch(`/api/rezervacije?apartmanId=${form.apartmanId}`)
//         .then(res => res.json())
//         .then(setRezervacije);
//     } else {
//       setRezervacije([]);
//     }
//   }, [form.apartmanId]);
//   // Učitaj apartmane i korisnike
//   useEffect(() => {
//     fetch('/api/hotel/sobe')
//       .then(res => res.json())
//       .then(setApartmani);
//     fetch('/api/hotel/registracije')
//       .then(res => res.json())
//       .then(setKorisnici);
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setPoruka('');
//     // Konvertuj ID-jeve u brojeve i datume u ISO stringove
//     const data = {
//       ...form,
//       apartmanId: Number(form.apartmanId),
//       korisnikId: Number(form.korisnikId),
//       pocetak: new Date(form.pocetak).toISOString(),
//       kraj: new Date(form.kraj).toISOString(),
//       gosti: Number(form.gosti), // <-- dodajte ovo
//     };
//     const res = await fetch('/api/rezervacije', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data),
//     });
//     if (res.ok) {
//       setToast('Rezervacija uspješno dodata!');
//       setForm({
//         apartmanId: '',
//         korisnikId: '',
//         pocetak: '',
//         kraj: '',
//         gosti: '',
//       });
//       router.push('/admin/rezervacije');
//     } else {
//       setPoruka('Greška pri dodavanju rezervacije.');
//     }
//   };
//   return (
//     <div style={{ maxWidth: 500, margin: '0 auto', padding: 24 }}>
//       <form
//         onSubmit={handleSubmit}
//         className="flex flex-col gap-6 bg-white p-8 rounded-lg  border-gray-200"
//       >
//         <h1 className="text-2xl  mb-4 text-center">Dodaj rezervaciju</h1>
//         <select
//           required
//           value={form.apartmanId}
//           onChange={e => setForm(f => ({ ...f, apartmanId: e.target.value }))}
//           className="mt-1 p-2 border  rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
//         >
//           <option value="">Izaberi apartman</option>
//           {apartmani.map(a => (
//             <option key={a.id} value={a.id}>
//               {a.naziv}
//             </option>
//           ))}
//         </select>
//         <select
//           value={form.korisnikId}
//           onChange={e => setForm(f => ({ ...f, korisnikId: e.target.value }))}
//           className="mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
//         >
//           <option value="">Izaberi korisnika</option>
//           {korisnici.map(k => (
//             <option key={k.id} value={k.id}>
//               {k.ime} {k.prezime}
//             </option>
//           ))}
//         </select>
//         {rezervacije.length > 0 && (
//           <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded border">
//             <b className="text-gray-700">Zauzeti periodi:</b>
//             <ul className="list-disc ml-5">
//               {rezervacije.map((r, i) => (
//                 <li key={i}>
//                   {r.pocetak.slice(0, 10)} - {r.kraj.slice(0, 10)}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//         <div className="flex flex-col gap-1 font-medium text-gray-700">
//           <DatePicker
//             selected={form.pocetak ? new Date(form.pocetak) : null}
//             onChange={date => setForm(f => ({ ...f, pocetak: date ? date.toISOString().slice(0, 10) : '' }))}
//             dateFormat="yyyy-MM-dd"
//             minDate={new Date()}
//             excludeDates={
//               rezervacije.flatMap(r => {
//                 const dates = [];
//                 let current = new Date(r.pocetak);
//                 const end = new Date(r.kraj);
//                 while (current <= end) {
//                   dates.push(new Date(current));
//                   current = addDays(current, 1);
//                 }
//                 return dates;
//               })
//             }
//             className="mt-1 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
//             placeholderText="Izaberi datum početka"
//           />
//         </div>
//         <div className="flex flex-col gap-1 font-medium text-gray-700">
//           <DatePicker
//             selected={form.kraj ? new Date(form.kraj) : null}
//             onChange={date => setForm(f => ({ ...f, kraj: date ? date.toISOString().slice(0, 10) : '' }))}
//             dateFormat="yyyy-MM-dd"
//             minDate={new Date()}
//             excludeDates={
//               rezervacije.flatMap(r => {
//                 const dates = [];
//                 let current = new Date(r.pocetak);
//                 const end = new Date(r.kraj);
//                 while (current <= end) {
//                   dates.push(new Date(current));
//                   current = addDays(current, 1);
//                 }
//                 return dates;
//               })
//             }
//             className="mt-1 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
//             placeholderText="Izaberi datum kraja"
//           />
//         </div>
//         <input
//           type="number"
//           min={1}
//           required
//           value={form.gosti}
//           onChange={e => setForm(f => ({ ...f, gosti: e.target.value }))}
//           className="mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 w-32"
//           placeholder="broj osoba"
//         />

//         <button
//           className="px-4 py-2 bg-black text-white rounded hover:bg-blue-900 transition-colors font-semibold mt-2"
//           type="submit"
//         >
//           Dodaj rezervaciju
//         </button>
//         {poruka && (
//           <div className="text-center text-sm mt-2 text-green-600 font-medium">{poruka}</div>
//         )}
//       </form>
//       <Toast message={toast} />
//     </div>
//   );
// }
