// Free-form placement on pages that cover columns 3–6, measured from the
// mockup relative to the grid columns. Horizontal positions are a column
// number plus a fraction of that column's width, so pieces keep their places
// as the columns resize. Vertical positions are the centre of each piece, in
// px from the top of the page, as measured on a 940px-tall page.

// Width of one grid column; 100% is the page's area (columns 3–6)
const COL = "((100% - 60px) / 4)";

// Pieces are moved right from the mockup so the rightmost line of stars on
// the home page ends at the right margin, like the other pages. That line
// sits 5% into column 6 in the mockup; the extra px is the space between the
// edge of its last character cell and the ink of the final dot.
const SHIFT = `(0.95 * ${COL} + 5px)`;

// Left edge at `frac` of the way across column `col`
export function leftAt(col: number, frac: number) {
  return `calc(${col - 3} * (${COL} + 20px) + ${frac} * ${COL} + ${SHIFT})`;
}

// Right edge at `frac` of the way across column `col`
export function rightAt(col: number, frac: number) {
  return `calc(100% - ${col - 3} * (${COL} + 20px) - ${frac} * ${COL} - ${SHIFT})`;
}

// Centre `y` px from the top on a 940px-tall page. In a shorter window it
// moves up in proportion to fit; in a taller one it keeps its position.
export function topAt(y: number) {
  return `min(${y}px, ${(y / 940) * 100}svh)`;
}
