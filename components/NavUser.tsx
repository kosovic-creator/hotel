'use client';
import React from 'react'
import { useRouter } from "next/navigation";
import { useEffect } from 'react';
import { useSession } from "next-auth/react";
import SidebarUser from './SidebarUser';
type NavProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
};

export default function NavUser({ isSidebarOpen, setIsSidebarOpen }: NavProps) {
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
  console.log("Session data:", session.user?.role);
  return (
    <div>
      <header className="bg-gray-800 text-white p-4">

        <nav className="mt-2">
          <div className="flex items-center justify-between">

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
              <p className="text-sm text-gray-200">korisnik : {session.user?.email}</p>
            </div>
          </div>
        </nav>
        {/* Sidebar komponenta */}
        <SidebarUser open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} session={session} />
      </header>
    </div>
  );
}
