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
    // On phones it sits above the page and scrolls away with it: the name on
    // the left, the links stacked on the right.
    // On desktop its text is drawn at --nav-text (see the layout), which can
    // be smaller than the main text so it matches the home page's spiral;
    // letter spacing scales with it (1px at full size).
    <nav className="md:text-(length:--nav-text) md:tracking-[calc(var(--nav-text)/16.8)] sticky top-0 col-span-2 -ml-5 self-start pt-[120px] max-md:static max-md:ml-0 max-md:flex max-md:w-full max-md:items-start max-md:justify-between max-md:pt-6">
      <Link href="/" className="block">
        Mai-Thanh Nguyen
      </Link>
      <ul className="mt-20 max-md:mt-0 max-md:text-right">
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
