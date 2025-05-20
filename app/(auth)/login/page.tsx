"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.ok) {
      router.push("/");
    } else {
      alert("Pogrešan email ili lozinka");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-20 p-8 bg-white rounded-xl shadow flex flex-col gap-6"
    >
      <h2 className="text-2xl font-bold text-center mb-2">Prijava</h2>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="Email"
        className="w-full"
      />
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        placeholder="Lozinka"
        className="w-full"
      />
      <Button
        type="submit"
        className="w-full bg-black text-white hover:bg-yellow-600 transition font-semibold py-2 rounded"
      >
        Prijavi se
      </Button>
      <div className="text-center">
        <Button asChild variant="link">
          <Link href="/register">Ako nemate nalog? Napravite nalog</Link>
        </Button>
      </div>
    </form>
  );
}
