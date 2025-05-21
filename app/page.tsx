/* eslint-disable @typescript-eslint/no-unused-vars */
import RezervacijaForma from "@/components/RezervacijaForma";
import Admin from "./admin/page";
import Link from "next/link";


export default function Home() {

  return (
    <>
    <p className="text-center text-2xl font-bold mt-4">Home</p>
      <RezervacijaForma apartmanId={7} />


    </>
  );
}
