import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Crimson_Text, Doto } from "next/font/google";
import Nav from "@/components/Nav";
import { spiralTextSize } from "@/components/Spiral";
import "./globals.css";

const crimsonText = Crimson_Text({
  variable: "--font-crimson-text",
  // Not a variable font, so the weight has to be named
  weight: "400",
  subsets: ["latin"],
});

// Dot-matrix font, used only for the ASCII drawings
const doto = Doto({
  variable: "--font-doto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mai-Thanh Nguyen",
  description: "Photography by Mai-Thanh Nguyen",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${crimsonText.variable} ${doto.variable} h-full antialiased`}
    >
      <body className="min-h-full font-serif text-main">
        {/* Desktop grid: 6 columns, 115px margins, 20px gutters. On phones
            (below 768px) it is one column with 20px margins: the nav on top,
            then the page filling the rest of the window. */}
        {/* --nav-text: the nav's text size on desktop, shared with the home
            page's spiral so the two always match */}
        <div
          className="@container grid min-h-screen grid-cols-6 gap-x-5 px-[115px] max-md:flex max-md:min-h-svh max-md:flex-col max-md:px-5"
          style={{ "--nav-text": spiralTextSize } as CSSProperties}
        >
          <Nav />
          {/* Columns 3–6; pages place content on this subgrid */}
          <main className="col-span-4 grid grid-cols-subgrid max-md:flex max-md:flex-1 max-md:flex-col">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
