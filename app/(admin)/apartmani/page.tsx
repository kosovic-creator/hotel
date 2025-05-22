/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from 'next/image';
import Nav from '@/components/Nav'; // Dodaj import
import Link from 'next/link';

type Apartman = {
  id: number
  naziv: string
  opis: string
  cijena: number
  slike: string[]
}

type Rezervacija = {
  id: number
  apartman: Apartman
  pocetak: string // ISO date string
  kraj: string // ISO date string
}

export default function ApartmaniTabela() {
  const [apartmani, setApartmani] = useState<Apartman[]>([])
  const [rezervacije, setRezervacije] = useState<Rezervacija[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Dodaj state za sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const ucitajApartmane = async () => {
      try {
        const response = await fetch('/api/apartmani')
        if (!response.ok) throw new Error('Greška pri učitavanju')
        const data = await response.json()
        setApartmani(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Nepoznata greška')
      }
    }
    const ucitajRezervacije = async () => {
      try {
        const response = await fetch('/api/rezervacije')
        if (!response.ok) throw new Error('Greška pri učitavanju rezervacija')
        const data = await response.json()
        setRezervacije(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Nepoznata greška rezervacija')
      }
    }
    Promise.all([ucitajApartmane(), ucitajRezervacije()]).finally(() => setLoading(false))
  }, [])
  if (error) return <div className="text-red-500 p-4">Greška: {error}</div>
  const isApartmanDostupan = (apartmanId: number) => {
    if (!startDate || !endDate) return true;

    return !rezervacije.some(r =>
      r.apartman.id === apartmanId &&
      new Date(r.pocetak) < endDate &&
      new Date(r.kraj) > startDate
    );
  };
  return (
    <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl  mb-4">Apartmani</h1>
        <div style={{ margin: '20px 0', display: 'flex', gap: 16 }}>
          <label>
            Početak:
            <DatePicker
              className="border-2 border-gray-200 rounded-md px-3 py-2"
              selected={startDate}
              onChange={date => setStartDate(date)}
              dateFormat="dd.MM.yyyy"
            />
          </label>
          <label>
            Kraj:
            <DatePicker
              className="border-2 border-gray-200 rounded-md px-3 py-2"
              selected={endDate}
              onChange={date => setEndDate(date)}
              dateFormat="dd.MM.yyyy"
            />
          </label>
        </div>
        <Link
        className="bg-gray-950 text-white px-4 py-3 w-40 h-9 rounded flex items-center justify-center mb-4 hover:bg-gray-600 transition duration-300"
        href="/apartmani/dodaj"
      >
        Dodaj
      </Link>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Naziv</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Opis</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cijena (€)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slike</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {apartmani.filter(apartman => isApartmanDostupan(apartman.id)).map(apartman => (
                <tr key={apartman.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{apartman.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{apartman.naziv}</td>
                  <td className="px-6 py-4 max-w-xs">{apartman.opis}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{apartman.cijena.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      {apartman.slike.slice(0, 3).map((slika, index) => (
                        <Image
                          key={index}
                          src={slika}
                          alt={`Slika ${index + 1}`}
                          width={48}
                          height={48}
                          className="h-12 w-12 object-cover rounded"
                        />
                      ))}
                      {apartman.slike.length > 3 && (
                        <span className="text-gray-500">+{apartman.slike.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link className='mr-3' href={`/apartmani/${apartman.id}`}>Detalji</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {apartmani.length === 0 && !loading && (
          <div className="text-center text-gray-500 mt-4">Nema dostupnih apartmana.</div>
        )}
      </div>
    </div>
  )
}
