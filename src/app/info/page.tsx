import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Ascii, { eye } from "@/components/Ascii";
import MaiBranch from "@/components/MaiBranch";
import { leftAt, rightAt, topAt } from "@/lib/grid";

export const metadata: Metadata = {
  title: "Info — Mai-Thanh Nguyen",
};

const email = "mai-thanh_nguyen@alumni.brown.edu";

type Piece = {
  lines: string[];
  y: number;
  left?: string;
  right?: string;
  // Alignment on phones, where the pieces stack between the text and the
  // mai branch
  phone: string;
};

// The stars and eye from the home page's original composition (see grid).
// The eye and the last stars keep their places; the first two lines of
// stars sat where the text is here, so they move up into the middle of the
// top margin (70px down, halfway to the text's 140px).
const pieces: Piece[] = [
  {
    lines: [".｡.:* :**"],
    left: leftAt(3, 0.05),
    y: 70,
    phone: "max-md:self-start",
  },
  {
    lines: ["**::*:.｡."],
    right: rightAt(6, 0.05),
    y: 70,
    phone: "max-md:self-end",
  },
  // The eye sits 35% of this area further right than on the home page, to
  // keep clear of the mai branch, and 10% of the page height higher (94px
  // on the 940px-tall mockup)
  {
    lines: eye,
    left: `calc(${leftAt(3, 0.046)} + 35%)`,
    y: 552 - 94,
    phone: "max-md:self-center",
  },
  {
    lines: [":**"],
    left: leftAt(3, 0.705),
    y: 880,
    phone: "max-md:self-center",
  },
];

export default function Info() {
  return (
    // At least as tall as the window, so the mai branch can sit at the
    // bottom of it. Clipped vertically so falling petals can never make the
    // page scroll.
    <div className="relative col-span-4 min-h-svh overflow-y-clip pt-[140px] max-md:flex max-md:min-h-0 max-md:flex-1 max-md:flex-col max-md:pt-10">
      <p>
        I am a photographer and experimental new media artist based in San
        Francisco, California. I am inspired by the varying schools of
        consciousness, memory, collective languages of persistence, and our
        relationship to technology. You can reach me by email.
      </p>
      {/* One blank line (one line-height) between paragraphs */}
      <p className="mt-[1.4em]">
        <a href={`mailto:${email}`}>{email}</a>
      </p>
      {/* Desktop positions are passed as variables and applied only from
          768px up. The wrapper only exists on phones; on desktop the pieces
          are placed on the page. */}
      <div className="md:contents max-md:flex max-md:flex-col max-md:gap-6 max-md:pt-10">
        {pieces.map(({ lines, y, left, right, phone }) => (
          <div
            key={lines.join()}
            style={
              {
                "--top": topAt(y),
                "--left": left,
                "--right": right,
              } as CSSProperties
            }
            className={`md:absolute md:top-(--top) md:right-(--right) md:left-(--left) md:-translate-y-1/2 ${phone}`}
          >
            <Ascii lines={lines} />
          </div>
        ))}
      </div>
      {/* The mai branch sits at the bottom left of the window, its left edge
          on the nav's (column 1, moved 20px left with the nav: two columns
          and gutters left of this area, then 20px more). On phones it
          follows the text, at the bottom of the window. It overlaps the
          nav, so it lets clicks through to the links underneath. */}
      <div className="pointer-events-none max-md:mt-auto max-md:pt-10 md:absolute md:bottom-0 md:left-[calc(-2*((100%-60px)/4+20px)-20px)] md:-mb-[2.3em] md:-ml-[3.4em] md:text-[calc(var(--nav-text)*4/3)]">
        <MaiBranch />
      </div>
    </div>
  );
}
