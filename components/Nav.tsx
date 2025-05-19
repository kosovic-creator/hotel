import React from 'react'
import Link from 'next/link'

export default function Nav() {
  return (
    <div>
      <header className="bg-gray-800 text-white p-4">

        <nav className="mt-2">
          <ul className="flex space-x-4">
            <li>
              <Link href="/admin/apartmani" className="hover:underline">
                Apartmani
              </Link>
            </li>
            <li>
              <Link href="/admin/rezervacije" className="hover:underline">
                Rezervacije
              </Link>
            </li>
            <li>
             <Link href="/admin/korisnici" className="hover:underline">
                Korisnici
              </Link>
            </li>

          </ul>
        </nav>
      </header>
    </div>
  )
}
