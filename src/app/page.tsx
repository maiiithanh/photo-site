import type { CSSProperties } from "react";
import MaiBranch from "@/components/MaiBranch";

// The composition is free-form, so pieces are placed absolutely, measured
// from the mockup relative to the grid columns. Horizontal positions are a
// column number plus a fraction of that column's width, so the layout keeps
// its shape as the columns resize. Vertical positions are the centre of
// each piece, in px from the top of the page, as measured on a 940px-tall
// page.
//
// The page is exactly as tall as the browser window, so it never scrolls.
// In a window shorter than 940px, every piece moves up in proportion to fit;
// in a taller one, pieces keep their measured positions.
const DESIGN_HEIGHT = 940;

// Width of one grid column; 100% is this page's area (columns 3–6)
const COL = "((100% - 60px) / 4)";

// The whole composition is moved right from the mockup so the rightmost
// ASCII line ends at the right margin, like the other pages. That line sits
// 5% into column 6 in the mockup; the extra px is the space between the edge
// of its last character cell and the ink of the final dot.
const SHIFT = `(0.95 * ${COL} + 5px)`;

// Left edge at `frac` of the way across column `col`
function leftAt(col: number, frac: number) {
  return `calc(${col - 3} * (${COL} + 20px) + ${frac} * ${COL} + ${SHIFT})`;
}

// Right edge at `frac` of the way across column `col`
function rightAt(col: number, frac: number) {
  return `calc(100% - ${col - 3} * (${COL} + 20px) - ${frac} * ${COL} - ${SHIFT})`;
}

type Piece = {
  y: number;
  left?: string;
  right?: string;
} & ({ text: string } | { ascii: string[] });

const eye = [
  "    .  *  .",
  " .-'       '-.",
  "(     (●)     )",
  " '-.       .-'",
  "    '  *  '",
];

const pieces: Piece[] = [
  { ascii: [".｡.:* :**"], left: leftAt(3, 0.05), y: 140 },
  { ascii: ["**::*:.｡."], right: rightAt(6, 0.05), y: 221 },
  { text: "It’s all a question of imagination", left: leftAt(3, 0.848), y: 264 },
  { text: "our responsibility begins with", right: rightAt(5, 0.582), y: 332 },
  { ascii: eye, left: leftAt(3, 0.046), y: 552 },
  { text: "the power to imagine", right: rightAt(5, 0.582), y: 535 },
  { text: "In dreams", left: leftAt(2, 0.599), y: 750 },
  { text: "begin responsibilities", left: leftAt(4, 0.485), y: 750 },
  { ascii: [":**"], left: leftAt(3, 0.705), y: 880 },
];

// Drawn in Doto Regular, line height 130%, at 4/3 of the main text size (32px
// against 24px text in the mockup). Doto is monospaced at 0.6em per
// character; ｡ and ● aren't in Doto and fall back to another font, so every
// character gets a 0.6em cell to keep the drawing's shape. ● is drawn 1.24×
// larger to match the mockup.
function Ascii({ lines }: { lines: string[] }) {
  return (
    <div
      aria-hidden
      className="font-dot text-[calc(4em/3)] leading-[1.3] font-normal tracking-normal"
    >
      {lines.map((line, i) => (
        <div key={i} className="flex">
          {Array.from(line).map((char, j) => (
            <span key={j} className="inline-block w-[0.6em] text-center">
              {char === "●" ? (
                <span className="inline-block scale-[1.24]">{char}</span>
              ) : (
                char
              )}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    // Clipped vertically so falling petals can never make the page scroll
    <div className="relative col-span-4 h-svh overflow-y-clip">
      {pieces.map((piece, i) => {
        const style: CSSProperties = {
          top: `min(${piece.y}px, ${(piece.y / DESIGN_HEIGHT) * 100}svh)`,
          left: piece.left,
          right: piece.right,
        };
        return (
          <div
            key={i}
            style={style}
            className="absolute -translate-y-1/2 whitespace-nowrap"
          >
            {"text" in piece ? <p>{piece.text}</p> : <Ascii lines={piece.ascii} />}
          </div>
        );
      })}
      {/* The mai branch sits at the bottom left of the window, its left
          edge on the nav's (column 1, moved 20px left with the nav) */}
      <div
        className="absolute bottom-0"
        style={{ left: `calc(-2 * (${COL} + 20px) - 20px)` }}
      >
        <MaiBranch />
      </div>
    </div>
  );
}
