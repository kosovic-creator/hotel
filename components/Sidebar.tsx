'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SignOut } from "@/components/sign-out";
import { redirect, useRouter } from "next/navigation"; // Import useRouter from next/navigation
import { Session } from "next-auth"; // Import Session type

export type SidebarProps = {
    session: Session;
    open: boolean;
    onClose: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ session, open, onClose }) => {
    const [isVisible, setIsVisible] = useState(open);
    const router = useRouter(); // Next.js router

    // Redirect to sign-in if no session
    useEffect(() => {
        if (!session) {
            redirect("/login");
        }
    }, [session]);

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            const sidebar = document.getElementById("sidebar");
            if (sidebar && !sidebar.contains(event.target as Node)) {
                setIsVisible(false);
                onClose(); // Call onClose prop when closing
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [onClose]);

    // Update local state when open prop changes
    useEffect(() => {
        setIsVisible(open);
    }, [open]);

    // Automatsko zatvaranje sidebara na timer
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                onClose();
            }, 3000); // 3000ms = 3 sekunde
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    return (
        <>
            <aside
                id="sidebar"
                className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-38 p-4 transform ${isVisible ? "translate-x-0" : "-translate-x-full"
                    } transition-transform duration-300 ease-in-out flex flex-col`}
            >
                <div className="flex flex-col gap-4 pt-4 items-start mt-14 ">
                    <Link href="/pregled-slobodnih-apartmana" className="hover:underline">
                        Rezervacija
                    </Link>

                    <Link href="/admin/apartmani" className="hover:underline">
                        Apartmani
                    </Link>
                    <Link
                        href="/admin/rezervacije"
                        className="hover:underline"
                    >
                        <h1 >Rezervacije</h1>
                    </Link>
                    <Link href="/admin/korisnici" className="hover:underline">
                        Korisnici
                    </Link>
                    <div className="mt-12">
                        {session ? (
                            <SignOut />
                        ) : (
                            <Link href="/login" className="hover:underline">
                                Prijavi se
                            </Link>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;