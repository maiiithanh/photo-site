// Files are served from S3 through CloudFront. The distribution's origin path
// is /maithanh-portfolio, so keys here start at the folder inside it.
export const MEDIA_BASE_URL = "https://do3f2il71j0xu.cloudfront.net";

export function mediaUrl(key: string) {
  return `${MEDIA_BASE_URL}/${key.split("/").map(encodeURIComponent).join("/")}`;
}

export type Work = {
  key: string;
  // Each entry is one line of the caption
  caption: string[];
};

export type Photo = {
  key: string;
  // Pixel dimensions of the source file, so the browser can reserve space
  width: number;
  height: number;
  // Each entry is one line of the caption
  caption?: string[];
  // Defaults to the first caption line
  alt?: string;
};

export const ongoingWorks: Photo[] = [
  {
    key: "Ongoing/ongoing-1.jpg",
    width: 2376,
    height: 3000,
    caption: ["Mom in her wedding dress, 2026", "4x5 sheet film"],
  },
  {
    key: "Ongoing/ongoing-2.jpg",
    width: 2321,
    height: 3000,
    caption: ["Untitled, 2026", "4x5 sheet film"],
  },
  {
    key: "Ongoing/ongoing-3.jpg",
    width: 3000,
    height: 2000,
    caption: ["Horse, 2025"],
  },
  {
    key: "Ongoing/ongoing-4.jpg",
    width: 3000,
    height: 2219,
    caption: ["Untitled, 2026"],
  },
  {
    key: "Ongoing/ongoing-5.jpg",
    width: 3000,
    height: 2000,
    caption: ["Untitled, 2025"],
  },
  {
    key: "Ongoing/ongoing-6.jpg",
    width: 2297,
    height: 3000,
    caption: ["Untitled, 2026"],
  },
  {
    key: "Ongoing/ongoing-7.jpg",
    width: 2143,
    height: 3000,
    caption: ["Untitled, 2026"],
  },
  {
    key: "Ongoing/ongoing-8.jpg",
    width: 2339,
    height: 3000,
    caption: ["Montjoi, 2024", "4x5 sheet film"],
  },
  {
    key: "Ongoing/ongoing-9.jpg",
    width: 3000,
    height: 2000,
    caption: ["What the machines want to hear (1/2), 2026"],
  },
  {
    key: "Ongoing/ongoing-10.jpg",
    width: 3000,
    height: 2603,
    caption: ["What the machines want to hear (2/2), 2026"],
  },
];

// Commissioned: Arcana, 06 first, then reverse file-name order (13 first), no captions
export const commissioned: Photo[] = [
  {
    key: "Arcana/arcana-06.jpg",
    width: 3000,
    height: 1779,
    alt: "Arcana, photo 1 of 13",
  },
  {
    key: "Arcana/arcana-13.jpg",
    width: 3000,
    height: 2221,
    alt: "Arcana, photo 2 of 13",
  },
  {
    key: "Arcana/arcana-12.jpg",
    width: 3000,
    height: 2000,
    alt: "Arcana, photo 3 of 13",
  },
  {
    key: "Arcana/arcana-11.jpg",
    width: 3000,
    height: 2000,
    alt: "Arcana, photo 4 of 13",
  },
  {
    key: "Arcana/arcana-10.jpg",
    width: 2006,
    height: 3000,
    alt: "Arcana, photo 5 of 13",
  },
  {
    key: "Arcana/arcana-09.jpg",
    width: 2000,
    height: 3000,
    alt: "Arcana, photo 6 of 13",
  },
  {
    key: "Arcana/arcana-08.jpg",
    width: 2464,
    height: 3000,
    alt: "Arcana, photo 7 of 13",
  },
  {
    key: "Arcana/arcana-07.jpg",
    width: 2000,
    height: 3000,
    alt: "Arcana, photo 8 of 13",
  },
  {
    key: "Arcana/arcana-05.jpg",
    width: 2245,
    height: 3000,
    alt: "Arcana, photo 9 of 13",
  },
  {
    key: "Arcana/arcana-04.jpg",
    width: 2096,
    height: 3000,
    alt: "Arcana, photo 10 of 13",
  },
  {
    key: "Arcana/arcana-03.jpg",
    width: 3000,
    height: 2000,
    alt: "Arcana, photo 11 of 13",
  },
  {
    key: "Arcana/arcana-02.jpg",
    width: 3000,
    height: 2026,
    alt: "Arcana, photo 12 of 13",
  },
  {
    key: "Arcana/arcana-01.jpg",
    width: 1841,
    height: 3000,
    alt: "Arcana, photo 13 of 13",
  },
];

export const films: Work[] = [
  {
    key: "Films/Adobe Express - FishGirl(smallersize).mp4",
    caption: ["Fish Girl, 2024", "16mm film"],
  },
  {
    key: "Films/Adobe Express - Final.mp4",
    caption: ["Dictum & the Implicates, 2024", "16mm film"],
  },
];
