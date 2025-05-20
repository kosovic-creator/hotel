/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/components/ui/Toast";


export default function RegisterPage() {
const [toast, setToast] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
         setToast('Uspješno je dodat novi korisnik!');
        router.push("/login");
      } else {
        const data = await response.json();
        alert(data.error || "Greška pri registraciji");
      }
    } catch (error) {
      alert("Server error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10">
      <div className="mb-4">
        <label className="block mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Lozinka</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
          minLength={6}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-black text-white p-2 rounded "
      >
        Registruj se
      </button>
       <Toast message={toast} />
    </form>

  );
}
