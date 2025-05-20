[...nextauth]/route.ts:
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "tvoj@email.com" },
        password: { label: "Lozinka", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Unesi email i lozinku");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Netačan email ili lozinka");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error("Netačan email ili lozinka");
        }

        return { id: user.id.toString(), email: user.email };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };

login/page.tsx:

"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Prijavi se</button>
    </form>
  );
}

kada poslije uspješne registracije preko register/page.tsx unesm
novog korisnika u bazu, pri pokušaju da se sa istim prijavim pokazuje mi grešk: Pogrešan email ili lozinka.

u dev tools u network:
providers 200 OK
csrf METOD GET 200 OK ali u
credentials  POST 401 Unautorized

Neznam o čemu se radi. Drugo pitanje kako u Postmanu mogu da provjerim login funkciju?
