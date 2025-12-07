"use client";

import Link from "next/link";
import { IoHomeOutline } from "react-icons/io5";
import { usePathname } from "next/navigation";

export default function HomeButton() {
  const pathname = usePathname();

  // If already on "/" (home), no need to show button
  if (pathname === "/") return null;

  let href = "/kundali"; // Default fallback (e.g. from other pages)

  // Logic for Kundali section
  if (pathname.startsWith("/kundali")) {
    // If exactly on /kundali, go Home. Else go back to /kundali
    href = pathname === "/kundali" ? "/" : "/kundali";
  }
  // Logic for Child section
  else if (pathname.startsWith("/child")) {
    // If exactly on /child, go Home. Else go back to /child
    href = pathname === "/child" ? "/" : "/child";
  }

  // Adjust top position for consistency (main section pages have different spacing?)
  // Original only checked "/kundali". Assuming "/child" needs same spacing.
  const isSectionRoot = pathname === "/kundali" || pathname === "/child";

  return (
    <Link href={href}>
      <div className={`${isSectionRoot ? 'top-10' : 'top-8'}  w-10 h-10 absolute right-8  bg-black rounded-full flex justify-center items-center text-white cursor-pointer`}>
        <IoHomeOutline />
      </div>
    </Link>
  );
}
