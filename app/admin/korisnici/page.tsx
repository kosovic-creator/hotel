/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type Korisnik = {
  id: number
  email: string
  ime: string | null
  prezime: string | null
}

export default function KorisniciTabela() {
  const [korisnici, setKorisnici] = useState<Korisnik[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const ucitajKorisnike = async () => {
      try {
        const response = await fetch('/api/korisnici')
        if (!response.ok) throw new Error('Greška pri učitavanju korisnika')
        const data = await response.json()
        setKorisnici(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Nepoznata greška')
      } finally {
        setLoading(false)
      }
    }
    ucitajKorisnike()
  }, [])

  // if (loading) return <div className="text-center p-4">Učitavanje korisnika...</div>
  if (error) return <div className="text-red-500 p-4">Greška: {error}</div>

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Korisnici</h1>
{/* <button onClick={() => window.location.href = '/admin/korisnici/dodaj'} className="px-4 py-2 bg-black text-white rounded hover:bg-blue-900 mb-4">
  Dodaj korisnika
</button> */}
<Link href="/admin/korisnici/dodaj">Dodaj</Link>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ime</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prezime</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {korisnici.map((korisnik) => (
                <tr key={korisnik.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{korisnik.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{korisnik.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{korisnik.ime ?? ''}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{korisnik.prezime ?? ''}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/admin/korisnici/${korisnik.id}`}>Detalji</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
}
