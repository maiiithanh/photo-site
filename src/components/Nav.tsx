"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/ongoing-works", label: "Ongoing Works" },
  { href: "/films", label: "Films" },
  { href: "/all-parts-considered", label: "All Parts Considered" },
  { href: "/commissioned", label: "Commissioned" },
  { href: "/info", label: "Info" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    // Sticky, so it stays in place while the page scrolls; self-start keeps
    // it from stretching to the full grid height, which would stop it sticking.
    // Sits 20px up and 20px left of the grid (120px from the top, 95px from
    // the left edge).
    <nav className="sticky top-0 col-span-2 -ml-5 self-start pt-[120px]">
      <Link href="/" className="block">
        Mai-Thanh Nguyen
      </Link>
      <ul className="mt-20">
        {links.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={active ? "dot-underline" : undefined}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
