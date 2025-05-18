import React from 'react'

export default function Nav() {
  return (
    <div>
      <header className="bg-gray-800 text-white p-4">
       
        <nav className="mt-2">
          <ul className="flex space-x-4">
            <li>
              <a href="/admin/apartmani" className="hover:underline">
                Apartmani
              </a>
            </li>
            <li>
              <a href="/admin/rezervacije" className="hover:underline">
                Rezervacije
              </a>
            </li>
            <li>
              <a href="/admin/korisnici" className="hover:underline">
                Korisnici
              </a>
            </li>

          </ul>
        </nav>
      </header>
    </div>
  )
}
