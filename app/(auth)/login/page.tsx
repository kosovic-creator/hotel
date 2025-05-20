"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
      router.push("/profile");
    } else {
      alert("Pogrešan email ili lozinka");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input  type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      <Button type="submit">Prijavi se</Button>
    </form>
  );
}
