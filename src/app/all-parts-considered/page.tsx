import type { CSSProperties } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Parts Considered — Mai-Thanh Nguyen",
};

const header = [
  "All Parts Considered",
  "Problem Library",
  "1288 15th Ave, San Francisco",
];

export default function AllPartsConsidered() {
  return (
    // Columns 3–6. The header's last line lines up with the name in the nav
    // (140px from the top, minus the lines above it). On phones the nav is
    // above the page, so spacing is simply tighter.
    <div
      className="col-span-4 pb-[140px] md:pt-(--header-top) max-md:pt-10 max-md:pb-16"
      style={
        { "--header-top": `calc(140px - ${header.length - 1} * 1.4em)` } as CSSProperties
      }
    >
      <div className="text-right">
        {header.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      {/* The first line lines up with the second nav link: the 80px gap
          below the name, plus one nav line */}
      <div className="mt-[calc(80px+1.4em)] text-justify max-md:mt-10">
        <p>
          I participated in{" "}
          <a
            href="https://problemlibrary.org/event/all-parts-considered/"
            target="_blank"
            rel="noopener noreferrer"
            className="dot-underline"
          >
            All Parts Considered
          </a>
          , a group exhibition featuring 21 artists and curated by Sofia
          Criswell and Halden Willard. Drawing inspiration from the Surrealist
          parlor game Exquisite Corpse, the exhibition explores the
          possibilities of collective authorship and the construction of the
          body.
        </p>
        <p className="mt-[1.4em]">
          In the game, multiple participants contribute to a shared drawing,
          each working in isolation and unaware of the others’ contributions.
          Only when the paper is unfolded do the disparate fragments come
          together to reveal a composite figure.
        </p>
      </div>

      {/* Columns 5–6, right-aligned; full width on phones */}
      <figure className="mt-[150px] ml-auto w-[calc((100%-20px)/2)] max-md:mt-16 max-md:w-full">
        {/* Placeholder until AllPartsConsidered.jpg is uploaded to S3 */}
        <div className="aspect-[256/355] w-full bg-neutral-200" />
        <figcaption className="mt-4 text-right text-secondary">
          <span className="block">Legs, 2026</span>
          <span className="block">Acrylic on canvas, mother of pearl</span>
        </figcaption>
      </figure>
    </div>
  );
}
