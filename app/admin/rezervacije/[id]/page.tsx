/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
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
  <>
    <div
      style={{
        maxWidth: 400,
        margin: '40px auto',
        padding: 24,
        border: '1px solid #e0e0e0',
        borderRadius: 12,
        background: '#fafbfc',
        boxShadow: '0 2px 8px #0001',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          marginBottom: 24,
        }}
      >

      </form>
      {loading && <p style={{ color: '#1976d2', fontWeight: 500 }}>Učitavanje...</p>}
      {greska && <p style={{ color: '#d32f2f', fontWeight: 500 }}>{greska}</p>}
      {rezervacija && rezervacija.apartman && rezervacija.korisnik && (
        <div
          style={{
            background: '#fff',
            borderRadius: 8,
            padding: 16,
            border: '1px solid #e0e0e0',
            marginTop: 8,
          }}
        >
          <h3 style={{ margin: '0 0 12px 0', color: '#1976d2' }}>
            Rezervacija #{rezervacija.id}
          </h3>
          <p>
            <strong>Apartman:</strong> {rezervacija.apartman.naziv}
          </p>
          <p>
            <strong>Korisnik:</strong> {rezervacija.korisnik.ime} ({rezervacija.korisnik.email})
          </p>
          <p>
            <strong>Početak:</strong> {new Date(rezervacija.pocetak).toLocaleString()}
          </p>
          <p>
            <strong>Kraj:</strong> {new Date(rezervacija.kraj).toLocaleString()}
          </p>
          <p>
            <strong>Kreirano:</strong> {new Date(rezervacija.createdAt).toLocaleString()}
          </p>
        </div>
      )}
      <div className="flex gap-3 mt-7 w-full">
        <Link href="/admin/rezervacije">
          <button className="px-4 py-2 rounded bg-black text-white hover:bg-yellow-600 transition">
            Nazad
          </button>
        </Link>
        <Link href={`/admin/rezervacije/uredi/${rezervacija?.id}`} >
          <button className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600 transition">Izmjeni</button>
        </Link>
        <button className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition " onClick={() => openDeleteConfirmModal(rezervacija?.id ?? 0)} >Briši</button>
      </div>
       <Toast message={toast} />
    </div>
    <ConfirmDeleteModal
      isOpen={isModalOpen}
      onClose={closeDeleteConfirmModal}
      onConfirm={() => deleteRezervacije(inputId)}
      itemId={inputId!}
      apartman={rezervacija?.apartman?.naziv ?? ''} // Pretpostavljam da želiš naziv apartmana ovde
    />
  </>
);

}
