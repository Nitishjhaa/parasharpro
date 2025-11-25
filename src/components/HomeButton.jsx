"use client";

import Link from "next/link";
import { IoHomeOutline } from "react-icons/io5";
import { usePathname } from "next/navigation";

export default function HomeButton() {
  const pathname = usePathname();

  // If already on "/" (home), no need to show button
  if (pathname === "/") return null;

  return (
    <Link href={pathname === "/kundali" ? "/" : "/kundali"}>
      <div className={`${pathname === "/kundali" ? 'top-10' : 'top-8'}  w-10 h-10 absolute right-8  bg-black rounded-full flex justify-center items-center text-white cursor-pointer`}>
        <IoHomeOutline />
      </div>
    </Link>
  );
}
