'use client';
import React from 'react'
import Link from 'next/link'

import { useRouter } from "next/navigation";
import { useEffect } from 'react';
import { useSession } from "next-auth/react";
import { SignOut } from './sign-out';
export default function Nav() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      console.log("Redirecting to login page");
    }
  }, [status, router]);
   if (status === "loading" || !session) {
    return null;
  }
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
            <li>
             <Link href="/login" className="hover:underline">
                Prijavi se
              </Link>
            </li>
            <SignOut />
            <li>
             <Link href="/register" className="hover:underline">
                Registruj se
              </Link>
            </li>

          </ul>
        </nav>
      </header>
    </div>
  )
}
