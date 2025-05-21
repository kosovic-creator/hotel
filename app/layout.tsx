/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';


import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import SessionClientProvider from "@/components/SessionClientProvider";
import { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionClientProvider>
          {/* <Nav isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}> */}
            {children}
          {/* </div> */}
        </SessionClientProvider>
      </body>
    </html>
  );
}
