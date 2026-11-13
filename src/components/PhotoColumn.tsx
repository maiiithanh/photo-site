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
  // Span columns 3–6 instead of 4–6: horizontal photos fill the full width,
  // single vertical photos are centred at three columns wide, and pairs
  // reach one column further left (columns 2–6)
  centered?: boolean;
};

// Three columns wide, centred, inside the four-column area
const THREE_OF_FOUR = "mx-auto w-[calc((100%-60px)*3/4+40px)]";

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

  return (
    // Columns 4–6 (or 3–6 when centred), so photos end at the right margin
    // (main starts at column 3).
    // With an intro, its last line lines up with the name in the nav (140px
    // from the top, same as the nav, minus the lines above it) and the photos
    // follow 96px below it.
    // Without one, the first photo's top edge lines up with the tops of the
    // letters in the first nav link: 140px top padding + name line (1.4em) +
    // 80px gap, then 0.385em down from the top of that line to the capitals.
    <div
      className={`pb-[140px] ${centered ? "col-span-4" : "col-span-3 col-start-2"} ${intro ? "" : "pt-[calc(140px+1.4em+80px+0.385em)]"}`}
      style={
        intro && { paddingTop: `calc(140px - ${intro.length - 1} * 1.4em)` }
      }
    >
      {intro && (
        <div className="mb-[96px] text-right">
          {intro.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      )}
      <div className="flex flex-col" style={{ rowGap: gap }}>
        {rows.map((row, i) =>
          row.length === 1 ? (
            // Each photo is scaled down, never cropped, to fit three columns.
            // Height is capped at 91% of that width (from the mockup), so
            // portrait photos sit narrower than landscape ones. When centred,
            // horizontal photos fill all four columns instead.
            centered && !isPortrait(row[0]) ? (
              <figure key={row[0].key}>
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
                className={`@container flex flex-col ${centered ? `items-center ${THREE_OF_FOUR}` : "items-end"}`}
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
            // one column (plus a gutter) left of this area, so it is wider
            // than the horizontal photos but keeps the same right edge.
            <div
              key={row.map((photo) => photo.key).join()}
              className={`grid grid-cols-2 gap-x-5 ${centered ? "-ml-[calc((100%-60px)/4+20px)]" : ""}`}
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
