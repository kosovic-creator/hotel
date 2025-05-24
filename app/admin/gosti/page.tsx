'use client'
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react'

type Gost={
    id: number;
    ime: string;
    prezime: string;
    email: string;
}

export default function GostiLista() {
    const [gost, setGost] = useState<Gost[] | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const router = useRouter();

    useEffect(() => {
        async function fetchTodo() {
            try {
                const response = await fetch('/api/hotel/gosti');
                if (!response.ok) {
                    throw new Error('grešk sa serverom');
                }
                const data = await response.json();
                setGost(data);
            } catch (error) {
                setError(error as Error);
            }
        }
        fetchTodo();
    }, []);

    if (error) {
        return <div>Error: {error.message}</div>;
    }
    if (!gost) {
        return <div>Loading...</div>;
    }

    function brišiGosta(id: number) {
        fetch(`/api/hotel/gosti/${id}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Serverne pože da pošalje grešku');
                }
                return response.json();
            })
            .then(() => {
                setGost((prev) => prev ? prev.filter((t) => t.id !== id) : prev);
            })
            .catch((error) => {
                console.error('Greška pri brisanju gosta:', error);
            });
    }
    // Pagination logic
    const totalPages = Math.ceil(gost.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const trenutniGost = gost.slice(startIdx, startIdx + itemsPerPage);

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-gray-50 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl  text-gray-800">Lista Gostiju</h1>
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow transition"
                    onClick={() => {
                        router.push(`/admin/gosti/dodaj`);
                    }}
                >
                    Dodaj
                </button>
            </div>
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
                <thead>
                    <tr>
                        <th className="py-3 px-4 border-b bg-gray-100 text-left font-semibold text-gray-700">ID</th>
                        <th className="py-3 px-4 border-b bg-gray-100 text-left font-semibold text-gray-700">Ime</th>
                        <th className="py-3 px-4 border-b bg-gray-100 text-left font-semibold text-gray-700">Prezime</th>
                        <th className="py-3 px-4 border-b bg-gray-100 text-left font-semibold text-gray-700">Email</th>
                        <th className="py-3 px-4 border-b bg-gray-100 text-left font-semibold text-gray-700"></th>
                    </tr>
                </thead>
                <tbody>
                    {trenutniGost.map((item: { id: number,ime:string,prezime:string,email:string}) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition">
                            <td className="py-2 px-4 border-b">{item.id}</td>
                            <td className="py-2 px-4 border-b">{item.ime}</td>
                            <td className="py-2 px-4 border-b">{item.prezime}</td>
                            <td className="py-2 px-4 border-b">{item.email}</td>
                            <td className="py-2 px-4 border-b flex gap-2">
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg font-medium transition"
                                    onClick={() => {
                                        brišiGosta(item.id);
                                    }}
                                >
                                    Briši Gosta
                                </button>
                                <button
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg font-medium transition"
                                    onClick={() => {
                                        router.push(`/admin/gosti/uredi/${item.id}`);
                                    }}
                                >
                                    Ažuriraj
                                </button>
 <button
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg font-medium transition"
                                    onClick={() => {
                                        router.push(`/admin/gosti/${item.id}`);
                                    }}
                                >
                                    Detalji
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Pagination controls */}
            <div className="flex justify-center items-center gap-2 mt-6">
                <button
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Predhodna
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                    <button
                        key={idx}
                        className={`px-3 py-1 rounded ${currentPage === idx + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                        onClick={() => setCurrentPage(idx + 1)}
                    >
                        {idx + 1}
                    </button>
                ))}
                <button
                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Sledeća
                </button>
            </div>
        </div>
    )
}
