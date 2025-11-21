"use client";

import Link from "next/link";
import { IoHomeOutline } from "react-icons/io5";
import { usePathname } from "next/navigation";

export default function HomeButton() {
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/kundali") return null;

  return (
    <Link href="/kundali">
      <div className="w-10 h-10 absolute right-8 top-8 bg-black rounded-full flex justify-center items-center text-white">
        <IoHomeOutline />
      </div>
    </Link>
  );
}
