/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';


import PotvrdiBrisanjeRezrevacije from '@/components/PotvrdaBrisanjaModal/PotvrdiBrisanjeRezrevacije';
import Toast from '@/components/ui/Toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

type Rezervacija = {
  id: number;
  pocetak: string;
  kraj: string;
  createdAt: string;
  apartman: { id: number; naziv: string } | null;
  korisnik: { id: number; ime: string; email: string } | null;
};

export default function RezervacijaByIdForm({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [apartman, setApartman] = useState('');
  const [rezervacija, setRezervacija] = useState<Rezervacija | null>(null);
  const [greska, setGreska] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputId, setInputId] = useState(Number(id));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [toast, setToast] = useState<string | null>(null);
  // Funkcija za dohvat rezervacije
  const fetchRezervacija = async (rezId: number) => {
    setGreska('');
    setRezervacija(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/rezervacije/${rezId}`);
      const data = await res.json();
      if (!res.ok) {
        setGreska(data.greska || 'Greška pri dohvatu rezervacije');
      } else {
        setRezervacija(data);
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
      fetchRezervacija(Number(id));
    }
  }, [id]);
  const deleteRezervacije = async (id: number) => {
    await fetch(`/api/rezervacije/${id}`, { method: 'DELETE' });
    setRezervacija(null);
    setIsModalOpen(false);

    setToast('Rezervacija je uspešno obrisana!');
    router.push('/admin/rezervacije');
  };
  // Ručno pretraživanje (ako želiš ostaviti formu)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    fetchRezervacija(inputId);
  };
  const openDeleteConfirmModal = (id: string | number) => {
    setInputId(Number(id));
    setIsModalOpen(true);
  };
  const closeDeleteConfirmModal = () => {
    setIsModalOpen(false);
    setInputId(Number(null));
  };
return (
    <div>
      {/* You can add a form here if needed */}
      <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-4 bg-white border-2 border-gray-100 rounded pl-4 pr-4"></form>
      {rezervacija && (
        <div className="flex-col text-left p-2 ">
          <h1 className="text-2xl font-bold-1 p-2 text-left">Detalji Rezervacije</h1>
          <p className="p-3"><>id:</> {rezervacija.id}</p>
          <p className="p-3"><>Apartman:</> {rezervacija.apartman?.naziv}</p>
          <p className="p-3"><>Korisnik:</> {rezervacija.korisnik?.ime}</p>
          <p className="p-3"><>Početak:</> {rezervacija.pocetak}</p>
          <p className="p-3"><>Završetak:</> {rezervacija.kraj}</p>

          <div className="flex gap-3 mt-7 w-full">
            <Link href="/admin/rezervacije">
              <button className="px-4 py-2 rounded bg-black text-white hover:bg-yellow-600 transition">
                Nazad
              </button>
            </Link>
          </div>
        </div>
      )}

      <PotvrdiBrisanjeRezrevacije
        isOpen={isModalOpen}
        onClose={closeDeleteConfirmModal}
        onConfirm={() => inputId !== null && deleteRezervacije(inputId)}
        itemId={inputId!}
        apartman={rezervacija?.apartman?.naziv ?? ''} // <-- OVO JE KLJUČNO, changed to rezervacija?.apartman?.naziv for context
      />
      <Toast message={toast} />
    </div>
  );
}