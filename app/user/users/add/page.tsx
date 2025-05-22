/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';


import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import userSchema from '@/types/usersSchema'; // Import your Zod schema from the appropriate file
import { Label } from "@/components/ui/label";
import { useSession } from 'next-auth/react';
import Toast from '@/components/ui/Toast';


export default function AddTodoForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { data: session, status } = useSession()
  const [toast, setToast] = useState<string | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form data using Zod
    const result = userSchema.safeParse({
      name: name,
      email: email,
      password: password,
      role: role,
    });

    if (!result.success) {
      // Map errors to display them
      const errorMessages = result.error.errors.map((err) => err.message).join(', ');
      setError(errorMessages);
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result.data), // Use validated data
      });

      if (response.ok) {
        setToast('Korisnik je uspješno dodat!');
        setName('');
        setEmail('');
        setPassword('');
        setRole('');
        setTimeout(() => router.push('/user/users'), 1000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Greška u dodavanju korisnika.');
      }
    } catch (err) {
      setError('Greška prilikom slanja podataka.');
    }
  };

  return (
    <>

      <form onSubmit={handleSubmit} className=" w-full max-w-md mx-auto p-4 bg-white  border-gray-100 rounded">
        <h1 className="text-2xl font-bold-3 p-6 text-center">Dodaj Korisnika</h1>

        <div>
          <Label htmlFor="ime" className="block font-medium p-2 border-gray-100">Ime</Label>
          <Input
            id="ime"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded p-2 w-full form-control form-control-lg"
            placeholder="Unesite Ime"

          />
        </div>

        <div>
          <Label htmlFor="email" className="block font-medium p-2  border-gray-100">Email</Label>
          <Input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded p-2 w-full form-control form-control-lg"
            placeholder="Unesite email"

          />
        </div>


        <div>
          <Label htmlFor="šifra" className="block font-medium p-2  border-gray-100">Šifra</Label>
          <Input
            id="šifra"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded p-2 w-full"
            placeholder="Unesite šifru"

          />
        </div>
        <div>
          <Label htmlFor="role" className="block font-medium p-2 border-gray-100">Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger id="role" className="border rounded p-2 w-full">
              {role ? role : "Odaberite rolu"}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="USER">User</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-md hover:bg-black-700"
        >
          Dodaj Korisnika
        </Button>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </form>
      <Toast message={toast} />
    </>
  );
}