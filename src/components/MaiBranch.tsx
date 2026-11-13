import type { CSSProperties } from "react";

// A mai (Vietnamese apricot blossom) branch in Doto characters, traced from
// a dot-to-dot drawing: the trunk rises from the bottom and splits into two
// arms, with blossoms (* + .) where the drawing's dots are. The trunk uses
// only # % = _ | / \, so blossom characters never appear in it.
const ART = String.raw`
                                  *  *
                                   *+* **
                                    *** * *
                                      . *
                                       * *
                                      .  +
                              *+*.  *    * .
                        +*  **   +* *                            + *+
                         *   * +*          +*                 ++ *
                         *+*\\               .*                   +
                **     +    \\\\           **+                .*+
                +++  *         \            ..            +.*
              * +** .\         ||+       *   */ ++      * .* *
             *. ** + \\\        |*       * * %\  +      //_=\\
         . .*  *     *\\\     |%#\**   *.  //%\\\*    ///   .\*.
     **  *+               .  *|/_\%| *   =_/    \%\++//.  *+  +
 *+++    **                    .  |#             \\##|
  ** * *                          %%               \##   *  *
    *                            *|\%\              |#| **.*
  * *                               \#|             +##  * *
 ..                                  %%             |#%|    *
                                    |#%      ___     ###*
                                     %########%#%%\_/###**
                                                _\%####|
                                                   |%#|*
                                                  *|##|
                                                   |##|
                                                  *|##%.
                                                   %###\\**
                                                 _/######
                                              ./#######%|*
                                           */%########%|
                                          /#######/=/*
                                       */%######%/
                                       /%#####%/
                                    */#######%
                                    |#######/
                                  .|#######/
                                   %#####%/
                                 .%#####%+`
  .slice(1)
  .split("\n");

const BLOSSOMS = new Set(["*", "+", "."]);

// Where the trunk leaves the bottom of the drawing; blossoms open in order of
// distance from here, so the branch seems to bloom outward
const BASE = { row: ART.length - 1, col: 38 };

function distanceFromBase(row: number, col: number) {
  // Columns are 0.6 as wide as rows are tall
  return Math.hypot(row - BASE.row, (col - BASE.col) * 0.6);
}

const FARTHEST = Math.max(
  ...ART.flatMap((line, row) =>
    Array.from(line, (_, col) => distanceFromBase(row, col)),
  ),
);

// Blossoms that drop a petal, as [row, col]
const PETAL_SOURCES = [
  [17, 2],
  [12, 14],
  [6, 32],
  [10, 44],
  [18, 56],
  [10, 63],
];

function blossomStyle(row: number, col: number, n: number): CSSProperties {
  const bloom = 0.3 + (distanceFromBase(row, col) / FARTHEST) * 2.4;
  // About a third of the blossoms keep twinkling after they open, each at
  // its own pace
  const twinkle =
    n % 3 === 0
      ? `, mai-twinkle ${5 + (n % 5)}s ease-in-out ${bloom + 1 + (n % 7) * 0.6}s infinite`
      : "";
  return { animation: `mai-bloom 0.9s ease-out ${bloom}s both${twinkle}` };
}

export default function MaiBranch() {
  let n = 0;
  return (
    // 10px, shrinking with the window below 625px wide (1.6vw is 10px at
    // 625px), so it fits under the text on phones. 0.75svh keeps it in the
    // window on short phones too.
    <div
      aria-hidden
      className="mai-motion relative font-dot text-[min(10px,1.6vw,0.75svh)] leading-none font-normal tracking-normal whitespace-pre"
    >
      {ART.map((line, row) => (
        <div key={row} className="flex h-[1em]">
          {Array.from(line).map((char, col) => (
            <span
              key={col}
              className="inline-block w-[0.6em] text-center"
              style={BLOSSOMS.has(char) ? blossomStyle(row, col, n++) : undefined}
            >
              {char}
            </span>
          ))}
        </div>
      ))}
      {/* Petals fall from a few blossoms, each on its own long loop */}
      {PETAL_SOURCES.map(([row, col], i) => (
        <span
          key={i}
          className="mai-petal absolute w-[0.6em] text-center"
          style={{
            top: `${row}em`,
            left: `${col * 0.6}em`,
            animation: `mai-fall ${11 + i * 1.7}s linear ${3 + i * 2.3}s infinite both`,
          }}
        >
          .
        </span>
      ))}
    </div>
  );
}
