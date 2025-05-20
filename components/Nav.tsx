'use client';
import React from 'react'
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";
import Sidebar from './Sidebar';
export default function Nav() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
          <div className="flex items-center justify-between">
            {/* Leva strana: dugme za otvaranje sidebar-a */}
            <div>
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded hover:bg-gray-700 focus:outline-none"
                aria-label="Otvori meni"
              >
                {/* Hamburger ikonica */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            {/* Desna strana */}
            <div>
              <p className="text-sm text-gray-200">korisnik je : {session.user?.email}</p>
            </div>
          </div>
        </nav>
        {/* Sidebar komponenta */}
        <Sidebar open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} session={session} />
      </header>
    </div>
  )
}
