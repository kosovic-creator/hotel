/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import PotvrdiBrisanjeKorisnika from '@/components/PotvrdaBrisanjaModal/PotvrdiBrisanjeKorisnika';
import Toast from '@/components/ui/Toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';



export default function KorisnikByIdForm({ params }: { params: Promise<{ id: number }> }) {
  const { id } = React.use(params);
  type Korisnik = {
    id: number;
    email: string;
    ime: string;
    prezime: string;

    // add other properties as needed
  };
  const [korisnik, setKorisnik] = useState<Korisnik | null>(null);
  const [greska, setGreska] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputId, setInputId] = useState(Number(id));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const router = useRouter();
  // Funkcija za dohvat rezervacije
  const fetchApartmani = async (aparId: number) => {
    setGreska('');
    setKorisnik(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/korisnici/${aparId}`);
      const data = await res.json();
      if (!res.ok) {
        setGreska(data.greska || 'Greška pri dohvatu korisnika');
      } else {
        setKorisnik(data);
      }
    } catch (err) {
      setGreska('Greška u mreži');
    } finally {
      setLoading(false);
    }
  };

  // Automatski pozovi kad se promijeni id
  useEffect(() => {
    if (id) {
      setInputId(Number(id));
      fetchApartmani(Number(id));
    }
  }, [id]);
  const deleteApartman = async (id: number) => {
    await fetch(`/api/apartmani/${id}`, { method: 'DELETE' });
    setKorisnik(null);
    setIsModalOpen(false);

    setToast('Korisnik je uspešno obrisan!');
    router.push('/admin/korisnici');
  };
  // Ručno pretraživanje (ako želiš ostaviti formu)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchApartmani(inputId);
  };
  const openDeleteConfirmModal = (id: string | number) => {
    setSelectedItemId(Number(id));
    setIsModalOpen(true);
  };
  const closeDeleteConfirmModal = () => {
    setIsModalOpen(false);
    setSelectedItemId(null);
  };
  return (
    <div>
      {/* You can add a form here if needed */}
      <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-4 bg-white border-2 border-gray-100 rounded pl-4 pr-4"></form>
      {korisnik && (
        <div className="flex-col text-left p-2 ">
          <h1 className="text-2xl font-bold-1 p-2 text-left">Detalji Apartmana</h1>
          <p className="p-3"><>Id:</> {korisnik.id}</p>
          <p className="p-3"><>Ime:</> {korisnik.ime}</p>
          <p className="p-3"><>Prezime:</> {korisnik.prezime}</p>
          <p className="p-3"><>Email:</> {korisnik.email}</p>

          <div className="flex gap-3 mt-7 w-full">
            <Link href="/admin/korisnici">
              <button className="px-4 py-2 rounded bg-black text-white hover:bg-yellow-600 transition">
                Nazad
              </button>
            </Link>
            {/* <Link href={`/admin/apartmani/update/${users.id}`} >
              <button className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600 transition">Izmjeni</button>
            // // </Link> */}
            {/* <button className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition " onClick={() => openDeleteConfirmModal(users.id)}>Briši</button> */}
          </div>
        </div>
      )}

      <PotvrdiBrisanjeKorisnika
        isOpen={isModalOpen}
        onClose={closeDeleteConfirmModal}
        onConfirm={() => selectedItemId !== null && deleteApartman(selectedItemId)}
        itemId={selectedItemId!}
        ime={korisnik?.ime ?? ''} // <-- OVO JE KLJUČNO, changed to apartman?.naziv for context
      />
      <Toast message={toast} />
    </div>
  );
}