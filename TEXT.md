▲ Next.js 15.3.2
   - Environments: .env

   Creating an optimized production build ...
 ✓ Compiled successfully in 3.0s
 ✓ Linting and checking validity of types
   Collecting page data  ...[Error: Failed to collect configuration for /sign-in] {
  [cause]: Error: `headers` was called outside a request scope. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context
      at d (.next/server/chunks/412.js:34:33102)
      at s (.next/server/chunks/412.js:17:20965)
      at <unknown> (.next/server/app/(auth)/sign-in/page.js:1:3803)
      at t.a (.next/server/webpack-runtime.js:1:891)
      at 41098 (.next/server/app/(auth)/sign-in/page.js:1:2792)
      at t (.next/server/webpack-runtime.js:1:128)
      at <unknown> (.next/server/app/(auth)/sign-in/page.js:1:1406)
      at t.a (.next/server/webpack-runtime.js:1:891)
}

> Build error occurred
[Error: Failed to collect page data for /sign-in] { type: 'Error' }

moj kod sign-up.tsx:
import { signUp } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { redirect } from "next/navigation";
import Link from "next/link";
// import { GithubSignIn } from "@/components/github-sign-in";
import { auth } from "@/lib/auth";

const Page = async () => {
  const session = await auth();
  if (session) redirect("/sign-in");

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center mb-6">Napravite nalog</h1>

      {/* <GithubSignIn /> */}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-background px-2 text-muted-foreground">

          </span>
        </div>
      </div>

      {/* Email/Password Sign Up */}
      <form
        className="space-y-4"
        action={async (formData) => {
          "use server";
          const res = await signUp(formData);
          if (res.success) {
            redirect("/sign-in");
          }
        }}
      >
        <Input
          name="email"
          placeholder="Email"
          type="email"
          required
          autoComplete="email"
        />
        <Input
          name="password"
          placeholder="Password"
          type="password"
          required
          autoComplete="new-password"
        />
        <Button className="w-full" type="submit">
          Sign Up
        </Button>
      </form>

      <div className="text-center">
        <Button asChild variant="link">
          <Link href="/sign-in">Already have an account? Sign in</Link>
        </Button>
      </div>
    </div>
  );
};


auth.ts:
/* eslint-disable @typescript-eslint/no-unused-vars */
import { v4 as uuid } from "uuid";
import { encode as defaultEncode } from "next-auth/jwt";

import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
// import GitHub from "next-auth/providers/github";
import  schema  from "@/types/usersSchema";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import authConfig from "@/lib/auth.config";


// Extend the User type to include the role property
declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}

const adapter = PrismaAdapter(prisma);

export const { handlers, signIn, signOut } = NextAuth({
  adapter,
  providers: [
    // GitHub({
    //   clientId: process.env.GITHUB_CLIENT_ID as string,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    // }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validatedCredentials = schema.parse(credentials);

        const user = await prisma.user.findFirst({
          where: {
            email: validatedCredentials.email,
            password: validatedCredentials.password,
          },

        }

      );

      // redirect("/todo");
        if (!user) {
          throw new Error("Invalid credentials.");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      // Dodajemo role u token kada postoji user (znači na login)
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    // Dodaj i session callback da bi role bio dostupan na frontendu
    async session({ session, token }) {
      if (token?.role && typeof token.role === "string" && session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },

  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token.sub) {
          throw new Error("No user ID found in token");
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        if (!createdSession) {
          throw new Error("Failed to create session");
        }

        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
});

export { handlers as GET, handlers as POST };

// Dodaj ovo za server-side session:
export { getServerSession as auth } from "next-auth";

const session = await getServerSession(authConfig);


export default Page;
Zašto je ovagreška?