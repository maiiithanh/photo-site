import { Fragment } from "react";
import { getImageProps } from "next/image";
import { mediaUrl } from "@/lib/media";

// The home page poem, set along a golden spiral (a logarithmic spiral that
// grows by the golden ratio every quarter turn) winding clockwise outward
// from the sun photo in its middle. The first lines are set twice, the end
// wrapping around the start, then the poem breaks apart: the last line
// leaves the end of the spiral as loose letters that drift away, spacing out
// and turning more at random the farther they go.
//
// Everything is drawn in one SVG whose units are px at full size. On desktop
// it's drawn at the nav's text size, which shrinks in windows too small for
// the poem at full size (see spiralTextSize); on phones it scales to fit.

// Main text size, and the ASCII size (4/3 of it, as elsewhere on the site)
const TEXT = 16.8;
const DOT = TEXT * (4 / 3);

// Width of the spiral text below (both times round), measured in the site's
// fonts. The spiral is sized so the text exactly fills it; textLength absorbs
// any difference between browsers.
const SPIRAL_TEXT_LENGTH = 1813;

// The spiral starts this far above its centre: as tight as text can follow
const START_RADIUS = 50;

// The whole poem is turned this many degrees anticlockwise, so the spiral's
// coil sits top right and it ends heading left along the bottom. The sun
// photo moves with the spiral but stays upright.
const ROTATION = 217;

// Side of the square sun photo in the middle of the spiral
const SUN_SIZE = 75;

// Twice the drawn size, for high-density screens
const { props: sunImage } = getImageProps({
  src: mediaUrl("sunglyph.jpg"),
  alt: "",
  width: SUN_SIZE,
  height: SUN_SIZE,
});

// The part that breaks away. Spaces between words become wider gaps.
const LOOSE = "In dreams begin responsibilities :**";
// ASCII characters are drawn in Doto; these are the ones in LOOSE
const LOOSE_DOTS = 3;

type Trail = {
  // How much the drift turns, in degrees, from the end of the spiral to the
  // last letter (negative turns anticlockwise)
  turn: number;
  // 1 turns evenly along the way; higher turns sooner, then drifts straighter
  ease: number;
  // Gap after the first letter, and how much each gap grows on the last
  firstGap: number;
  growth: number;
  // How far the last letters stray from the path, in px
  scatter: number;
};

// The spiral ends heading left along its bottom. On desktop the tail drifts
// on to the left, rising a little, and ends in column 2; on phones it curls
// back up over the spiral so the poem stays narrow.
const DESKTOP: Trail = {
  turn: -50,
  ease: 2,
  firstGap: 10,
  growth: 1.012,
  scatter: 70,
};
const PHONE: Trail = {
  turn: 130,
  ease: 2,
  firstGap: 9,
  growth: 1.015,
  scatter: 60,
};

// Seeded, so the letters land in the same places on every render
function random(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// r = START_RADIUS * e^(b * t), starting at the top (angle -90°). Angles
// grow clockwise on screen, since y points down.
const START_ANGLE = -Math.PI / 2;

// Golden spiral: the radius grows by the golden ratio every quarter turn
const GROWTH = Math.log((1 + Math.sqrt(5)) / 2) / (Math.PI / 2);

// How far round the spiral goes so its text exactly fills it. Its length
// from 0 to t is √(1 + b²) / b · START_RADIUS · (e^(bt) − 1).
const SWEEP =
  Math.log(
    1 +
      (SPIRAL_TEXT_LENGTH * GROWTH) /
        (Math.sqrt(1 + GROWTH ** 2) * START_RADIUS),
  ) / GROWTH;

function spiralPoint(t: number) {
  const r = START_RADIUS * Math.exp(GROWTH * t);
  const angle = START_ANGLE + t;
  return { x: r * Math.cos(angle), y: r * Math.sin(angle) };
}

// The spiral widens as it turns, so the open space inside its first turn sits
// below and left of its centre. The sun photo is centred in that space,
// halfway between the first turn's top and bottom and its left and right.
const SUN = {
  x: (spiralPoint(Math.PI / 2).x + spiralPoint((3 * Math.PI) / 2).x) / 2,
  y: (spiralPoint(0).y + spiralPoint(Math.PI).y) / 2,
};

// Drawn as short straight segments, about a degree apart
const STEPS = Math.ceil((SWEEP * 180) / Math.PI);
const SPIRAL_POINTS = Array.from({ length: STEPS + 1 }, (_, i) =>
  spiralPoint((i / STEPS) * SWEEP),
);
const SPIRAL_PATH = SPIRAL_POINTS.map(
  ({ x, y }, i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`,
).join("");

type Letter = {
  char: string;
  x: number;
  y: number;
  rotate: number;
  dot: boolean;
};

function looseLetters(trail: Trail): Letter[] {
  const rand = random(8);
  const end = SPIRAL_POINTS.at(-1)!;
  // Direction the spiral is heading as it ends
  const t = SWEEP;
  const heading = Math.atan2(
    GROWTH * Math.sin(START_ANGLE + t) + Math.cos(START_ANGLE + t),
    GROWTH * Math.cos(START_ANGLE + t) - Math.sin(START_ANGLE + t),
  );

  const chars = Array.from(LOOSE);
  const letters: Letter[] = [];
  let { x, y } = end;
  let gap = trail.firstGap;
  chars.forEach((char, i) => {
    const progress = i / (chars.length - 1);
    const curled = 1 - (1 - progress) ** trail.ease;
    const direction = heading + ((trail.turn * Math.PI) / 180) * curled;
    // A space leaves an extra gap instead of a letter
    const step = char === " " ? gap * 1.6 : gap;
    x += step * Math.cos(direction);
    y += step * Math.sin(direction);
    gap *= trail.growth;
    if (char === " ") return;

    // Letters stray from the path and turn more the farther along they are:
    // the first few still follow the curve, the last land anywhere
    const stray = trail.scatter * progress ** 1.5;
    const across = (rand() * 2 - 1) * stray;
    const along = (rand() * 2 - 1) * stray * 0.15;
    const tilt = (rand() * 2 - 1) * (8 + 172 * progress ** 1.3);
    letters.push({
      char,
      x: x - across * Math.sin(direction) + along * Math.cos(direction),
      y: y + across * Math.cos(direction) + along * Math.sin(direction),
      rotate: (direction * 180) / Math.PI + tilt,
      dot: i >= chars.length - LOOSE_DOTS,
    });
  });
  return letters;
}

// Where a point ends up once the poem is turned
function turned({ x, y }: { x: number; y: number }) {
  const angle = (-ROTATION * Math.PI) / 180;
  return {
    x: x * Math.cos(angle) - y * Math.sin(angle),
    y: x * Math.sin(angle) + y * Math.cos(angle),
  };
}

// Area everything covers once turned, with room for the height of the
// letters
function bounds(letters: Letter[]) {
  const points = [...SPIRAL_POINTS, ...letters].map(turned);
  const pad = DOT;
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const left = Math.min(...xs) - pad;
  const top = Math.min(...ys) - pad;
  return {
    left,
    top,
    width: Math.max(...xs) + pad - left,
    height: Math.max(...ys) + pad - top,
  };
}

function Glyph({ char, x, y, rotate, dot }: Letter) {
  return (
    <text
      x={x}
      y={y}
      transform={rotate ? `rotate(${rotate.toFixed(1)} ${x} ${y})` : undefined}
      textAnchor="middle"
      dominantBaseline="central"
      className={dot ? "font-dot" : undefined}
      fontSize={dot ? DOT : TEXT}
    >
      {char}
    </text>
  );
}

const DESKTOP_BOX = bounds(looseLetters(DESKTOP));

// The nav's text size on desktop, which the poem is drawn at: full size
// (16.8px) when the poem fits the home page at that size, otherwise as large
// as fits. The home page draws it in the bottom right corner of columns 2–6,
// between 80px from the top and 50px from the bottom of the window; cqw is
// the width inside the page margins (6 columns, 5 gutters).
export const spiralTextSize = `min(${TEXT}px, calc(((100cqw - 100px) * 5 / 6 + 80px) * ${(TEXT / DESKTOP_BOX.width).toFixed(5)}), calc((100svh - 130px) * ${(TEXT / DESKTOP_BOX.height).toFixed(5)}))`;

export default function Spiral({
  phone = false,
  className,
}: {
  phone?: boolean;
  className?: string;
}) {
  const letters = looseLetters(phone ? PHONE : DESKTOP);
  const box = phone ? bounds(letters) : DESKTOP_BOX;
  const id = phone ? "spiral-phone" : "spiral";
  const sun = turned(SUN);

  return (
    <svg
      role="img"
      aria-label="It’s all a question of imagination. Our responsibility begins with the power to imagine. In dreams begin responsibilities."
      viewBox={`${box.left} ${box.top} ${box.width} ${box.height}`}
      // Sits in the bottom right corner, its right edge on the right margin.
      // On desktop it's sized so its text matches the nav's (--nav-text, set
      // to spiralTextSize in the layout); on phones it fills its box, but no
      // larger than full size.
      preserveAspectRatio="xMaxYMax meet"
      className={`absolute right-0 bottom-0 ${phone ? "h-full w-full" : ""} ${className ?? ""}`}
      style={
        phone
          ? { maxWidth: box.width, maxHeight: box.height }
          : {
              width: `calc(var(--nav-text) * ${(box.width / TEXT).toFixed(4)})`,
              height: `calc(var(--nav-text) * ${(box.height / TEXT).toFixed(4)})`,
            }
      }
      fill="currentColor"
    >
      <image
        href={sunImage.src}
        x={sun.x - SUN_SIZE / 2}
        y={sun.y - SUN_SIZE / 2}
        width={SUN_SIZE}
        height={SUN_SIZE}
      />
      <g transform={`rotate(${-ROTATION})`}>
        <path id={id} d={SPIRAL_PATH} fill="none" />
        <text fontSize={TEXT} style={{ whiteSpace: "pre" }}>
          <textPath
            href={`#${id}`}
            textLength={SPIRAL_TEXT_LENGTH}
            lengthAdjust="spacing"
          >
            {[0, 1].map((round) => (
              <Fragment key={round}>
                {round > 0 && "  "}
                <tspan className="font-dot" fontSize={DOT} letterSpacing={0}>
                  .｡.:* :**
                </tspan>
                {"  It’s all a question of imagination  "}
                <tspan className="font-dot" fontSize={DOT} letterSpacing={0}>
                  **::*:.｡.
                </tspan>
                {"  our responsibility begins with the power to imagine"}
              </Fragment>
            ))}
          </textPath>
        </text>
        {letters.map((letter, i) => (
          <Glyph key={i} {...letter} />
        ))}
      </g>
    </svg>
  );
}
