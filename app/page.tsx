/* eslint-disable @typescript-eslint/no-unused-vars */
import RezervacijaForma from "@/components/RezervacijaForma";
import "./globals.css";


export default function Home() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">

      <div className="w-full max-w-lg">
        <RezervacijaForma apartmanId={7} />
      </div>
    </div>
  );
}
