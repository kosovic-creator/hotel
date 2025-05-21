/* eslint-disable @typescript-eslint/no-unused-vars */
import RezervacijaForma from "@/components/RezervacijaForma";
import Admin from "./admin/page";
import Link from "next/link";


export default function Home() {

  return (
    <>
    <p className="text-center text-2xl font-bold mt-4">Home</p>
      {/* <RezervacijaForma apartmanId={2} /> */}

<Link href="/admin" className="px-4 py-2 text-blue-900 hover:text-blue-400 mb-4">
  Admin
</Link>
    </>
  );
}
