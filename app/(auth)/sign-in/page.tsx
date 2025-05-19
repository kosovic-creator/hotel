/* eslint-disable @typescript-eslint/no-unused-vars */
import { signIn } from "next-auth/react";
// import { GithubSignIn } from "@/components/github-sign-in";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { executeAction } from "@/lib/executeAction";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = async () => {
  return (
    <div className="w-full max-w-sm mx-auto space-y-6b mt-40">
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

      {/* Email/Password Sign In */}
      <form
        className="space-y-4"
        action={async (formData) => {
          "use server";
          await executeAction({
            actionFn: async () => {
              const email = formData.get("email") as string;
              const password = formData.get("password") as string;
              await signIn("credentials", {
                redirect: false,
                email,
                password,
              });
            },
          });
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
          placeholder="Šifra"
          type="password"
          required
          autoComplete="current-password"
        />
        <Button className="w-full" type="submit">
          Prijavi se
        </Button>
      </form>

      <div className="text-center">
        <Button asChild variant="link">
          <Link href="/sign-up">Ako nemate nalog? Napravite nalog</Link>
        </Button>
      </div>
    </div>
  );
};

export default Page;

