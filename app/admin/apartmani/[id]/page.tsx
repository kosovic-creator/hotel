/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import PotvrdiBrisanjeApartmana from '@/components/PotvrdaBrisanjaModal/PotvrdiBrisanjeApartmana';
import Toast from '@/components/ui/Toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';



export default function ApartmaniByIdForm({ params }: { params: Promise<{ id: number }> }) {
  const { id } = React.use(params);
  type Apartman = {
    id: number;
    naziv: string;
    opis: string;
    cijena: number;
    slike: string[]; // <-- ispravno
  };
  const [apartman, setApartman] = useState<Apartman | null>(null);
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
    setApartman(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/apartmani/${aparId}`);
      const data = await res.json();
      if (!res.ok) {
        setGreska(data.greska || 'Greška pri dohvatu apartmana');
      } else {
        setApartman(data);
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
    setApartman(null);
    setIsModalOpen(false);

    setToast('Apartman je uspešno obrisan!');
    router.push('/admin/apartmani');
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
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-xl">
        {/* You can add a form here if needed */}
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-4 bg-white border-2 border-gray-100 rounded pl-4 pr-4"></form>
        {apartman && (
          <div className="flex-col text-left p-2 ">
            <h1 className="text-2xl font-bold-1 p-2 text-left">Detalji Apartmana</h1>
            <p className="p-3"><>Naziv:</> {apartman.naziv}</p>
            <p className="p-3"><>Opis:</> {apartman.opis}</p>
            <p className="p-3"><>Cijena:</> {apartman.cijena}</p>
            {/* <p className="p-3"><>slike:</> {apartman.slike}</p> */}

            {apartman.slike && Array.isArray(apartman.slike) && apartman.slike.length > 0 && (
              <div className="flex gap-2 p-3">
                {apartman.slike.map((url: string, idx: number) => (
                  <img
                    key={idx}
                    src={url.trim()}
                    alt={`slika apartmana ${apartman.naziv}`}
                    className="w-32 h-24 object-cover rounded"
                  />
                ))}
              </div>
            )}

            <div className="flex gap-3 mt-7 w-full">
              <Link href="/admin/apartmani">
                <button className="px-4 py-2 rounded bg-black text-white hover:bg-yellow-600 transition">
                  Nazad
                </button>
              </Link>
              <Link href={`/admin/apartmani/uredi/${apartman.id}`} >
                <button className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600 transition">Izmjeni</button>
              </Link>
              <button className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition " onClick={() => openDeleteConfirmModal(apartman.id)}>Briši</button>
            </div>
          </div>
        )}

        <PotvrdiBrisanjeApartmana
          isOpen={isModalOpen}
          onClose={closeDeleteConfirmModal}
          onConfirm={() => selectedItemId !== null && deleteApartman(selectedItemId)}
          itemId={selectedItemId!}
          naziv={apartman?.naziv ?? ''}
        />
        <Toast message={toast} />
      </div>
    </div>
  );
}