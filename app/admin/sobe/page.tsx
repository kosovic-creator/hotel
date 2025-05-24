/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { useEffect, useState } from 'react'
import "react-datepicker/dist/react-datepicker.css";
import Image from 'next/image';
import Link from 'next/link';

type Sobe = {
  id: number
  naziv: string
  opis: string
  cijena: number
  slike: string[]
}

export default function SobeLista() {
  const [soba, setSoba] = useState<Sobe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Dodaj state za sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const ucitajSobe = async () => {
      try {
        const response = await fetch('/api/hotel/sobe')
        if (!response.ok) throw new Error('Greška pri učitavanju')
        const data = await response.json()
        setSoba(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Nepoznata greška')
      } finally {
        setLoading(false)
      }
    }
    ucitajSobe()
  }, [])
  return (
    <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl  mb-4">Sobe</h1>
        <Link
        className="bg-gray-950 text-white px-4 py-3 w-40 h-9 rounded flex items-center justify-center mb-4 hover:bg-gray-600 transition duration-300"
        href="/admin/sobe/dodaj"
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
              {soba.map(sobe =>  (
                <tr key={sobe.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{sobe.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{sobe.naziv}</td>
                  <td className="px-6 py-4 max-w-xs">{sobe.opis}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{sobe.cijena.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      {sobe.slike.slice(0, 3).map((slika, index) => (
                        <Image
                          key={index}
                          src={slika}
                          alt={`Slika ${index + 1}`}
                          width={48}
                          height={48}
                          className="h-12 w-12 object-cover rounded"
                        />
                      ))}
                      {sobe.slike.length > 3 && (
                        <span className="text-gray-500">+{sobe.slike.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link className='mr-3' href={`/admin/sobe/${sobe.id}`}>Detalji</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
