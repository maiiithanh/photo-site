import type { Metadata } from "next";
import { films, mediaUrl } from "@/lib/media";

export const metadata: Metadata = {
  title: "Films — Mai-Thanh Nguyen",
};

export default function Films() {
  return (
    // Same layout as Ongoing Works: columns 4–6, ending at the right margin,
    // with the first film's top edge level with the tops of the letters in
    // the first nav link (see PhotoColumn)
    <div className="col-span-3 col-start-2 flex flex-col gap-y-[135px] pt-[calc(140px+1.4em+80px+0.385em)] pb-[140px]">
      {films.map((film) => (
        <figure key={film.key}>
          {/* Both films are 1920×1080. Only the metadata loads until play. */}
          <video
            src={mediaUrl(film.key)}
            controls
            playsInline
            preload="metadata"
            className="aspect-video w-full bg-black"
          />
          <figcaption className="mt-[25px] text-right text-caption">
            {film.caption.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
