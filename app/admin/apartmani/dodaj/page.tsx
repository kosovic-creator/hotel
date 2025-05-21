/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import Toast from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { UploadButton } from '@/lib/uploadthing';
export default function ApartmanForma() {
  const [form, setForm] = useState({
    naziv: '',
    opis: '',
    cijena: '',
    slike: ''
  });
   const [toast, setToast] = useState<string | null>(null);
  const [poruka, setPoruka] = useState('');
  const [value, setValue] = useState<string[]>([]);
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const images = form.slike.split(',').map((s) => s.trim()).filter(Boolean);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPoruka('');
    const res = await fetch('/api/apartmani', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        cijena: parseFloat(form.cijena),
        slike: form.slike.split(',').map((s) => s.trim()).filter(Boolean)
      })
    });
    if (res.ok) {
      setPoruka('Apartman uspešno dodat!');
      router.push('/admin/apartmani');
    } else {
      setPoruka('Greška pri unosu apartmana.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="max-w-md p-4 border rounded space-y-3 bg-white shadow">
        <h2 className="text-lg font-bold">Unos apartmana</h2>
        <input
          name="naziv"
          type="text"
          placeholder="Naziv"
          value={form.naziv}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <textarea
          name="opis"
          placeholder="Opis"
          value={form.opis}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="cijena"
          type="number"
          placeholder="Cijena"
          value={form.cijena}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
          min={0}
        />
        {/* <input
          name="slike"
          type="text"
          placeholder="URL slike (odvojiti zarezom)"
          value={value}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        /> */}
        <div className="flex flex-col items-center bg-amber-900 p-2 rounded">
         <UploadButton
                endpoint='imageUploader'
                onClientUploadComplete={(res: { url: string }[]) => {
                  setForm((prev) => ({
                    ...prev,
                    slike: [...images, res[0].url].join(','),
                  }));
                }}
                onUploadError={(error: Error) => {
                  setToast(`ERROR! ${error.message}`);
                }}
              />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded hover:bg-blue-900"
        >
          Sačuvaj apartman
        </button>
        {poruka && <div className="mt-2 text-green-600">{poruka}</div>}
      </form>
       <Toast message={toast} />
    </div>
  );
}
