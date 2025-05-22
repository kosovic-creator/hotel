//
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';


import { useEffect, useState, useTransition } from 'react';


import Link from 'next/link';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import LoadingDots from '@/components/loading-dots';
import { useSession } from "next-auth/react";
import { Users } from '@/types/users';

export default function UserTable() {
  const [users, setUsers] = useState<Users[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  // const korisnik = (session?.user as { name?: string })?.name ?? '';
  useEffect(() => {
    startTransition(() => {
      fetch('/api/users')
        .then(res => res.json())
        .then(setUsers);
    });
  }, []);

  const filteredUsers =
    users.filter(user =>
      user.email.includes(filter)
    );
  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  return (
    <>
        <div className="flex justify-end items-center p-4">
        <div className="relative w-64">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="w-5 h-5 text-gray-500" />
          </span>
          <Input
            type="search"
            placeholder="Pretraga..."
            className="pl-10 w-full h-10 border border-gray-300 rounded-md"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
            <Link href="/user/users/add" className='mr-0 p-3'>
              <button className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition p-4">Dodaj</button>
            </Link>
          </div>
        <table className="table-auto w-full border-collapse border border-gray-300 mt-4">
          <thead className="bg-black text-white font-thin">
            <tr className='border-b border-gray-300 text-white'>
              <th className='p-3 text-center'>Email</th>
              <th className="p-3 text-center">Password</th>
              <th className="p-3 text-center">Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody className='text-sm text-gray-700 bg-white divide-y divide-gray-300'>
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center"> <LoadingDots /> </td>
              </tr>
            ) : (
              currentUsers.map(user => (
                <tr key={user.id}>
                  <td className='p-2 text-center'>{user.email}</td>
                  <td className='text-center'>{user.password}</td>
                  <td className='text-center'>{user.role}</td>
                  <td>
                    <div className="flex gap-2 flex-row-reverse w-full">
                      <Link href={`/user/users/${user.id}`} >
                      Detalji
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* Pagination controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            className="px-4 py-2 rounded bg-gray-300 text-black hover:bg-gray-400 transition"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prethodna
          </button>
          <span>Stranica {currentPage} od {totalPages}</span>
          <button
            className="px-4 py-2 rounded bg-gray-300 text-black hover:bg-gray-400 transition"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Sledeća
          </button>
        </div>

      <footer className="flex justify-center items-center p-4 bg-gray-100">

      </footer>

    </>
  );
}


