import type { CSSProperties } from "react";
import Ascii from "@/components/Ascii";
import Spiral from "@/components/Spiral";
import { leftAt, rightAt, topAt } from "@/lib/grid";

type Star = {
  line: string;
  y: number;
  left?: string;
  right?: string;
  // Classes placing it on phones, in the open space above the spiral
  phone: string;
};

// The stars keep their places from the original composition (see grid)
const stars: Star[] = [
  {
    line: ".｡.:* :**",
    left: leftAt(3, 0.05),
    y: 140,
    phone: "max-md:top-[4%] max-md:left-0",
  },
  {
    line: "**::*:.｡.",
    right: rightAt(6, 0.05),
    y: 221,
    phone: "max-md:top-[12%] max-md:right-0",
  },
  {
    line: ":**",
    left: leftAt(3, 0.705),
    y: 880,
    phone: "max-md:top-[24%] max-md:left-0",
  },
];

export default function Home() {
  return (
    // The page is exactly as tall as the browser window, so it never
    // scrolls. The spiral's text is always the nav's size; both shrink
    // together in windows too small for it at full size (see Spiral).
    // On phones (below 768px) it fills the space below the nav, drawn with a
    // trail that turns upward sooner so it stays narrow.
    //
    // On desktop the spiral sits in the bottom right corner and the tail of
    // loose letters drifts left across the page, ending in column 2 (below
    // the nav), so the drawing area reaches one column and gutter left of
    // columns 3–6.
    <div className="relative col-span-4 h-svh max-md:h-auto max-md:min-h-[60svh] max-md:flex-1">
      <div className="absolute inset-x-0 top-[80px] bottom-[50px] md:left-[calc(-1*((100%-60px)/4+20px))] max-md:top-6 max-md:bottom-6">
        <Spiral className="max-md:hidden" />
        <Spiral phone className="md:hidden" />
      </div>
      {/* Desktop positions are passed as variables and applied only from
          768px up */}
      {stars.map(({ line, y, left, right, phone }) => (
        <div
          key={line}
          style={
            {
              "--top": topAt(y),
              "--left": left,
              "--right": right,
            } as CSSProperties
          }
          className={`absolute md:top-(--top) md:right-(--right) md:left-(--left) md:-translate-y-1/2 ${phone}`}
        >
          <Ascii lines={[line]} />
        </div>
      ))}
    </div>
  );
}
