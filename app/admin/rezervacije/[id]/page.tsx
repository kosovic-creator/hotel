/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
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
  const { id } = React.use(params); // <-- OVO JE KLJUČNO

  const [rezervacija, setRezervacija] = useState<Rezervacija | null>(null);
  const [greska, setGreska] = useState('');
  const [loading, setLoading] = useState(false);
  const [inputId, setInputId] = useState(Number(id));

  useEffect(() => {
    setInputId(Number(id));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGreska('');
    setRezervacija(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/rezervacije/${inputId}`);
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

  return (
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
        <label style={{ fontWeight: 500, color: '#333' }}>
          ID rezervacije:
          <input
            type="number"
            value={inputId}
            onChange={e => setInputId(Number(e.target.value))}
            required
            min={1}
            style={{
              marginTop: 8,
              padding: 8,
              borderRadius: 6,
              border: '1px solid #bdbdbd',
              fontSize: 16,
              width: '100%',
              boxSizing: 'border-box',
            }}
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 0',
            borderRadius: 6,
            border: 'none',
            background: '#1976d2',
            color: '#fff',
            fontWeight: 600,
            fontSize: 16,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'background 0.2s',
          }}
        >
          Prikaži rezervaciju
        </button>
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
    </div>
  );
}