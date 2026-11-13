import type { CSSProperties } from "react";
import Image from "next/image";
import { mediaUrl, type Photo } from "@/lib/media";

type Props = {
  photos: Photo[];
  // Vertical space between photos, in px
  gap: number;
  // Optional lines of text shown above the photos, one per line
  intro?: string[];
  // Put consecutive vertical photos side by side in pairs, like a gallery:
  // two equal tiles a gutter apart, cropped to 4:5
  pairPortraits?: boolean;
  // Span columns 3–6 instead of 4–6. Pairs are 90% as wide as columns 2–6
  // and end at the right margin; every other photo is centred on the pairs:
  // horizontal photos at four columns wide, single vertical photos at three
  centered?: boolean;
};

// Three columns wide, centred, inside the four-column area (full width on
// phones)
const THREE_OF_FOUR = "mx-auto w-[calc((100%-60px)*3/4+40px)] max-md:w-full";

// Width of a centred pair: 90% of columns 2–6 (this area plus one column
// and a gutter)
const PAIR_WIDTH = "0.9 * (100% + (100% - 60px) / 4 + 20px)";

// Moves a photo centred in this area left, so its centre lines up with the
// centre of the pairs. Desktop only: on phones every photo is full width.
const ON_PAIR_AXIS = "md:relative md:right-(--pair-axis)";

// Space between two rows of pairs: the same as the gutter between the two
// photos in a pair
const PAIR_ROW_GAP = "mt-5";

function isPortrait(photo: Photo) {
  return photo.height > photo.width;
}

// Splits photos into rows: one photo each, or two consecutive vertical
// photos when pairing
function toRows(photos: Photo[], pairPortraits: boolean) {
  const rows: Photo[][] = [];
  for (const photo of photos) {
    const last = rows.at(-1);
    if (
      pairPortraits &&
      isPortrait(photo) &&
      last?.length === 1 &&
      isPortrait(last[0])
    ) {
      last.push(photo);
    } else {
      rows.push([photo]);
    }
  }
  return rows;
}

function Caption({ lines }: { lines: string[] }) {
  return (
    <figcaption className="mt-[25px] text-right text-caption">
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </figcaption>
  );
}

export default function PhotoColumn({
  photos,
  gap,
  intro,
  pairPortraits = false,
  centered = false,
}: Props) {
  const rows = toRows(photos, pairPortraits);

  // Space above each row after the first. On phones it's half the desktop
  // gap, except between rows of pairs, which stay a gutter apart.
  function rowGap(i: number) {
    if (i === 0) return "";
    if (rows[i].length === 2 && rows[i - 1].length === 2) return PAIR_ROW_GAP;
    return "mt-(--gap) max-md:mt-[calc(var(--gap)/2)]";
  }

  return (
    // Columns 4–6 (or 3–6 when centred), so photos end at the right margin
    // (main starts at column 3).
    // With an intro, its last line lines up with the name in the nav (140px
    // from the top, same as the nav, minus the lines above it) and the photos
    // follow 96px below it.
    // Without one, the first photo's top edge lines up with the tops of the
    // letters in the first nav link: 140px top padding + name line (1.4em) +
    // 80px gap, then 0.385em down from the top of that line to the capitals.
    // On phones the nav is above the page, so there's nothing to line up with.
    <div
      className={`pb-[140px] max-md:pt-10 max-md:pb-16 ${centered ? "col-span-4" : "col-span-3 col-start-2"} ${intro ? "md:pt-(--intro-top)" : "md:pt-[calc(140px+1.4em+80px+0.385em)]"}`}
      style={
        {
          "--gap": `${gap}px`,
          "--intro-top": intro && `calc(140px - ${intro.length - 1} * 1.4em)`,
          "--pair-axis": `calc(${PAIR_WIDTH} / 2 - 50%)`,
          "--pair-width": `calc(${PAIR_WIDTH})`,
        } as CSSProperties
      }
    >
      {intro && (
        <div className="mb-[96px] text-right max-md:mb-10">
          {intro.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      )}
      <div className="flex flex-col">
        {rows.map((row, i) =>
          row.length === 1 ? (
            // Each photo is scaled down, never cropped, to fit three columns.
            // Height is capped at 91% of that width (from the mockup), so
            // portrait photos sit narrower than landscape ones. When centred,
            // horizontal photos fill all four columns instead.
            centered && !isPortrait(row[0]) ? (
              <figure key={row[0].key} className={`${ON_PAIR_AXIS} ${rowGap(i)}`}>
                <Image
                  src={mediaUrl(row[0].key)}
                  alt={row[0].alt ?? row[0].caption?.[0] ?? ""}
                  width={row[0].width}
                  height={row[0].height}
                  sizes="60vw"
                  preload={i === 0}
                  className="h-auto w-full"
                />
                {row[0].caption && <Caption lines={row[0].caption} />}
              </figure>
            ) : (
              <figure
                key={row[0].key}
                className={`@container flex flex-col ${centered ? `items-center ${THREE_OF_FOUR} ${ON_PAIR_AXIS}` : "items-end"} ${rowGap(i)}`}
              >
                <Image
                  src={mediaUrl(row[0].key)}
                  alt={row[0].alt ?? row[0].caption?.[0] ?? ""}
                  width={row[0].width}
                  height={row[0].height}
                  sizes="50vw"
                  preload={i === 0}
                  className="h-auto max-h-[91cqw] w-auto max-w-full"
                />
                {row[0].caption && <Caption lines={row[0].caption} />}
              </figure>
            )
          ) : (
            // A pair is two equal tiles, a 20px gutter apart, each photo
            // cropped to 4:5 from its centre. When centred, the row reaches
            // left past this area, so it is wider than the horizontal photos
            // but keeps the same right edge (on desktop; phones have no
            // room to reach past, so pairs are full width there).
            // Wider than this area, so the overhang is set explicitly to keep
            // the right edge on the margin.
            <div
              key={row.map((photo) => photo.key).join()}
              className={`grid grid-cols-2 gap-x-5 ${centered ? "md:ml-[calc(100%-var(--pair-width))] md:w-(--pair-width)" : ""} ${rowGap(i)}`}
            >
              {row.map((photo) => (
                <figure key={photo.key}>
                  <Image
                    src={mediaUrl(photo.key)}
                    alt={photo.alt ?? photo.caption?.[0] ?? ""}
                    width={photo.width}
                    height={photo.height}
                    sizes="40vw"
                    preload={i === 0}
                    className="aspect-[4/5] w-full object-cover"
                  />
                  {photo.caption && <Caption lines={photo.caption} />}
                </figure>
              ))}
            </div>
          ),
        )}
      </div>
    </div>
  );
}
