"use client";

import { signOut } from "next-auth/react";

const SignOut = () => {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="flex justify-center">
      <button onClick={handleSignOut}>
        Odjavi se
      </button>
    </div>
  );
};

export { SignOut };
