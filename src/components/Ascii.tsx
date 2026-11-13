export const eye = [
  "    .  *  .",
  " .-'       '-.",
  "(     (●)     )",
  " '-.       .-'",
  "    '  *  '",
];

// ASCII drawings, in Doto at 4/3 of the nav's text size, like the stars in
// the home page's spiral. On phones they're 4/3 of the main text size,
// shrinking with the window below 768px (2.917vw is 4/3 of 16.8px at 768px).
// Line height is 130%. Doto is monospaced at 0.6em per character; ｡ and ●
// aren't in Doto and fall back to another font, so every character gets a
// 0.6em cell to keep the drawing's shape. ● is drawn 1.24× larger to match
// the mockup.
export default function Ascii({ lines }: { lines: string[] }) {
  return (
    <div
      aria-hidden
      className="font-dot text-[min(calc(4em/3),2.917vw)] leading-[1.3] font-normal tracking-normal md:text-[calc(var(--nav-text)*4/3)]"
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
