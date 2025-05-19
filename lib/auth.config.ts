import Credentials from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

const authConfig: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // ...tvoja logika...
        return { id: "1", email: credentials?.email }; // primjer
      },
    }),
  ],
};

export default authConfig;